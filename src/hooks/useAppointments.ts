import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMyAppointments() {
  return useQuery({
    queryKey: ["my-appointments"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("appointments")
        .select("*, doctors(name, specialty, image_url)")
        .eq("patient_id", user.id)
        .order("slot_time", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useProviderAppointments() {
  return useQuery({
    queryKey: ["provider-appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select("*, doctors(name, specialty)")
        .order("slot_time", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointment: {
      doctor_id: string;
      patient_name: string;
      patient_phone: string;
      slot_time: string;
      consultation_type: string;
      symptoms: string[];
      notes: string;
      fee_paise: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("appointments")
        .insert({ ...appointment, patient_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["provider-appointments"] });
    },
  });
}
