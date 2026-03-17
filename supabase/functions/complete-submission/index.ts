import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CompleteSubmissionRequest {
  submissionId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId }: CompleteSubmissionRequest = await req.json();
    console.log('Processing complete submission:', submissionId);

    if (!submissionId) {
      throw new Error('Missing submissionId');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch submission
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchError || !submission) {
      console.error('Failed to fetch submission:', fetchError);
      throw new Error('Submission not found');
    }

    console.log('Found submission:', submission.name, submission.phone_normalized);

    // Mark as complete
    const { error: updateError } = await supabase
      .from('submissions')
      .update({ status: 'complete' })
      .eq('id', submissionId);

    if (updateError) {
      console.error('Failed to update submission status:', updateError);
      throw updateError;
    }

    // Check if we have Resend API key for email
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const notificationEmail = Deno.env.get('NOTIFICATION_EMAIL');
    
    if (resendApiKey && notificationEmail && !submission.email_sent) {
      try {
        const resend = new Resend(resendApiKey);
        console.log('Sending email notification to:', notificationEmail);

        const formData = submission.form_data as Record<string, any>;
        const propertyTypeLabel = 
          submission.property_type === 'byt' ? 'Byt' :
          submission.property_type === 'dom' ? 'Dom' : 'Pozemok';
        
        const conditionLabel = 
          formData.condition === 'original' ? 'Pôvodný stav' :
          formData.condition === 'renovated' ? 'Po rekonštrukcii' : 'Novostavba';

        const heatingLabel = 
          formData.heatingType === 'central' ? 'Centrálne (CZT)' :
          formData.heatingType === 'gas' ? 'Plynové' :
          formData.heatingType === 'electric' ? 'Elektrické' :
          formData.heatingType === 'solid_fuel' ? 'Tuhé palivo' :
          formData.heatingType === 'heat_pump' ? 'Tepelné čerpadlo' :
          formData.heatingNote || 'Iné';

        const accessoriesText = [
          formData.accessories?.hasBalcony ? `Balkón (${formData.accessories.balconySize || '?'} m²)` : null,
          formData.accessories?.hasTerrace ? `Terasa (${formData.accessories.terraceSize || '?'} m²)` : null,
          formData.accessories?.hasCellar ? `Pivnica (${formData.accessories.cellarSize || '?'} m²)` : null,
          formData.accessories?.parkingType && formData.accessories.parkingType !== 'none' 
            ? `Parkovanie: ${formData.accessories.parkingType}${formData.accessories.parkingCount ? ` (${formData.accessories.parkingCount}x)` : ''}`
            : null,
        ].filter(Boolean).join(', ') || 'Žiadne';

        const emailHtml = `
          <h1>Nový lead - Ocenenie nehnuteľnosti</h1>
          
          <h2>Kontakt</h2>
          <p><strong>Meno:</strong> ${submission.name}</p>
          <p><strong>Telefón:</strong> ${submission.phone_normalized || submission.phone}</p>
          
          <h2>Nehnuteľnosť</h2>
          <p><strong>Typ:</strong> ${propertyTypeLabel}</p>
          <p><strong>Adresa:</strong> ${formData.street}, ${formData.city}, ${formData.zipCode}</p>
          <p><strong>Plocha:</strong> ${formData.floorArea} m²</p>
          <p><strong>Izby:</strong> ${formData.rooms}</p>
          ${submission.property_type === 'byt' ? `<p><strong>Poschodie:</strong> ${formData.floor}, Výťah: ${formData.hasElevator ? 'Áno' : 'Nie'}</p>` : ''}
          <p><strong>Stav:</strong> ${conditionLabel}</p>
          <p><strong>Príslušenstvo:</strong> ${accessoriesText}</p>
          <p><strong>Rok výstavby:</strong> ${formData.yearBuilt}${formData.yearRenovated ? `, Rekonštrukcia: ${formData.yearRenovated}` : ''}</p>
          <p><strong>Kúrenie:</strong> ${heatingLabel}</p>
          
          ${formData.note ? `<h2>Poznámka</h2><p>${formData.note}</p>` : ''}
          
          ${submission.photos?.length ? `<h2>Fotky</h2><p>Počet: ${submission.photos.length}</p>` : ''}
          
          <hr />
          <p><small>Submission ID: ${submissionId}</small></p>
        `;

        await resend.emails.send({
          from: 'Ocenenie Nehnuteľnosti <onboarding@resend.dev>',
          to: [notificationEmail],
          subject: `Nový lead: ${formData.rooms}-izb. ${propertyTypeLabel.toLowerCase()}, ${formData.city}`,
          html: emailHtml,
        });

        // Mark email as sent
        await supabase
          .from('submissions')
          .update({ email_sent: true })
          .eq('id', submissionId);

        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    // Check if we have Twilio credentials for SMS
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFrom = Deno.env.get('TWILIO_PHONE_FROM');
    const twilioTo = Deno.env.get('TWILIO_PHONE_TO');

    if (twilioSid && twilioToken && twilioFrom && twilioTo && !submission.complete_sms_sent) {
      try {
        console.log('Sending SMS notification');
        const formData = submission.form_data as Record<string, any>;
        const propertyTypeLabel = 
          submission.property_type === 'byt' ? 'byt' :
          submission.property_type === 'dom' ? 'dom' : 'pozemok';
        
        const conditionLabel = 
          formData.condition === 'original' ? 'pôv.' :
          formData.condition === 'renovated' ? 'rek.' : 'novo.';

        const smsBody = `LEAD: ${formData.rooms}-izb. ${propertyTypeLabel}, ${formData.city}, ${formData.floorArea}m², ${conditionLabel}. Tel: ${submission.phone_normalized}`;

        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
        const response = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + btoa(`${twilioSid}:${twilioToken}`),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: twilioTo,
            From: twilioFrom,
            Body: smsBody,
          }),
        });

        if (!response.ok) {
          throw new Error(`Twilio error: ${response.status}`);
        }

        // Mark SMS as sent
        await supabase
          .from('submissions')
          .update({ complete_sms_sent: true })
          .eq('id', submissionId);

        console.log('SMS sent successfully');
      } catch (smsError) {
        console.error('Failed to send SMS:', smsError);
      }
    }

    // Call webhook if configured
    const webhookUrl = Deno.env.get('WEBHOOK_URL');
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET');

    if (webhookUrl && !submission.webhook_sent) {
      try {
        console.log('Calling webhook:', webhookUrl);
        const payload = JSON.stringify({
          event: 'submission.complete',
          submission: {
            id: submissionId,
            name: submission.name,
            phone: submission.phone_normalized,
            property_type: submission.property_type,
            form_data: submission.form_data,
            photos: submission.photos,
            created_at: submission.created_at,
          },
        });

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (webhookSecret) {
          // Create simple signature
          const encoder = new TextEncoder();
          const key = await crypto.subtle.importKey(
            'raw',
            encoder.encode(webhookSecret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
          );
          const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
          headers['X-Webhook-Signature'] = Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        }

        await fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: payload,
        });

        // Mark webhook as sent
        await supabase
          .from('submissions')
          .update({ webhook_sent: true })
          .eq('id', submissionId);

        console.log('Webhook called successfully');
      } catch (webhookError) {
        console.error('Failed to call webhook:', webhookError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, submissionId }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in complete-submission:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
