import { ESTADO_ACTIVO } from "@/lib/constantes"
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { char, date, datetime, decimal, foreignKey, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"
import { servicioTable } from "./servicios"

// Tabla de servicios
export const deudaTable = mysqlTable("deuda", {
  id: int().autoincrement().notNull(),
  fechaLimite: date('fecha_limite', {}).notNull(),
  fechaNotificacion: date('fecha_notificacion', {}).notNull(),
  monto: decimal({ mode: 'number' }).notNull(),
  ultimoPago: varchar('ultimo_pago', { length: 10 }).notNull(),
  idServicio: int("id_servicio").notNull(),

  // Campos de auditoria
  estado: char({ length: 1 }).notNull().default(ESTADO_ACTIVO),
  fechaCreacion: datetime("fecha_creacion").notNull().default(sql`now()`),
  usuarioCreacion: int("usuario_creacion").notNull(),
  fechaModificacion: datetime("fecha_modificacion"),
  usuarioModificacion: int("usuario_modificacion"),
}, (table) => [
  primaryKey({ name: "deuda_id_pk", columns: [table.id] }),
  foreignKey({
    name: "deuda_id_servicio_fk",
    columns: [table.idServicio],
    foreignColumns: [servicioTable.id],
  }),
])

export type Deuda = InferSelectModel<typeof deudaTable>
export type PagoInsert = InferInsertModel<typeof deudaTable>
