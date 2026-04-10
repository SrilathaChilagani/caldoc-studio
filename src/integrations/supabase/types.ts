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
      appointment_status_history: {
        Row: {
          actor_id: string | null
          actor_type: string
          appointment_id: string
          created_at: string
          from_status: string
          id: string
          reason: string | null
          to_status: string
        }
        Insert: {
          actor_id?: string | null
          actor_type: string
          appointment_id: string
          created_at?: string
          from_status: string
          id?: string
          reason?: string | null
          to_status: string
        }
        Update: {
          actor_id?: string | null
          actor_type?: string
          appointment_id?: string
          created_at?: string
          from_status?: string
          id?: string
          reason?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointment_status_history_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          booker_phone: string | null
          consent_at: string | null
          consent_mode: string | null
          consent_text: string | null
          consent_type: string | null
          consultation_type: string
          created_at: string
          delivery_address_id: string | null
          delivery_opt: string | null
          doctor_id: string
          fee_currency: string | null
          fee_paise: number
          id: string
          notes: string | null
          patient_id: string
          patient_name: string
          patient_phone: string | null
          recording_key: string | null
          slot_id: string | null
          slot_time: string
          status: string
          symptoms: string[]
          updated_at: string
          upload_link_sent_at: string | null
          video_room_url: string | null
          visit_mode: string | null
          wa_error: string | null
          wa_status: string | null
        }
        Insert: {
          booker_phone?: string | null
          consent_at?: string | null
          consent_mode?: string | null
          consent_text?: string | null
          consent_type?: string | null
          consultation_type?: string
          created_at?: string
          delivery_address_id?: string | null
          delivery_opt?: string | null
          doctor_id: string
          fee_currency?: string | null
          fee_paise?: number
          id?: string
          notes?: string | null
          patient_id: string
          patient_name: string
          patient_phone?: string | null
          recording_key?: string | null
          slot_id?: string | null
          slot_time: string
          status?: string
          symptoms?: string[]
          updated_at?: string
          upload_link_sent_at?: string | null
          video_room_url?: string | null
          visit_mode?: string | null
          wa_error?: string | null
          wa_status?: string | null
        }
        Update: {
          booker_phone?: string | null
          consent_at?: string | null
          consent_mode?: string | null
          consent_text?: string | null
          consent_type?: string | null
          consultation_type?: string
          created_at?: string
          delivery_address_id?: string | null
          delivery_opt?: string | null
          doctor_id?: string
          fee_currency?: string | null
          fee_paise?: number
          id?: string
          notes?: string | null
          patient_id?: string
          patient_name?: string
          patient_phone?: string | null
          recording_key?: string | null
          slot_id?: string | null
          slot_time?: string
          status?: string
          symptoms?: string[]
          updated_at?: string
          upload_link_sent_at?: string | null
          video_room_url?: string | null
          visit_mode?: string | null
          wa_error?: string | null
          wa_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "patient_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "slots"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          actor_type: string
          at: string
          id: string
          meta: Json
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_type: string
          at?: string
          id?: string
          meta?: Json
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_type?: string
          at?: string
          id?: string
          meta?: Json
        }
        Relationships: []
      }
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
      check_in_forms: {
        Row: {
          appointment_id: string
          chief_complaint: string | null
          completed_at: string | null
          created_at: string
          id: string
          s3_key: string | null
          updated_at: string
        }
        Insert: {
          appointment_id: string
          chief_complaint?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          s3_key?: string | null
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          chief_complaint?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          s3_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_in_forms_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          audio_consult: boolean
          bio: string | null
          council_name: string | null
          created_at: string
          experience_years: number
          fee_paise: number
          id: string
          image_url: string | null
          is_24x7: boolean
          is_active: boolean
          languages: string[]
          license_doc_key: string | null
          license_no: string | null
          location: string | null
          name: string
          phone: string | null
          profile_photo_key: string | null
          qualification: string | null
          rating: number
          registration_doc_key: string | null
          registration_number: string | null
          review_count: number
          slug: string
          specialty: string
          tags: string[]
          updated_at: string
          user_id: string | null
          video_consult: boolean
          visit_modes: string[]
        }
        Insert: {
          audio_consult?: boolean
          bio?: string | null
          council_name?: string | null
          created_at?: string
          experience_years?: number
          fee_paise?: number
          id?: string
          image_url?: string | null
          is_24x7?: boolean
          is_active?: boolean
          languages?: string[]
          license_doc_key?: string | null
          license_no?: string | null
          location?: string | null
          name: string
          phone?: string | null
          profile_photo_key?: string | null
          qualification?: string | null
          rating?: number
          registration_doc_key?: string | null
          registration_number?: string | null
          review_count?: number
          slug: string
          specialty: string
          tags?: string[]
          updated_at?: string
          user_id?: string | null
          video_consult?: boolean
          visit_modes?: string[]
        }
        Update: {
          audio_consult?: boolean
          bio?: string | null
          council_name?: string | null
          created_at?: string
          experience_years?: number
          fee_paise?: number
          id?: string
          image_url?: string | null
          is_24x7?: boolean
          is_active?: boolean
          languages?: string[]
          license_doc_key?: string | null
          license_no?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          profile_photo_key?: string | null
          qualification?: string | null
          rating?: number
          registration_doc_key?: string | null
          registration_number?: string | null
          review_count?: number
          slug?: string
          specialty?: string
          tags?: string[]
          updated_at?: string
          user_id?: string | null
          video_consult?: boolean
          visit_modes?: string[]
        }
        Relationships: []
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
      lab_agents: {
        Row: {
          active_orders: number
          coverage_area: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          active_orders?: number
          coverage_area?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          active_orders?: number
          coverage_area?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      lab_enrollments: {
        Row: {
          address_line1: string
          address_line2: string | null
          admin_notified_at: string | null
          city: string
          contact_name: string
          created_at: string
          email: string
          home_collection: boolean
          id: string
          lab_name: string
          lab_partner_id: string | null
          nabl_cert_number: string | null
          nabl_certified: boolean
          notes: string | null
          phone: string
          pincode: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by_email: string | null
          state: string
          status: string
          test_categories: string[]
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          admin_notified_at?: string | null
          city: string
          contact_name: string
          created_at?: string
          email: string
          home_collection?: boolean
          id?: string
          lab_name: string
          lab_partner_id?: string | null
          nabl_cert_number?: string | null
          nabl_certified?: boolean
          notes?: string | null
          phone: string
          pincode: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by_email?: string | null
          state: string
          status?: string
          test_categories?: string[]
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          admin_notified_at?: string | null
          city?: string
          contact_name?: string
          created_at?: string
          email?: string
          home_collection?: boolean
          id?: string
          lab_name?: string
          lab_partner_id?: string | null
          nabl_cert_number?: string | null
          nabl_certified?: boolean
          notes?: string | null
          phone?: string
          pincode?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by_email?: string | null
          state?: string
          status?: string
          test_categories?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      lab_order_events: {
        Row: {
          actor_email: string | null
          collection_agent_name: string | null
          collection_agent_phone: string | null
          created_at: string
          from_status: string | null
          id: string
          lab_order_id: string
          note: string | null
          to_status: string
        }
        Insert: {
          actor_email?: string | null
          collection_agent_name?: string | null
          collection_agent_phone?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          lab_order_id: string
          note?: string | null
          to_status: string
        }
        Update: {
          actor_email?: string | null
          collection_agent_name?: string | null
          collection_agent_phone?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          lab_order_id?: string
          note?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_order_events_lab_order_id_fkey"
            columns: ["lab_order_id"]
            isOneToOne: false
            referencedRelation: "lab_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_orders: {
        Row: {
          address: Json | null
          amount_paise: number
          collection_agent_name: string | null
          collection_agent_phone: string | null
          created_at: string
          delivery_address: string | null
          delivery_mode: string
          id: string
          lab_partner_id: string | null
          notes: string | null
          patient_email: string | null
          patient_id: string
          patient_name: string
          patient_phone: string | null
          provider_name: string | null
          provider_speciality: string | null
          source: string
          status: string
          tests: Json
          updated_at: string
        }
        Insert: {
          address?: Json | null
          amount_paise?: number
          collection_agent_name?: string | null
          collection_agent_phone?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_mode?: string
          id?: string
          lab_partner_id?: string | null
          notes?: string | null
          patient_email?: string | null
          patient_id: string
          patient_name: string
          patient_phone?: string | null
          provider_name?: string | null
          provider_speciality?: string | null
          source?: string
          status?: string
          tests?: Json
          updated_at?: string
        }
        Update: {
          address?: Json | null
          amount_paise?: number
          collection_agent_name?: string | null
          collection_agent_phone?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_mode?: string
          id?: string
          lab_partner_id?: string | null
          notes?: string | null
          patient_email?: string | null
          patient_id?: string
          patient_name?: string
          patient_phone?: string | null
          provider_name?: string | null
          provider_speciality?: string | null
          source?: string
          status?: string
          tests?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_orders_lab_partner_id_fkey"
            columns: ["lab_partner_id"]
            isOneToOne: false
            referencedRelation: "lab_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_partners: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          contact_name: string
          created_at: string
          email: string
          home_collection: boolean
          id: string
          is_active: boolean
          nabl_cert_number: string | null
          nabl_certified: boolean
          name: string
          notes: string | null
          phone: string
          pincode: string
          state: string
          test_categories: string[]
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          contact_name: string
          created_at?: string
          email: string
          home_collection?: boolean
          id?: string
          is_active?: boolean
          nabl_cert_number?: string | null
          nabl_certified?: boolean
          name: string
          notes?: string | null
          phone: string
          pincode: string
          state: string
          test_categories?: string[]
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          contact_name?: string
          created_at?: string
          email?: string
          home_collection?: boolean
          id?: string
          is_active?: boolean
          nabl_cert_number?: string | null
          nabl_certified?: boolean
          name?: string
          notes?: string | null
          phone?: string
          pincode?: string
          state?: string
          test_categories?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      medications: {
        Row: {
          category: string | null
          created_at: string | null
          form: string | null
          generic: string | null
          id: string
          name: string
          strength: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          form?: string | null
          generic?: string | null
          id?: string
          name: string
          strength?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          form?: string | null
          generic?: string | null
          id?: string
          name?: string
          strength?: string | null
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
          appointment_id: string | null
          confirmed_at: string | null
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
          provider_id: string | null
          provider_name: string
          slot_id: string | null
          slot_time: string | null
          speciality: string | null
          status: string
          updated_at: string
          visit_mode: string | null
        }
        Insert: {
          amount_paise?: number
          appointment_id?: string | null
          confirmed_at?: string | null
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
          provider_id?: string | null
          provider_name: string
          slot_id?: string | null
          slot_time?: string | null
          speciality?: string | null
          status?: string
          updated_at?: string
          visit_mode?: string | null
        }
        Update: {
          amount_paise?: number
          appointment_id?: string | null
          confirmed_at?: string | null
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
          provider_id?: string | null
          provider_name?: string
          slot_id?: string | null
          slot_time?: string | null
          speciality?: string | null
          status?: string
          updated_at?: string
          visit_mode?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ngo_reservations_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ngo_reservations_ngo_id_fkey"
            columns: ["ngo_id"]
            isOneToOne: false
            referencedRelation: "ngos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ngo_reservations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ngo_reservations_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "slots"
            referencedColumns: ["id"]
          },
        ]
      }
      ngos: {
        Row: {
          billing_notes: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          billing_notes?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          billing_notes?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      offline_requests: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          phone: string
          resolved_at: string | null
          speciality: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          resolved_at?: string | null
          speciality?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          resolved_at?: string | null
          speciality?: string | null
          status?: string
        }
        Relationships: []
      }
      outbound_messages: {
        Row: {
          appointment_id: string | null
          body: string | null
          channel: string
          created_at: string
          error: string | null
          id: string
          kind: string | null
          message_id: string | null
          status: string
          template: string | null
          to_email: string | null
          to_phone: string | null
        }
        Insert: {
          appointment_id?: string | null
          body?: string | null
          channel: string
          created_at?: string
          error?: string | null
          id?: string
          kind?: string | null
          message_id?: string | null
          status: string
          template?: string | null
          to_email?: string | null
          to_phone?: string | null
        }
        Update: {
          appointment_id?: string | null
          body?: string | null
          channel?: string
          created_at?: string
          error?: string | null
          id?: string
          kind?: string | null
          message_id?: string | null
          status?: string
          template?: string | null
          to_email?: string | null
          to_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outbound_messages_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_addresses: {
        Row: {
          city: string
          contact_name: string | null
          contact_phone: string | null
          id: string
          instructions: string | null
          label: string | null
          last_used_at: string | null
          line1: string
          line2: string | null
          patient_id: string
          postal_code: string
          saved_at: string
          state: string
          updated_at: string
        }
        Insert: {
          city: string
          contact_name?: string | null
          contact_phone?: string | null
          id?: string
          instructions?: string | null
          label?: string | null
          last_used_at?: string | null
          line1: string
          line2?: string | null
          patient_id: string
          postal_code: string
          saved_at?: string
          state: string
          updated_at?: string
        }
        Update: {
          city?: string
          contact_name?: string | null
          contact_phone?: string | null
          id?: string
          instructions?: string | null
          label?: string | null
          last_used_at?: string | null
          line1?: string
          line2?: string | null
          patient_id?: string
          postal_code?: string
          saved_at?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      patient_documents: {
        Row: {
          appointment_id: string | null
          content_type: string | null
          created_at: string
          document_type: string
          file_name: string | null
          file_url: string | null
          id: string
          key: string | null
          name: string
          patient_id: string
          provider_name: string | null
        }
        Insert: {
          appointment_id?: string | null
          content_type?: string | null
          created_at?: string
          document_type?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          key?: string | null
          name: string
          patient_id: string
          provider_name?: string | null
        }
        Update: {
          appointment_id?: string | null
          content_type?: string | null
          created_at?: string
          document_type?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          key?: string | null
          name?: string
          patient_id?: string
          provider_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_documents_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_receipts: {
        Row: {
          appointment_id: string
          created_at: string
          key: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          key: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          key?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_receipts_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          appointment_id: string | null
          created_at: string
          currency: string
          gateway: string
          id: string
          lab_order_id: string | null
          order_id: string
          payment_ref: string | null
          receipt_url: string | null
          rx_order_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          appointment_id?: string | null
          created_at?: string
          currency?: string
          gateway: string
          id?: string
          lab_order_id?: string | null
          order_id: string
          payment_ref?: string | null
          receipt_url?: string | null
          rx_order_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          appointment_id?: string | null
          created_at?: string
          currency?: string
          gateway?: string
          id?: string
          lab_order_id?: string | null
          order_id?: string
          payment_ref?: string | null
          receipt_url?: string | null
          rx_order_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_lab_order_id_fkey"
            columns: ["lab_order_id"]
            isOneToOne: true
            referencedRelation: "lab_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_rx_order_id_fkey"
            columns: ["rx_order_id"]
            isOneToOne: true
            referencedRelation: "pharmacy_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacy_enrollments: {
        Row: {
          address_line1: string
          address_line2: string | null
          admin_notified_at: string | null
          city: string
          contact_name: string
          created_at: string
          drug_license_number: string
          email: string
          gst_number: string | null
          id: string
          notes: string | null
          pharmacy_name: string
          pharmacy_partner_id: string | null
          phone: string
          pincode: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by_email: string | null
          service_areas: string[]
          state: string
          status: string
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          admin_notified_at?: string | null
          city: string
          contact_name: string
          created_at?: string
          drug_license_number: string
          email: string
          gst_number?: string | null
          id?: string
          notes?: string | null
          pharmacy_name: string
          pharmacy_partner_id?: string | null
          phone: string
          pincode: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by_email?: string | null
          service_areas?: string[]
          state: string
          status?: string
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          admin_notified_at?: string | null
          city?: string
          contact_name?: string
          created_at?: string
          drug_license_number?: string
          email?: string
          gst_number?: string | null
          id?: string
          notes?: string | null
          pharmacy_name?: string
          pharmacy_partner_id?: string | null
          phone?: string
          pincode?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by_email?: string | null
          service_areas?: string[]
          state?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      pharmacy_fulfillments: {
        Row: {
          appointment_id: string | null
          created_at: string
          id: string
          notes: string | null
          status: string
          updated_at: string
        }
        Insert: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_fulfillments_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacy_inventory: {
        Row: {
          created_at: string
          id: string
          name: string
          reorder_level: number
          status: string
          stock: number
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          reorder_level?: number
          status?: string
          stock?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          reorder_level?: number
          status?: string
          stock?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      pharmacy_orders: {
        Row: {
          amount_paise: number
          appointment_id: string | null
          courier_name: string | null
          created_at: string
          delivery_address: string | null
          delivery_mode: string
          fulfillment_label: string | null
          has_prescription: boolean
          id: string
          items: Json
          patient_id: string
          patient_name: string
          patient_phone: string | null
          provider_name: string | null
          provider_speciality: string | null
          status: string
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          amount_paise?: number
          appointment_id?: string | null
          courier_name?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_mode?: string
          fulfillment_label?: string | null
          has_prescription?: boolean
          id?: string
          items?: Json
          patient_id: string
          patient_name: string
          patient_phone?: string | null
          provider_name?: string | null
          provider_speciality?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          amount_paise?: number
          appointment_id?: string | null
          courier_name?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_mode?: string
          fulfillment_label?: string | null
          has_prescription?: boolean
          id?: string
          items?: Json
          patient_id?: string
          patient_name?: string
          patient_phone?: string | null
          provider_name?: string | null
          provider_speciality?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_orders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacy_partners: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          contact_name: string
          created_at: string
          drug_license_number: string
          email: string
          gst_number: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          phone: string
          pincode: string
          service_areas: string[]
          state: string
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          contact_name: string
          created_at?: string
          drug_license_number: string
          email: string
          gst_number?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          phone: string
          pincode: string
          service_areas?: string[]
          state: string
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          contact_name?: string
          created_at?: string
          drug_license_number?: string
          email?: string
          gst_number?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          phone?: string
          pincode?: string
          service_areas?: string[]
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          meds: Json
          pdf_key: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          meds?: Json
          pdf_key: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          meds?: Json
          pdf_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          consent_at: string | null
          created_at: string
          display_name: string | null
          dob: string | null
          id: string
          phone: string | null
          profile_photo_key: string | null
          sex: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          consent_at?: string | null
          created_at?: string
          display_name?: string | null
          dob?: string | null
          id?: string
          phone?: string | null
          profile_photo_key?: string | null
          sex?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          consent_at?: string | null
          created_at?: string
          display_name?: string | null
          dob?: string | null
          id?: string
          phone?: string | null
          profile_photo_key?: string | null
          sex?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      provider_clinics: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          clinic_name: string
          created_at: string
          id: string
          is_active: boolean
          lat: number | null
          lng: number | null
          phone: string | null
          pincode: string
          provider_id: string
          state: string
          updated_at: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          clinic_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          lat?: number | null
          lng?: number | null
          phone?: string | null
          pincode: string
          provider_id: string
          state: string
          updated_at?: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          clinic_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          lat?: number | null
          lng?: number | null
          phone?: string | null
          pincode?: string
          provider_id?: string
          state?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_clinics_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_enrollments: {
        Row: {
          admin_notified_at: string | null
          bio: string | null
          city: string
          consent_telemedicine: boolean
          created_at: string
          current_hospital: string | null
          dob: string | null
          email: string
          experience_years: number | null
          fee_paise: number | null
          full_name: string
          gender: string | null
          id: string
          languages: string[]
          phone: string
          profile_photo_key: string | null
          provider_id: string | null
          qualification: string
          qualification_doc_key: string | null
          qualification_year: number | null
          registration_council: string
          registration_doc_key: string | null
          registration_number: string
          registration_year: number | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by_email: string | null
          speciality: string
          state: string
          status: string
          sub_speciality: string | null
          university: string | null
          visit_modes: string[]
        }
        Insert: {
          admin_notified_at?: string | null
          bio?: string | null
          city: string
          consent_telemedicine?: boolean
          created_at?: string
          current_hospital?: string | null
          dob?: string | null
          email: string
          experience_years?: number | null
          fee_paise?: number | null
          full_name: string
          gender?: string | null
          id?: string
          languages?: string[]
          phone: string
          profile_photo_key?: string | null
          provider_id?: string | null
          qualification: string
          qualification_doc_key?: string | null
          qualification_year?: number | null
          registration_council: string
          registration_doc_key?: string | null
          registration_number: string
          registration_year?: number | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by_email?: string | null
          speciality: string
          state: string
          status?: string
          sub_speciality?: string | null
          university?: string | null
          visit_modes?: string[]
        }
        Update: {
          admin_notified_at?: string | null
          bio?: string | null
          city?: string
          consent_telemedicine?: boolean
          created_at?: string
          current_hospital?: string | null
          dob?: string | null
          email?: string
          experience_years?: number | null
          fee_paise?: number | null
          full_name?: string
          gender?: string | null
          id?: string
          languages?: string[]
          phone?: string
          profile_photo_key?: string | null
          provider_id?: string | null
          qualification?: string
          qualification_doc_key?: string | null
          qualification_year?: number | null
          registration_council?: string
          registration_doc_key?: string | null
          registration_number?: string
          registration_year?: number | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by_email?: string | null
          speciality?: string
          state?: string
          status?: string
          sub_speciality?: string | null
          university?: string | null
          visit_modes?: string[]
        }
        Relationships: []
      }
      rx_order_events: {
        Row: {
          actor_email: string | null
          courier_name: string | null
          created_at: string
          from_status: string | null
          id: string
          note: string | null
          rx_order_id: string
          to_status: string
          tracking_number: string | null
        }
        Insert: {
          actor_email?: string | null
          courier_name?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          note?: string | null
          rx_order_id: string
          to_status: string
          tracking_number?: string | null
        }
        Update: {
          actor_email?: string | null
          courier_name?: string | null
          created_at?: string
          from_status?: string | null
          id?: string
          note?: string | null
          rx_order_id?: string
          to_status?: string
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rx_order_events_rx_order_id_fkey"
            columns: ["rx_order_id"]
            isOneToOne: false
            referencedRelation: "pharmacy_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      slots: {
        Row: {
          created_at: string
          ends_at: string
          fee_paise: number | null
          id: string
          is_booked: boolean
          provider_id: string
          starts_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          fee_paise?: number | null
          id?: string
          is_booked?: boolean
          provider_id: string
          starts_at: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          fee_paise?: number | null
          id?: string
          is_booked?: boolean
          provider_id?: string
          starts_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "slots_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
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
      visit_notes: {
        Row: {
          appointment_id: string
          created_at: string
          id: string
          text: string
          updated_at: string
        }
        Insert: {
          appointment_id: string
          created_at?: string
          id?: string
          text: string
          updated_at?: string
        }
        Update: {
          appointment_id?: string
          created_at?: string
          id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_notes_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
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
