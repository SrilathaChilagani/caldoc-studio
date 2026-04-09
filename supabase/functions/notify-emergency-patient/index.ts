import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const EXOTEL_SUBDOMAIN = "api.in.exotel.com"; // Mumbai cluster

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Verify the caller is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request
    const { bookingId, doctorName, doctorId } = await req.json();
    if (!bookingId || !doctorName) {
      return new Response(JSON.stringify({ error: "bookingId and doctorName are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update booking with assigned doctor
    const { data: booking, error: updateError } = await supabase
      .from("emergency_bookings")
      .update({
        assigned_doctor_name: doctorName,
        assigned_doctor_id: doctorId || null,
        status: "assigned",
      })
      .eq("booking_id", bookingId)
      .select()
      .single();

    if (updateError || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found or update failed" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: { sms?: string; email?: string } = {};

    // Send SMS via Exotel
    const apiKey = Deno.env.get("EXOTEL_API_KEY");
    const apiToken = Deno.env.get("EXOTEL_API_TOKEN");
    const accountSid = Deno.env.get("EXOTEL_ACCOUNT_SID");
    const senderId = Deno.env.get("EXOTEL_SENDER_ID");

    if (apiKey && apiToken && accountSid && senderId) {
      const smsBody = `Hi ${booking.patient_name}, your emergency appointment (${bookingId}) has been assigned to Dr. ${doctorName}. You will receive a ${booking.consultation_type === "VIDEO" ? "video" : "audio"} call shortly. Stay near your phone.`;

      const exotelUrl = `https://${apiKey}:${apiToken}@${EXOTEL_SUBDOMAIN}/v1/Accounts/${accountSid}/Sms/send`;

      const formData = new URLSearchParams();
      formData.append("From", senderId);
      formData.append("To", booking.patient_phone);
      formData.append("Body", smsBody);

      try {
        const smsRes = await fetch(exotelUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });

        if (smsRes.ok) {
          results.sms = "sent";
          console.log("SMS sent successfully to", booking.patient_phone);
        } else {
          const errText = await smsRes.text();
          results.sms = `failed: ${smsRes.status}`;
          console.error("Exotel SMS error:", errText);
        }
      } catch (smsErr) {
        results.sms = `error: ${smsErr instanceof Error ? smsErr.message : "unknown"}`;
        console.error("SMS send error:", smsErr);
      }
    } else {
      results.sms = "skipped: missing Exotel credentials";
    }

    // Email notification via transactional email (if configured)
    try {
      const { error: emailError } = await supabase.functions.invoke(
        "send-transactional-email",
        {
          body: {
            templateName: "emergency-doctor-assigned",
            recipientEmail: null, // Will be set when patient email is available
            idempotencyKey: `emergency-assigned-${bookingId}`,
            templateData: {
              patientName: booking.patient_name,
              doctorName,
              bookingId,
              consultationType: booking.consultation_type,
            },
          },
        }
      );
      results.email = emailError ? `failed: ${emailError.message}` : "sent";
    } catch {
      results.email = "skipped: email not configured";
    }

    return new Response(
      JSON.stringify({ success: true, booking, notifications: results }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("notify-emergency-patient error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
