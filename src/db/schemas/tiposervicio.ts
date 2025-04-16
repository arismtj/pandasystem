import { ESTADO_ACTIVO } from "@/lib/constantes"
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { char, datetime, decimal, foreignKey, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"
import { clienteTable } from "./cliente"

// Tabla de servicios
export const tiposervicioTable = mysqlTable('tiposervicio', {
  id: int().autoincrement().notNull(),
  nombre: varchar({ length: 50 }).notNull(),
  frecuencia: char({ length: 2 }).notNull(),
  precioUnitario: decimal('precio_unitario', { mode: 'number' }).notNull(),
  idCliente: int('id_cliente').notNull(),

  // Campos de auditoria
  estado: char({ length: 1 }).notNull().default(ESTADO_ACTIVO),
  fechaCreacion: datetime('fecha_creacion').notNull().default(sql`now()`),
  usuarioCreacion: int('usuario_creacion').notNull(),
  fechaModificacion: datetime('fecha_modificacion'),
  usuarioModificacion: int('usuario_modificacion'),

}, (table) => [
  primaryKey({ name: 'tiposervicio_id_pk', columns: [table.id] }),
  foreignKey({ name: 'tiposervicio_id_cliente_fk', columns: [table.idCliente], foreignColumns: [clienteTable.id] })

])


export type TipoServicio = InferSelectModel<typeof tiposervicioTable>
export type TipoServicioInsert = InferInsertModel<typeof tiposervicioTable>
