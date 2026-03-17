import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PhoneAlertRequest {
  submissionId: string;
  phone: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { submissionId, phone, name }: PhoneAlertRequest = await req.json();
    console.log('Processing phone alert:', { submissionId, phone, name });

    if (!submissionId || !phone) {
      throw new Error('Missing submissionId or phone');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if SMS was already sent
    const { data: submission, error: fetchError } = await supabase
      .from('submissions')
      .select('phone_sms_sent, name')
      .eq('id', submissionId)
      .single();

    if (fetchError) {
      console.error('Failed to fetch submission:', fetchError);
      throw new Error('Submission not found');
    }

    if (submission.phone_sms_sent) {
      console.log('Phone SMS already sent for this submission');
      return new Response(
        JSON.stringify({ success: true, skipped: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Check if we have Twilio credentials
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFrom = Deno.env.get('TWILIO_PHONE_FROM');
    const twilioTo = Deno.env.get('TWILIO_PHONE_TO');

    if (!twilioSid || !twilioToken || !twilioFrom || !twilioTo) {
      console.log('Twilio credentials not configured, skipping SMS');
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: 'Twilio not configured' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Send SMS
    console.log('Sending phone alert SMS');
    const displayName = name || submission.name || 'Neznáme meno';
    const smsBody = `LEAD (tel): ${displayName}, ${phone}`;

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
      const errorText = await response.text();
      console.error('Twilio error:', errorText);
      throw new Error(`Twilio error: ${response.status}`);
    }

    // Mark phone SMS as sent
    await supabase
      .from('submissions')
      .update({ phone_sms_sent: true })
      .eq('id', submissionId);

    console.log('Phone alert SMS sent successfully');

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in send-phone-alert:', error);
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
