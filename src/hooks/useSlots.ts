import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, addDays, format } from "date-fns";

export interface Slot {
  id: string;
  provider_id: string;
  starts_at: string;
  ends_at: string;
  is_booked: boolean;
  fee_paise: number | null;
}

/**
 * Fetch available (unbooked) slots for a specific doctor over the next N days.
 */
export function useDoctorSlots(doctorId: string | undefined, days = 7) {
  return useQuery({
    queryKey: ["doctor-slots", doctorId, days],
    queryFn: async () => {
      if (!doctorId) return [];
      const from = startOfDay(new Date()).toISOString();
      const to = endOfDay(addDays(new Date(), days - 1)).toISOString();

      const { data, error } = await supabase
        .from("slots")
        .select("*")
        .eq("provider_id", doctorId)
        .eq("is_booked", false)
        .gte("starts_at", from)
        .lte("starts_at", to)
        .order("starts_at", { ascending: true });

      if (error) throw error;
      return data as Slot[];
    },
    enabled: !!doctorId,
  });
}

/**
 * Group slots by date string (e.g. "2026-04-09") for display in date tabs.
 */
export function groupSlotsByDate(slots: Slot[]) {
  const grouped: Record<string, Slot[]> = {};
  for (const slot of slots) {
    const dateKey = format(new Date(slot.starts_at), "yyyy-MM-dd");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(slot);
  }
  return grouped;
}

/**
 * Fetch all slots for a provider (for provider portal / management).
 */
export function useProviderSlots(providerId: string | undefined) {
  return useQuery({
    queryKey: ["provider-slots", providerId],
    queryFn: async () => {
      if (!providerId) return [];
      const { data, error } = await supabase
        .from("slots")
        .select("*")
        .eq("provider_id", providerId)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true });
      if (error) throw error;
      return data as Slot[];
    },
    enabled: !!providerId,
  });
}
