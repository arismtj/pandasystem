import { ESTADO_ACTIVO } from "@/lib/constantes"
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { char, datetime, foreignKey, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"
import { clienteTable } from "./cliente"
import { tiposervicioTable } from "./tiposervicio"

// Tabla de servicios
export const servicioTable = mysqlTable('servicio', {
  id: int().autoincrement().notNull(),
  nombre: varchar({ length: 50 }).notNull(),
 fecha_inicio: varchar({length:100}).notNull(),
 fecha_fin: varchar({length:100}).notNull(),
 unidad:varchar({length:10}).notNull(),
 precio_unidad: varchar({ length: 100 }).notNull(),
 ultimo_pago:varchar({ length: 100 }).notNull(),
 ultimo_deuda:varchar({ length: 100 }).notNull(),
 estado_deuda:varchar({ length: 100 }).notNull(),

  idCliente: int('id_cliente').notNull(),
  idTipoServicio: int('id_tiposervicio').notNull(),



  // Campos de auditoria
  estado: char({ length: 1 }).notNull().default(ESTADO_ACTIVO),
  fechaCreacion: datetime('fecha_creacion').notNull().default(sql`now()`),
  usuarioCreacion: int('usuario_creacion').notNull(),
  fechaModificacion: datetime('fecha_modificacion'),
  usuarioModificacion: int('usuario_modificacion'),

}, (table) => [
  primaryKey({ name: 'servicio_id_pk', columns: [table.id] }),
  foreignKey({ name: 'servicio_id_cliente_fk', columns: [table.idCliente], foreignColumns: [clienteTable.id] }),
  foreignKey({ name: 'servicio_id_tiposervicio_fk', columns: [table.idTipoServicio], foreignColumns: [tiposervicioTable.id] })

  

])


export type Servicio = InferSelectModel<typeof servicioTable>
export type ServicioInsert = InferInsertModel<typeof servicioTable>
