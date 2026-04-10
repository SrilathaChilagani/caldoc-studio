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
        .select("id,slug,name,specialty,fee_paise,experience_years,bio,image_url,location,video_consult,audio_consult,rating,review_count,tags,is_active,languages,qualification,is_24x7,visit_modes")
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
        .select("id,slug,name,specialty,fee_paise,experience_years,bio,image_url,location,video_consult,audio_consult,rating,review_count,tags,is_active,languages,qualification,is_24x7,visit_modes")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as Doctor;
    },
    enabled: !!slug,
  });
}
