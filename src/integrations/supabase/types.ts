export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      campaigns: {
        Row: {
          beneficiaries_served: number
          created_at: string
          districts: string[]
          end_date: string
          id: string
          name: string
          ngo_id: string
          start_date: string
          status: string
          target_beneficiaries: number
          updated_at: string
          volunteer_count: number
        }
        Insert: {
          beneficiaries_served?: number
          created_at?: string
          districts?: string[]
          end_date: string
          id?: string
          name: string
          ngo_id: string
          start_date: string
          status?: string
          target_beneficiaries?: number
          updated_at?: string
          volunteer_count?: number
        }
        Update: {
          beneficiaries_served?: number
          created_at?: string
          districts?: string[]
          end_date?: string
          id?: string
          name?: string
          ngo_id?: string
          start_date?: string
          status?: string
          target_beneficiaries?: number
          updated_at?: string
          volunteer_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      emergency_bookings: {
        Row: {
          assigned_doctor_id: string | null
          assigned_doctor_name: string | null
          booking_id: string
          consultation_type: string
          created_at: string
          id: string
          notes: string | null
          patient_name: string
          patient_phone: string
          status: string
          symptoms: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_doctor_id?: string | null
          assigned_doctor_name?: string | null
          booking_id: string
          consultation_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_name: string
          patient_phone: string
          status?: string
          symptoms?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_doctor_id?: string | null
          assigned_doctor_name?: string | null
          booking_id?: string
          consultation_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_name?: string
          patient_phone?: string
          status?: string
          symptoms?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ngo_members: {
        Row: {
          created_at: string
          id: string
          ngo_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ngo_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ngo_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ngo_members_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      ngo_reservations: {
        Row: {
          amount_paise: number
          created_at: string
          fee_paise: number | null
          friendly_id: string
          has_prescription: boolean
          has_receipt: boolean
          id: string
          ngo_id: string
          notes: string | null
          patient_email: string | null
          patient_name: string | null
          patient_phone: string | null
          provider_name: string
          slot_time: string | null
          speciality: string | null
          status: string
          updated_at: string
          visit_mode: string | null
        }
        Insert: {
          amount_paise?: number
          created_at?: string
          fee_paise?: number | null
          friendly_id: string
          has_prescription?: boolean
          has_receipt?: boolean
          id?: string
          ngo_id: string
          notes?: string | null
          patient_email?: string | null
          patient_name?: string | null
          patient_phone?: string | null
          provider_name: string
          slot_time?: string | null
          speciality?: string | null
          status?: string
          updated_at?: string
          visit_mode?: string | null
        }
        Update: {
          amount_paise?: number
          created_at?: string
          fee_paise?: number | null
          friendly_id?: string
          has_prescription?: boolean
          has_receipt?: boolean
          id?: string
          ngo_id?: string
          notes?: string | null
          patient_email?: string | null
          patient_name?: string | null
          patient_phone?: string | null
          provider_name?: string
          slot_time?: string | null
          speciality?: string | null
          status?: string
          updated_at?: string
          visit_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ngo_reservations_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
      ngos: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          campaign_count: number
          created_at: string
          district: string | null
          email: string | null
          id: string
          name: string
          ngo_id: string
          phone: string | null
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          campaign_count?: number
          created_at?: string
          district?: string | null
          email?: string | null
          id?: string
          name: string
          ngo_id: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          campaign_count?: number
          created_at?: string
          district?: string | null
          email?: string | null
          id?: string
          name?: string
          ngo_id?: string
          phone?: string | null
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      ngo_reservations_safe: {
        Row: {
          amount_paise: number | null
          created_at: string | null
          fee_paise: number | null
          friendly_id: string | null
          has_prescription: boolean | null
          has_receipt: boolean | null
          id: string | null
          ngo_id: string | null
          notes: string | null
          patient_email: string | null
          patient_name: string | null
          patient_phone: string | null
          provider_name: string | null
          slot_time: string | null
          speciality: string | null
          status: string | null
          updated_at: string | null
          visit_mode: string | null
        }
        Insert: {
          amount_paise?: number | null
          created_at?: string | null
          fee_paise?: number | null
          friendly_id?: string | null
          has_prescription?: boolean | null
          has_receipt?: boolean | null
          id?: string | null
          ngo_id?: string | null
          notes?: string | null
          patient_email?: never
          patient_name?: never
          patient_phone?: never
          provider_name?: string | null
          slot_time?: string | null
          speciality?: string | null
          status?: string | null
          updated_at?: string | null
          visit_mode?: string | null
        }
        Update: {
          amount_paise?: number | null
          created_at?: string | null
          fee_paise?: number | null
          friendly_id?: string | null
          has_prescription?: boolean | null
          has_receipt?: boolean | null
          id?: string | null
          ngo_id?: string | null
          notes?: string | null
          patient_email?: never
          patient_name?: never
          patient_phone?: never
          provider_name?: string | null
          slot_time?: string | null
          speciality?: string | null
          status?: string | null
          updated_at?: string | null
          visit_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ngo_reservations_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_user_ngo_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_ngo_admin: { Args: never; Returns: boolean }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "provider" | "pharmacy" | "labs" | "patient"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "provider", "pharmacy", "labs", "patient"],
    },
  },
} as const
