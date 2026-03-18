import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import type { Json } from '@/integrations/supabase/types';
import { 
  ValuationFormData, 
  WizardState, 
  defaultFormData, 
  getVisibleSteps,
  getStepByVisibleIndex 
} from '@/types/valuation';

const STORAGE_KEY = 'valuation_wizard_draft';
const SESSION_KEY = 'valuation_session_id';
const SESSION_EXPIRY_DAYS = 30;

// Generate or get session ID from cookie/localStorage
const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
};

// Normalize Slovak phone number to +421 format
export const normalizePhone = (phone: string): string => {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (digits.startsWith('421')) {
    return '+' + digits;
  } else if (digits.startsWith('0')) {
    return '+421' + digits.slice(1);
  } else if (digits.length === 9) {
    return '+421' + digits;
  }
  
  return phone; // Return original if can't normalize
};

// Validate Slovak phone number
export const isValidPhone = (phone: string): boolean => {
  const normalized = normalizePhone(phone);
  // Slovak mobile: +421 9XX XXX XXX (12 digits total with +421)
  // Slovak landline: +421 2X XXX XXXX
  return /^\+421[0-9]{9}$/.test(normalized);
};

interface UseWizardStateOptions {
  onComplete?: (data: ValuationFormData, submissionId: string) => void;
  onPhoneCaptured?: (phone: string, submissionId: string) => void;
}

export function useWizardState(options: UseWizardStateOptions = {}) {
  const [state, setState] = useState<WizardState>(() => {
    // Try to load draft from localStorage
    const savedDraft = localStorage.getItem(STORAGE_KEY);
    const sessionId = getSessionId();
    
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        return {
          currentStep: parsed.currentStep || 1,
          formData: { ...defaultFormData, ...parsed.formData },
          submissionId: parsed.submissionId || null,
          sessionId,
          isSubmitting: false,
          isSaving: false,
        };
      } catch (e) {
        console.error('Failed to parse saved draft:', e);
      }
    }
    
    return {
      currentStep: 1,
      formData: defaultFormData,
      submissionId: null,
      sessionId,
      isSubmitting: false,
      isSaving: false,
    };
  });

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasPhoneBeenCaptured = useRef(false);

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentStep: state.currentStep,
      formData: state.formData,
      submissionId: state.submissionId,
    }));
  }, [state.currentStep, state.formData, state.submissionId]);

  // Save to database (debounced)
  const saveToDatabase = useCallback(async () => {
    setState(prev => ({ ...prev, isSaving: true }));
    
    try {
      const phoneNormalized = state.formData.phone 
        ? normalizePhone(state.formData.phone) 
        : null;

      const submissionData = {
        session_id: state.sessionId,
        current_step: state.currentStep,
        name: state.formData.name || null,
        phone: state.formData.phone || null,
        phone_normalized: phoneNormalized,
        gdpr_consent: state.formData.gdprConsent,
        property_type: state.formData.propertyType,
        form_data: JSON.parse(JSON.stringify(state.formData)) as Json,
        photos: state.formData.photos,
        status: 'nove' as const,
      };

      if (state.submissionId) {
        // Update existing submission
        const { error } = await supabase
          .from('submissions')
          .update(submissionData)
          .eq('id', state.submissionId);
        
        if (error) throw error;
      } else {
        // Create new submission
        const { data, error } = await supabase
          .from('submissions')
          .insert(submissionData)
          .select('id')
          .single();
        
        if (error) throw error;
        
        if (data) {
          setState(prev => ({ ...prev, submissionId: data.id }));
          
          // Trigger phone captured callback if valid phone
          if (isValidPhone(state.formData.phone) && !hasPhoneBeenCaptured.current) {
            hasPhoneBeenCaptured.current = true;
            options.onPhoneCaptured?.(phoneNormalized!, data.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to save to database:', error);
    } finally {
      setState(prev => ({ ...prev, isSaving: false }));
    }
  }, [state.sessionId, state.currentStep, state.formData, state.submissionId, options]);

  // Track step view for analytics
  const trackStepView = useCallback(async (stepNumber: number, stepName: string) => {
    try {
      await supabase
        .from('step_analytics')
        .upsert({
          session_id: state.sessionId,
          step_number: stepNumber,
          step_name: stepName,
        }, {
          onConflict: 'session_id,step_number',
          ignoreDuplicates: true,
        });
    } catch (error) {
      console.error('Failed to track step view:', error);
    }
  }, [state.sessionId]);

  // Update form data
  const updateFormData = useCallback((updates: Partial<ValuationFormData>) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, ...updates },
    }));
  }, []);

  // Go to next step
  const nextStep = useCallback(() => {
    const visibleSteps = getVisibleSteps(state.formData);
    const currentVisibleIndex = visibleSteps.findIndex(
      s => s.number === getStepByVisibleIndex(state.currentStep, state.formData)?.number
    );
    
    if (currentVisibleIndex < visibleSteps.length - 1) {
      const nextStepConfig = visibleSteps[currentVisibleIndex + 1];
      setState(prev => ({ ...prev, currentStep: currentVisibleIndex + 2 }));
      trackStepView(nextStepConfig.number, nextStepConfig.name);
    }
  }, [state.formData, state.currentStep, trackStepView]);

  // Go to previous step
  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  }, [state.currentStep]);

  // Send data to webhook
  const sendToWebhook = async (formData: ValuationFormData, submissionId: string) => {
    try {
      const webhookUrl = 'https://gs.n8n.grew.studio/webhook/07f3e6d2-839f-44e3-9ef0-dfb849d4297f';
      
      const payload = {
        submissionId,
        sessionId: state.sessionId,
        timestamp: new Date().toISOString(),
        contact: {
          name: formData.name,
          phone: formData.phone,
          phoneNormalized: normalizePhone(formData.phone),
          gdprConsent: formData.gdprConsent,
        },
        property: {
          type: formData.propertyType,
          address: {
            street: formData.street,
            city: formData.city,
            zipCode: formData.zipCode,
          },
          floorArea: formData.floorArea,
          rooms: formData.rooms,
          floor: formData.floor,
          hasElevator: formData.hasElevator,
          condition: formData.condition,
          accessories: formData.accessories,
          yearBuilt: formData.yearBuilt,
          yearRenovated: formData.yearRenovated,
          heatingType: formData.heatingType,
          heatingNote: formData.heatingNote,
          note: formData.note,
        },
        photos: formData.photos,
      };

      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      console.log('Webhook sent successfully');
    } catch (error) {
      console.error('Failed to send webhook:', error);
      // Don't throw - webhook failure shouldn't block form submission
    }
  };

  // Submit wizard
  const submitWizard = useCallback(async () => {
    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const phoneNormalized = normalizePhone(state.formData.phone);
      
      const { error } = await supabase
        .from('submissions')
        .update({
          status: 'uzavrete' as const,
          current_step: state.currentStep,
          name: state.formData.name,
          phone: state.formData.phone,
          phone_normalized: phoneNormalized,
          gdpr_consent: state.formData.gdprConsent,
          property_type: state.formData.propertyType,
          form_data: JSON.parse(JSON.stringify(state.formData)) as Json,
          photos: state.formData.photos,
        })
        .eq('id', state.submissionId);
      
      if (error) throw error;
      
      // Send data to n8n webhook
      await sendToWebhook(state.formData, state.submissionId!);
      
      // Clear draft
      localStorage.removeItem(STORAGE_KEY);
      
      // Call completion callback
      options.onComplete?.(state.formData, state.submissionId!);
      
      return true;
    } catch (error) {
      console.error('Failed to submit:', error);
      return false;
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state.formData, state.submissionId, state.currentStep, options, state.sessionId]);

  // Reset wizard
  const resetWizard = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSION_KEY);
    hasPhoneBeenCaptured.current = false;
    
    setState({
      currentStep: 1,
      formData: defaultFormData,
      submissionId: null,
      sessionId: getSessionId(),
      isSubmitting: false,
      isSaving: false,
    });
  }, []);

  // Auto-save on form data changes (debounced)
  useEffect(() => {
    saveDraft();
    
    // Debounce database save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveToDatabase();
    }, 1000);
    
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.formData, saveDraft, saveToDatabase]);

  // Track initial step view
  useEffect(() => {
    const currentStepConfig = getStepByVisibleIndex(state.currentStep, state.formData);
    if (currentStepConfig) {
      trackStepView(currentStepConfig.number, currentStepConfig.name);
    }
  }, []);

  return {
    ...state,
    updateFormData,
    nextStep,
    prevStep,
    submitWizard,
    resetWizard,
    visibleSteps: getVisibleSteps(state.formData),
    totalVisibleSteps: getVisibleSteps(state.formData).length,
  };
}
