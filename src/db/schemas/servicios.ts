import { ESTADO_ACTIVO } from "@/lib/constantes"
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { char, date, datetime, decimal, foreignKey, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"
import { clienteTable } from "./cliente"
import { tiposervicioTable } from "./tiposervicio"

// Tabla de servicios
export const servicioTable = mysqlTable('servicio', {
  id: int().autoincrement().notNull(),
  fechaInicio: date('fecha_inicio', {}).notNull(),
  fechaFin: date('fecha_fin', {}),
  unidad: int().notNull(),
  precioUnidad: decimal('precio_unidad', { mode: 'number' }).notNull(),
  ultimoPago: date('ultimo_pago', {}),
  ultimaDeuda: date('ultima_deuda', {}),
  estadoDeuda: char('estado_deuda', { length: 2 }).notNull().default('PE'),
  numeroIp: varchar('numero_ip', { length: 100 }),

  idCliente: int('id_cliente').notNull(),
  idTipoServicio: int('id_tipo_servicio').notNull(),

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
