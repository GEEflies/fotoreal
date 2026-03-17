// Property types enum
export type PropertyType = 'byt' | 'dom' | 'pozemok';

// Submission status enum
export type SubmissionStatus = 'draft' | 'phone_captured' | 'complete';

// Heating types
export type HeatingType = 
  | 'central' 
  | 'gas' 
  | 'electric' 
  | 'solid_fuel' 
  | 'heat_pump' 
  | 'other';

// Property condition
export type PropertyCondition = 
  | 'original' 
  | 'renovated' 
  | 'new_build';

// Parking types
export type ParkingType = 
  | 'none' 
  | 'street' 
  | 'parking_spot' 
  | 'garage';

// Accessories data
export interface AccessoriesData {
  hasBalcony: boolean;
  balconySize?: number;
  hasTerrace: boolean;
  terraceSize?: number;
  hasCellar: boolean;
  cellarSize?: number;
  parkingType: ParkingType;
  parkingCount?: number;
}

// Form data interface
export interface ValuationFormData {
  // Step 1: Contact
  name: string;
  phone: string;
  gdprConsent: boolean;
  
  // Step 2: Property type
  propertyType: PropertyType | null;
  
  // Step 3: Address
  street: string;
  city: string;
  zipCode: string;
  
  // Step 4: Floor area
  floorArea: number;
  
  // Step 5: Rooms
  rooms: number;
  
  // Step 6: Floor & Elevator (only for 'byt')
  floor?: number;
  hasElevator?: boolean;
  
  // Step 7: Condition
  condition: PropertyCondition | null;
  
  // Step 8: Accessories
  accessories: AccessoriesData;
  
  // Step 9: Years
  yearBuilt: number | null;
  yearRenovated: number | null;
  
  // Step 10: Heating
  heatingType: HeatingType | null;
  heatingNote?: string;
  
  // Step 11: Photos & Notes
  photos: string[];
  note?: string;
}

// Step configuration
export interface StepConfig {
  number: number;
  name: string;
  label: string;
  isConditional?: boolean;
  condition?: (data: ValuationFormData) => boolean;
}

// Wizard state
export interface WizardState {
  currentStep: number;
  formData: ValuationFormData;
  submissionId: string | null;
  sessionId: string;
  isSubmitting: boolean;
  isSaving: boolean;
}

// Default form data
export const defaultFormData: ValuationFormData = {
  name: '',
  phone: '',
  gdprConsent: false,
  propertyType: null,
  street: '',
  city: '',
  zipCode: '',
  floorArea: 50,
  rooms: 2,
  floor: undefined,
  hasElevator: undefined,
  condition: null,
  accessories: {
    hasBalcony: false,
    hasTerrace: false,
    hasCellar: false,
    parkingType: 'none',
  },
  yearBuilt: null,
  yearRenovated: null,
  heatingType: null,
  heatingNote: '',
  photos: [],
  note: '',
};

// Step definitions
export const STEPS: StepConfig[] = [
  { number: 1, name: 'contact', label: 'Kontakt' },
  { number: 2, name: 'property_type', label: 'Typ nehnuteľnosti' },
  { number: 3, name: 'address', label: 'Adresa' },
  { number: 4, name: 'floor_area', label: 'Plocha' },
  { number: 5, name: 'rooms', label: 'Izby' },
  { 
    number: 6, 
    name: 'floor_elevator', 
    label: 'Poschodie a výťah',
    isConditional: true,
    condition: (data) => data.propertyType === 'byt'
  },
  { number: 7, name: 'condition', label: 'Stav' },
  { number: 8, name: 'accessories', label: 'Príslušenstvo' },
  { number: 9, name: 'years', label: 'Roky' },
  { number: 10, name: 'heating', label: 'Kúrenie' },
  { number: 11, name: 'photos', label: 'Fotky a poznámky' },
];

// Get visible steps based on form data
export const getVisibleSteps = (formData: ValuationFormData): StepConfig[] => {
  return STEPS.filter(step => {
    if (!step.isConditional) return true;
    return step.condition?.(formData) ?? true;
  });
};

// Get step by number from visible steps
export const getStepByVisibleIndex = (
  visibleIndex: number, 
  formData: ValuationFormData
): StepConfig | undefined => {
  const visibleSteps = getVisibleSteps(formData);
  return visibleSteps[visibleIndex - 1];
};

// Get visible index for a step number
export const getVisibleIndex = (
  stepNumber: number, 
  formData: ValuationFormData
): number => {
  const visibleSteps = getVisibleSteps(formData);
  const index = visibleSteps.findIndex(s => s.number === stepNumber);
  return index + 1;
};
