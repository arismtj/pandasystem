import { ESTADO_ACTIVO } from "@/lib/constantes"
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { char, datetime, decimal, foreignKey, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"
import { servicioTable } from "./servicios"
import { deudaTable } from "./deuda"

// Tabla de servicios
export const pagoTable = mysqlTable('pago', {
  id: int().autoincrement().notNull(),
  fechaPago: datetime('fecha_pago', {}).notNull(),
  monto: decimal({ mode: 'number' }).notNull(),
  formaPago: varchar('forma_pago', { length: 30 }).notNull(),

  idServicio: int('id_servicio').notNull(),
  idDeuda: int('id_deuda').notNull(),

  // Campos de auditoria
  estado: char({ length: 1 }).notNull().default(ESTADO_ACTIVO),
  fechaCreacion: datetime('fecha_creacion').notNull().default(sql`now()`),
  usuarioCreacion: int('usuario_creacion').notNull(),
  fechaModificacion: datetime('fecha_modificacion'),
  usuarioModificacion: int('usuario_modificacion'),

}, (table) => [
  primaryKey({ name: 'pago_id_pk', columns: [table.id] }),
  foreignKey({ name: 'pago_id_servicio_fk', columns: [table.idServicio], foreignColumns: [servicioTable.id] }),
  foreignKey({ name: 'pago_id_deuda_fk', columns: [table.idDeuda], foreignColumns: [deudaTable.id] })
])


export type Pago = InferSelectModel<typeof servicioTable>
export type PagoInsert = InferInsertModel<typeof servicioTable>
