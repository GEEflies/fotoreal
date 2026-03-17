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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          address: string | null
          company_name: string | null
          created_at: string | null
          dic: string | null
          ic_dph: string | null
          ico: string | null
          id: string
          logo_url: string | null
          updated_at: string | null
          user_id: string
          watermark_position: string | null
        }
        Insert: {
          address?: string | null
          company_name?: string | null
          created_at?: string | null
          dic?: string | null
          ic_dph?: string | null
          ico?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string | null
          user_id: string
          watermark_position?: string | null
        }
        Update: {
          address?: string | null
          company_name?: string | null
          created_at?: string | null
          dic?: string | null
          ic_dph?: string | null
          ico?: string | null
          id?: string
          logo_url?: string | null
          updated_at?: string | null
          user_id?: string
          watermark_position?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          created_at: string
          id: string
          name: string
          status: Database["public"]["Enums"]["property_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: Database["public"]["Enums"]["property_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["property_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      property_photos: {
        Row: {
          ai_status: Database["public"]["Enums"]["photo_ai_status"]
          ai_step_label: string | null
          created_at: string
          id: string
          original_url: string
          processed_url: string | null
          property_id: string
        }
        Insert: {
          ai_status?: Database["public"]["Enums"]["photo_ai_status"]
          ai_step_label?: string | null
          created_at?: string
          id?: string
          original_url: string
          processed_url?: string | null
          property_id: string
        }
        Update: {
          ai_status?: Database["public"]["Enums"]["photo_ai_status"]
          ai_step_label?: string | null
          created_at?: string
          id?: string
          original_url?: string
          processed_url?: string | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_photos_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      step_analytics: {
        Row: {
          id: string
          session_id: string
          step_name: string
          step_number: number
          viewed_at: string
        }
        Insert: {
          id?: string
          session_id: string
          step_name: string
          step_number: number
          viewed_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          step_name?: string
          step_number?: number
          viewed_at?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          complete_sms_sent: boolean | null
          created_at: string
          current_step: number
          email_sent: boolean | null
          form_data: Json | null
          gdpr_consent: boolean | null
          id: string
          name: string | null
          phone: string | null
          phone_normalized: string | null
          phone_sms_sent: boolean | null
          photos: string[] | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          session_id: string
          status: Database["public"]["Enums"]["submission_status"]
          updated_at: string
          webhook_sent: boolean | null
        }
        Insert: {
          complete_sms_sent?: boolean | null
          created_at?: string
          current_step?: number
          email_sent?: boolean | null
          form_data?: Json | null
          gdpr_consent?: boolean | null
          id?: string
          name?: string | null
          phone?: string | null
          phone_normalized?: string | null
          phone_sms_sent?: boolean | null
          photos?: string[] | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          session_id: string
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
          webhook_sent?: boolean | null
        }
        Update: {
          complete_sms_sent?: boolean | null
          created_at?: string
          current_step?: number
          email_sent?: boolean | null
          form_data?: Json | null
          gdpr_consent?: boolean | null
          id?: string
          name?: string | null
          phone?: string | null
          phone_normalized?: string | null
          phone_sms_sent?: boolean | null
          photos?: string[] | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          session_id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          updated_at?: string
          webhook_sent?: boolean | null
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string
          free_credits: number
          id: string
          purchased_credits: number
          total_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          free_credits?: number
          id?: string
          purchased_credits?: number
          total_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          free_credits?: number
          id?: string
          purchased_credits?: number
          total_used?: number
          updated_at?: string
          user_id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_user_list: {
        Args: never
        Returns: {
          address: string
          company_name: string
          email: string
          free_credits: number
          ico: string
          logo_url: string
          properties_count: number
          purchased_credits: number
          total_used: number
          user_created_at: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_total_used: { Args: { _user_id: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "user"
      photo_ai_status:
        | "pending"
        | "analyzing"
        | "enhancing"
        | "sky_replace"
        | "hdr"
        | "privacy_blur"
        | "done"
        | "error"
      property_status: "uploading" | "processing" | "done" | "error"
      property_type: "byt" | "dom" | "pozemok"
      submission_status:
        | "nove"
        | "kontaktovane"
        | "ma_zaujem"
        | "nema_zaujem"
        | "zavolat_neskor"
        | "uzavrete"
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
      app_role: ["admin", "user"],
      photo_ai_status: [
        "pending",
        "analyzing",
        "enhancing",
        "sky_replace",
        "hdr",
        "privacy_blur",
        "done",
        "error",
      ],
      property_status: ["uploading", "processing", "done", "error"],
      property_type: ["byt", "dom", "pozemok"],
      submission_status: [
        "nove",
        "kontaktovane",
        "ma_zaujem",
        "nema_zaujem",
        "zavolat_neskor",
        "uzavrete",
      ],
    },
  },
} as const
