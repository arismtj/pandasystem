import { ESTADO_ACTIVO } from "@/lib/constantes"
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { char, datetime, foreignKey, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"
import { servicioTable } from "./servicios"
import { pagoTable } from "./pagos"

// Tabla de servicios
export const comprobanteTable = mysqlTable('comprobante', {
  id: int().autoincrement().notNull(),  
  idPago: int('id_pago').notNull(),

 numero_identificacion: varchar({length:20}).notNull(),
 igv: varchar({length:10}).notNull(),
 tipo_comprobante:varchar({length:10}).notNull(),
fecha_emision: varchar({length:30}).notNull(),




  // Campos de auditoria
  estado: char({ length: 1 }).notNull().default(ESTADO_ACTIVO),
  fechaCreacion: datetime('fecha_creacion').notNull().default(sql`now()`),
  usuarioCreacion: int('usuario_creacion').notNull(),
  fechaModificacion: datetime('fecha_modificacion'),
  usuarioModificacion: int('usuario_modificacion'),

}, (table) => [
  primaryKey({ name: 'comprobante_id_pk', columns: [table.id] }),
  foreignKey({ name: 'comprobante_id_pago_fk', columns: [table.idPago], foreignColumns: [pagoTable.id] })
  
  

])


export type Pago = InferSelectModel<typeof servicioTable>
export type PagoInsert = InferInsertModel<typeof servicioTable>
