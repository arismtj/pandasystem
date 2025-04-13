import { ESTADO_ACTIVO } from "@/lib/constantes"
import { InferSelectModel, sql } from "drizzle-orm"
import { char, datetime, foreignKey, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"

// Tabla donde se registrarán los módulos del sistema
export const moduloTable = mysqlTable('modulo', {
  id: int().autoincrement().notNull(),
  nombre: varchar({ length: 100 }).notNull(),
  icono: varchar({ length: 20 }).notNull(),
  url: varchar({ length: 200 }).notNull(),
}, (table) => [
  primaryKey({ name: 'modulo_id_pk', columns: [table.id] }),
])

// Tabla donde se crearán los nombres de los permisos que tendrá el usuario
export const permisoTable = mysqlTable('permiso', {
  id: int().autoincrement().notNull(),
  nombre: varchar({ length: 100 }).notNull(),

  // Campos de auditoria
  estado: char({ length: 1 }).notNull().default(ESTADO_ACTIVO),
  fechaCreacion: datetime('fecha_creacion').notNull().default(sql`now()`),
  usuarioCreacion: int('usuario_creacion').notNull(),
  fechaModificacion: datetime('fecha_modificacion'),
  usuarioModificacion: int('usuario_modificacion'),
}, (table) => [
  primaryKey({ name: 'permiso_id_pk', columns: [table.id] }),
])

// Tabla intermedia en donde se guardarán los módulos a los que cada permiso tiene acceso
export const permisoModuloTable = mysqlTable('permiso_modulo', {
  id: int().autoincrement().notNull(),
  idPermiso: int('id_permiso').notNull(),
  idModulo: int('id_modulo').notNull(),
}, (table) => [
  primaryKey({ name: 'permiso_modulo_id_pk', columns: [table.id] }),
  foreignKey({ name: 'permiso_modulo_id_permiso_fk', columns: [table.idPermiso], foreignColumns: [permisoTable.id] }),
  foreignKey({ name: 'permiso_modulo_id_modulo_fk', columns: [table.idModulo], foreignColumns: [moduloTable.id] })
])

export type Modulo = InferSelectModel<typeof moduloTable>