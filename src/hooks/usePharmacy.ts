import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function usePharmacyOrders() {
  return useQuery({
    queryKey: ["pharmacy-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pharmacy_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function usePharmacyInventory() {
  return useQuery({
    queryKey: ["pharmacy-inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pharmacy_inventory")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}
