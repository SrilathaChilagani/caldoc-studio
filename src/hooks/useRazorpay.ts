import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOrderParams {
  amount_paise: number;
  appointment_id?: string;
  rx_order_id?: string;
  lab_order_id?: string;
}

interface UseRazorpayOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  description?: string;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
    document.body.appendChild(script);
  });
}

export function useRazorpay(options: UseRazorpayOptions = {}) {
  const [loading, setLoading] = useState(false);

  const initiatePayment = useCallback(async (params: RazorpayOrderParams) => {
    setLoading(true);
    try {
      await loadRazorpayScript();

      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: params,
      });

      if (error || !data?.order_id) {
        throw new Error(error?.message || data?.error || "Failed to create order");
      }

      const { order_id, amount, currency, key_id } = data;

      return new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: key_id,
          amount,
          currency,
          order_id,
          name: "CalDoc",
          description: options.description || "Payment",
          prefill: options.prefill || {},
          theme: { color: "#16a34a" },
          handler: async (response: any) => {
            try {
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke(
                "verify-razorpay-payment",
                {
                  body: {
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    appointment_id: params.appointment_id,
                    rx_order_id: params.rx_order_id,
                    lab_order_id: params.lab_order_id,
                  },
                }
              );

              if (verifyError || !verifyData?.success) {
                throw new Error(verifyError?.message || "Verification failed");
              }

              toast.success("Payment successful!");
              options.onSuccess?.();
              resolve();
            } catch (err: any) {
              toast.error("Payment verification failed");
              options.onError?.(err.message);
              reject(err);
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast.info("Payment cancelled");
            },
          },
        });

        rzp.on("payment.failed", (response: any) => {
          setLoading(false);
          toast.error(response.error?.description || "Payment failed");
          options.onError?.(response.error?.description);
          reject(new Error(response.error?.description));
        });

        rzp.open();
      });
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "Payment initiation failed");
      options.onError?.(err.message);
      throw err;
    }
  }, [options]);

  return { initiatePayment, loading };
}
