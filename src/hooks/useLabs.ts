import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLabOrders() {
  return useQuery({
    queryKey: ["lab-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useLabAgents() {
  return useQuery({
    queryKey: ["lab-agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lab_agents")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
}
