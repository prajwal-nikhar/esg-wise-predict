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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          company_size: Database["public"]["Enums"]["company_size"]
          created_at: string
          description: string | null
          employee_count: number | null
          founded_year: number | null
          id: string
          industry: Database["public"]["Enums"]["industry_type"]
          location: string | null
          name: string
          revenue_range: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          company_size?: Database["public"]["Enums"]["company_size"]
          created_at?: string
          description?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          industry: Database["public"]["Enums"]["industry_type"]
          location?: string | null
          name: string
          revenue_range?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          company_size?: Database["public"]["Enums"]["company_size"]
          created_at?: string
          description?: string | null
          employee_count?: number | null
          founded_year?: number | null
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"]
          location?: string | null
          name?: string
          revenue_range?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      company_scores: {
        Row: {
          calculated_at: string
          company_id: string
          environmental_score: number | null
          governance_score: number | null
          id: string
          industry_percentile: number | null
          overall_score: number | null
          social_score: number | null
        }
        Insert: {
          calculated_at?: string
          company_id: string
          environmental_score?: number | null
          governance_score?: number | null
          id?: string
          industry_percentile?: number | null
          overall_score?: number | null
          social_score?: number | null
        }
        Update: {
          calculated_at?: string
          company_id?: string
          environmental_score?: number | null
          governance_score?: number | null
          id?: string
          industry_percentile?: number | null
          overall_score?: number | null
          social_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "company_scores_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      esg_questions: {
        Row: {
          category: string
          created_at: string
          id: string
          industry: Database["public"]["Enums"]["industry_type"]
          order_index: number
          pillar: Database["public"]["Enums"]["esg_pillar"]
          question_text: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          industry: Database["public"]["Enums"]["industry_type"]
          order_index?: number
          pillar: Database["public"]["Enums"]["esg_pillar"]
          question_text: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"]
          order_index?: number
          pillar?: Database["public"]["Enums"]["esg_pillar"]
          question_text?: string
        }
        Relationships: []
      }
      investor_watchlist: {
        Row: {
          company_id: string
          created_at: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_watchlist_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      pillar_weights: {
        Row: {
          environmental_weight: number
          governance_weight: number
          id: string
          industry: Database["public"]["Enums"]["industry_type"]
          social_weight: number
        }
        Insert: {
          environmental_weight: number
          governance_weight: number
          id?: string
          industry: Database["public"]["Enums"]["industry_type"]
          social_weight: number
        }
        Update: {
          environmental_weight?: number
          governance_weight?: number
          id?: string
          industry?: Database["public"]["Enums"]["industry_type"]
          social_weight?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      question_options: {
        Row: {
          id: string
          option_text: string
          order_index: number
          question_id: string
          score: number
        }
        Insert: {
          id?: string
          option_text: string
          order_index?: number
          question_id: string
          score: number
        }
        Update: {
          id?: string
          option_text?: string
          order_index?: number
          question_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "esg_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_responses: {
        Row: {
          answered_at: string
          company_id: string
          id: string
          is_predicted: boolean
          prediction_confidence: number | null
          question_id: string
          selected_option_id: string | null
        }
        Insert: {
          answered_at?: string
          company_id: string
          id?: string
          is_predicted?: boolean
          prediction_confidence?: number | null
          question_id: string
          selected_option_id?: string | null
        }
        Update: {
          answered_at?: string
          company_id?: string
          id?: string
          is_predicted?: boolean
          prediction_confidence?: number | null
          question_id?: string
          selected_option_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaire_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "esg_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaire_responses_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "question_options"
            referencedColumns: ["id"]
          },
        ]
      }
      score_predictions: {
        Row: {
          company_id: string
          confidence_level: number | null
          created_at: string
          details: Json | null
          id: string
          predicted_score: number | null
          prediction_date: string
          prediction_type: string
        }
        Insert: {
          company_id: string
          confidence_level?: number | null
          created_at?: string
          details?: Json | null
          id?: string
          predicted_score?: number | null
          prediction_date: string
          prediction_type: string
        }
        Update: {
          company_id?: string
          confidence_level?: number | null
          created_at?: string
          details?: Json | null
          id?: string
          predicted_score?: number | null
          prediction_date?: string
          prediction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "score_predictions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
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
      get_questions_for_company: {
        Args: { company_id: string }
        Returns: {
          category: string
          created_at: string
          id: string
          industry: Database["public"]["Enums"]["industry_type"]
          options: Json
          order_index: number
          pillar: Database["public"]["Enums"]["esg_pillar"]
          question_text: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "company" | "investor"
      company_size: "small" | "medium" | "large" | "enterprise"
      esg_pillar: "environmental" | "social" | "governance"
      industry_type:
        | "technology"
        | "manufacturing"
        | "finance"
        | "healthcare"
        | "energy"
        | "retail"
        | "transportation"
        | "agriculture"
        | "construction"
        | "telecommunications"
        | "other"
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
      app_role: ["company", "investor"],
      company_size: ["small", "medium", "large", "enterprise"],
      esg_pillar: ["environmental", "social", "governance"],
      industry_type: [
        "technology",
        "manufacturing",
        "finance",
        "healthcare",
        "energy",
        "retail",
        "transportation",
        "agriculture",
        "construction",
        "telecommunications",
        "other",
      ],
    },
  },
} as const
