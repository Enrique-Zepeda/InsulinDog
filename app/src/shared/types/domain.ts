import type { Tables, TablesInsert, TablesUpdate, Enums } from "./database.types";

// ==========================================
// ENUMS
// ==========================================

export type Especie = Enums<"especie_enum">;
export type Rol = Enums<"rol_enum">;
export type TipoComida = Enums<"tipo_comida_enum">;

// La vista lo generó como string | null, por eso lo definimos manual.
export type TipoRegistroTimeline = "insulina" | "glucosa" | "alimentacion";

// ==========================================
// ROW TYPES - datos que vienen de Supabase
// ==========================================

export type Usuario = Tables<"usuarios">;
export type Paciente = Tables<"pacientes">;
export type Colaborador = Tables<"colaboradores">;

export type RegistroInsulina = Tables<"registros_insulina">;
export type RegistroGlucosa = Tables<"registros_glucosa">;
export type RegistroAlimentacion = Tables<"registros_alimentacion">;

export type TimelineEvent = Tables<"historial_medico_timeline">;

// ==========================================
// INSERT TYPES - datos para crear registros
// ==========================================

export type CrearUsuario = TablesInsert<"usuarios">;
export type CrearPaciente = TablesInsert<"pacientes">;
export type CrearColaborador = TablesInsert<"colaboradores">;

export type CrearRegistroInsulina = TablesInsert<"registros_insulina">;
export type CrearRegistroGlucosa = TablesInsert<"registros_glucosa">;
export type CrearRegistroAlimentacion = TablesInsert<"registros_alimentacion">;

// ==========================================
// UPDATE TYPES - datos para actualizar registros
// ==========================================

export type ActualizarUsuario = TablesUpdate<"usuarios">;
export type ActualizarPaciente = TablesUpdate<"pacientes">;
export type ActualizarColaborador = TablesUpdate<"colaboradores">;

export type ActualizarRegistroInsulina = TablesUpdate<"registros_insulina">;
export type ActualizarRegistroGlucosa = TablesUpdate<"registros_glucosa">;
export type ActualizarRegistroAlimentacion = TablesUpdate<"registros_alimentacion">;
