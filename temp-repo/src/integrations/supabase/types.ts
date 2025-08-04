export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      company_settings: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string | null
          phone: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: Json | null
          created_at: string
          description: string | null
          document_type: string
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          description?: string | null
          document_type?: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          description?: string | null
          document_type?: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goal_metrics: {
        Row: {
          created_at: string
          current: number | null
          goal_id: string
          id: string
          name: string
          target: number
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current?: number | null
          goal_id: string
          id?: string
          name: string
          target: number
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current?: number | null
          goal_id?: string
          id?: string
          name?: string
          target?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_metrics_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_milestones: {
        Row: {
          completed: boolean | null
          completed_date: string | null
          created_at: string
          description: string | null
          goal_id: string
          id: string
          target_date: string
          title: string
          updated_at: string
        }
        Insert: {
          completed?: boolean | null
          completed_date?: string | null
          created_at?: string
          description?: string | null
          goal_id: string
          id?: string
          target_date: string
          title: string
          updated_at?: string
        }
        Update: {
          completed?: boolean | null
          completed_date?: string | null
          created_at?: string
          description?: string | null
          goal_id?: string
          id?: string
          target_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          assigned_by: string | null
          auto_calculate_progress: boolean | null
          category: Database["public"]["Enums"]["goal_category"]
          created_at: string
          description: string
          id: string
          priority: Database["public"]["Enums"]["goal_priority"]
          progress: number | null
          review_id: string | null
          status: Database["public"]["Enums"]["goal_status"] | null
          target_date: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          auto_calculate_progress?: boolean | null
          category: Database["public"]["Enums"]["goal_category"]
          created_at?: string
          description: string
          id?: string
          priority: Database["public"]["Enums"]["goal_priority"]
          progress?: number | null
          review_id?: string | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          target_date: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          auto_calculate_progress?: boolean | null
          category?: Database["public"]["Enums"]["goal_category"]
          created_at?: string
          description?: string
          id?: string
          priority?: Database["public"]["Enums"]["goal_priority"]
          progress?: number | null
          review_id?: string | null
          status?: Database["public"]["Enums"]["goal_status"] | null
          target_date?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string | null
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          id: string
          job_title: string | null
          last_login: string | null
          manager_id: string | null
          name: string | null
          phone: string | null
          photo_url: string | null
          review_cadence: Database["public"]["Enums"]["review_cadence"] | null
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email?: string | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          id: string
          job_title?: string | null
          last_login?: string | null
          manager_id?: string | null
          name?: string | null
          phone?: string | null
          photo_url?: string | null
          review_cadence?: Database["public"]["Enums"]["review_cadence"] | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          id?: string
          job_title?: string | null
          last_login?: string | null
          manager_id?: string | null
          name?: string | null
          phone?: string | null
          photo_url?: string | null
          review_cadence?: Database["public"]["Enums"]["review_cadence"] | null
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          label: string
          order_index: number
          template_id: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          label: string
          order_index?: number
          template_id: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          label?: string
          order_index?: number
          template_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "review_categories_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "review_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      review_scores: {
        Row: {
          category_id: string
          created_at: string
          final_score: number | null
          id: string
          manager_notes: string | null
          manager_score: number | null
          review_id: string
          self_notes: string | null
          self_score: number | null
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          final_score?: number | null
          id?: string
          manager_notes?: string | null
          manager_score?: number | null
          review_id: string
          self_notes?: string | null
          self_score?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          final_score?: number | null
          id?: string
          manager_notes?: string | null
          manager_score?: number | null
          review_id?: string
          self_notes?: string | null
          self_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_scores_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "review_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_scores_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_templates: {
        Row: {
          created_at: string
          created_by: string
          id: string
          instructions: string | null
          is_default: boolean | null
          name: string
          type: Database["public"]["Enums"]["review_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          instructions?: string | null
          is_default?: boolean | null
          name: string
          type: Database["public"]["Enums"]["review_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          instructions?: string | null
          is_default?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["review_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          completed_at: string | null
          created_at: string
          due_date: string
          id: string
          manager_id: string
          manager_review_completed: boolean | null
          overall_outcome: string | null
          period: string
          requires_follow_up: boolean | null
          self_review_completed: boolean | null
          status: Database["public"]["Enums"]["review_status"] | null
          template_id: string
          type: Database["public"]["Enums"]["review_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_date: string
          id?: string
          manager_id: string
          manager_review_completed?: boolean | null
          overall_outcome?: string | null
          period: string
          requires_follow_up?: boolean | null
          self_review_completed?: boolean | null
          status?: Database["public"]["Enums"]["review_status"] | null
          template_id: string
          type: Database["public"]["Enums"]["review_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_date?: string
          id?: string
          manager_id?: string
          manager_review_completed?: boolean | null
          overall_outcome?: string | null
          period?: string
          requires_follow_up?: boolean | null
          self_review_completed?: boolean | null
          status?: Database["public"]["Enums"]["review_status"] | null
          template_id?: string
          type?: Database["public"]["Enums"]["review_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "review_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      calculate_goal_progress_from_milestones: {
        Args: { goal_id_param: string }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_manager_of: {
        Args: { _manager_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "team_member"
      employment_type: "employee" | "contractor"
      goal_category:
        | "performance"
        | "development"
        | "leadership"
        | "technical"
        | "business"
        | "personal"
      goal_priority: "low" | "medium" | "high" | "critical"
      goal_status:
        | "draft"
        | "active"
        | "on-track"
        | "at-risk"
        | "behind"
        | "completed"
        | "cancelled"
      review_cadence: "monthly" | "quarterly" | "annual"
      review_status: "not_started" | "in_progress" | "complete" | "overdue"
      review_type: "monthly" | "quarterly" | "annual"
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
      app_role: ["admin", "manager", "team_member"],
      employment_type: ["employee", "contractor"],
      goal_category: [
        "performance",
        "development",
        "leadership",
        "technical",
        "business",
        "personal",
      ],
      goal_priority: ["low", "medium", "high", "critical"],
      goal_status: [
        "draft",
        "active",
        "on-track",
        "at-risk",
        "behind",
        "completed",
        "cancelled",
      ],
      review_cadence: ["monthly", "quarterly", "annual"],
      review_status: ["not_started", "in_progress", "complete", "overdue"],
      review_type: ["monthly", "quarterly", "annual"],
    },
  },
} as const
