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
      colaboradores: {
        Row: {
          created_at: string
          id: string
          paciente_id: string
          rol: Database["public"]["Enums"]["rol_enum"]
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          paciente_id: string
          rol: Database["public"]["Enums"]["rol_enum"]
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          id?: string
          paciente_id?: string
          rol?: Database["public"]["Enums"]["rol_enum"]
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "colaboradores_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colaboradores_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pacientes: {
        Row: {
          creado_por: string | null
          created_at: string
          especie: Database["public"]["Enums"]["especie_enum"]
          fecha_nacimiento: string | null
          id: string
          nombre: string
          peso_kg: number
          updated_at: string
        }
        Insert: {
          creado_por?: string | null
          created_at?: string
          especie: Database["public"]["Enums"]["especie_enum"]
          fecha_nacimiento?: string | null
          id?: string
          nombre: string
          peso_kg: number
          updated_at?: string
        }
        Update: {
          creado_por?: string | null
          created_at?: string
          especie?: Database["public"]["Enums"]["especie_enum"]
          fecha_nacimiento?: string | null
          id?: string
          nombre?: string
          peso_kg?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pacientes_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_alimentacion: {
        Row: {
          cantidad_gramos: number
          created_at: string
          fecha_hora_comida: string
          id: string
          notas: string | null
          paciente_id: string
          tipo_comida: Database["public"]["Enums"]["tipo_comida_enum"]
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          cantidad_gramos: number
          created_at?: string
          fecha_hora_comida?: string
          id?: string
          notas?: string | null
          paciente_id: string
          tipo_comida: Database["public"]["Enums"]["tipo_comida_enum"]
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          cantidad_gramos?: number
          created_at?: string
          fecha_hora_comida?: string
          id?: string
          notas?: string | null
          paciente_id?: string
          tipo_comida?: Database["public"]["Enums"]["tipo_comida_enum"]
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_alimentacion_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_alimentacion_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_glucosa: {
        Row: {
          created_at: string
          fecha_hora_medicion: string
          horas_desde_ultima_comida: number
          id: string
          nivel_glucosa_mgdl: number
          notas: string | null
          paciente_id: string
          updated_at: string
          usuario_id: string | null
        }
        Insert: {
          created_at?: string
          fecha_hora_medicion?: string
          horas_desde_ultima_comida: number
          id?: string
          nivel_glucosa_mgdl: number
          notas?: string | null
          paciente_id: string
          updated_at?: string
          usuario_id?: string | null
        }
        Update: {
          created_at?: string
          fecha_hora_medicion?: string
          horas_desde_ultima_comida?: number
          id?: string
          nivel_glucosa_mgdl?: number
          notas?: string | null
          paciente_id?: string
          updated_at?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_glucosa_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_glucosa_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      registros_insulina: {
        Row: {
          created_at: string
          dosis_unidades: number
          fecha_hora_aplicacion: string
          id: string
          notas: string | null
          paciente_id: string
          updated_at: string
          usuario_id: string | null
          zona_cuerpo: string | null
        }
        Insert: {
          created_at?: string
          dosis_unidades: number
          fecha_hora_aplicacion?: string
          id?: string
          notas?: string | null
          paciente_id: string
          updated_at?: string
          usuario_id?: string | null
          zona_cuerpo?: string | null
        }
        Update: {
          created_at?: string
          dosis_unidades?: number
          fecha_hora_aplicacion?: string
          id?: string
          notas?: string | null
          paciente_id?: string
          updated_at?: string
          usuario_id?: string | null
          zona_cuerpo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registros_insulina_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registros_insulina_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          correo: string | null
          created_at: string
          id: string
          nombre: string | null
          updated_at: string
          url_imagen: string | null
        }
        Insert: {
          correo?: string | null
          created_at?: string
          id: string
          nombre?: string | null
          updated_at?: string
          url_imagen?: string | null
        }
        Update: {
          correo?: string | null
          created_at?: string
          id?: string
          nombre?: string | null
          updated_at?: string
          url_imagen?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      historial_medico_timeline: {
        Row: {
          detalle: string | null
          extra: string | null
          fecha_hora: string | null
          id: string | null
          notas: string | null
          paciente_id: string | null
          tipo_registro: string | null
          usuario_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_patient_role: {
        Args: {
          _paciente_id: string
          _roles: Database["public"]["Enums"]["rol_enum"][]
        }
        Returns: boolean
      }
      is_patient_collaborator: {
        Args: { _paciente_id: string }
        Returns: boolean
      }
    }
    Enums: {
      especie_enum: "perro" | "gato" | "otro"
      rol_enum: "administrador" | "editor" | "lector"
      tipo_comida_enum: "desayuno" | "comida" | "cena" | "snack"
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
      especie_enum: ["perro", "gato", "otro"],
      rol_enum: ["administrador", "editor", "lector"],
      tipo_comida_enum: ["desayuno", "comida", "cena", "snack"],
    },
  },
} as const
