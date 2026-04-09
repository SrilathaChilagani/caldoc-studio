import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Doctor {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  fee_paise: number;
  experience_years: number;
  bio: string | null;
  image_url: string | null;
  location: string | null;
  video_consult: boolean;
  audio_consult: boolean;
  rating: number;
  review_count: number;
  tags: string[];
  is_active: boolean;
}

export function useDoctors() {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });
      if (error) throw error;
      return data as Doctor[];
    },
  });
}

export function useDoctorBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["doctor", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as Doctor;
    },
    enabled: !!slug,
  });
}
