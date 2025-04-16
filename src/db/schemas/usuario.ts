import { char, datetime, foreignKey, primaryKey, text, varchar } from "drizzle-orm/mysql-core";
import { int, mysqlTable } from "drizzle-orm/mysql-core";
import { permisoTable } from "./permiso";
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { ESTADO_ACTIVO } from "@/lib/constantes";

// Para evitar problemas, todos los campos en la BD deben ser snake_case y en minusculas pero en el mapeo se puede usar camelCase
// En todas las tablas se usará el nombre id para los primary key

// Tabla de usuarios
export const usuarioTable = mysqlTable('usuario', {
  id: int().autoincrement().notNull(),
  username: varchar('login', { length: 50 }).notNull().unique(),
  password: varchar({ length: 100 }).notNull(),
  nombres: varchar({ length: 100 }).notNull(),
  apellidos: varchar({ length: 100 }).notNull(),
  email: varchar({length:100}).notNull(),
  numeroTelefono: varchar('numero_telefono', { length: 50 }), // Aqui se mapea numeroTelefono en camelCase pero el nombre el BD es snake_case (numero_telefono)
  idPermiso: int('id_permiso').notNull(),

  // Campos de auditoria
  estado: char({ length: 1 }).notNull().default(ESTADO_ACTIVO),
  fechaCreacion: datetime('fecha_creacion').notNull().default(sql`now()`),
  usuarioCreacion: int('usuario_creacion').notNull(),
  fechaModificacion: datetime('fecha_modificacion'),
  usuarioModificacion: int('usuario_modificacion'),

}, (table) => [
  primaryKey({ name: 'usuario_id_pk', columns: [table.id] }),
  foreignKey({ name: 'usuario_id_permiso_fk', columns: [table.idPermiso], foreignColumns: [permisoTable.id] })
])

// Tabla donde se almacenarán las sesiones activas del usuario
export const sesionTable = mysqlTable('sesion', {
  id: varchar({ length: 255 }).notNull(),
  expiracion: datetime().notNull(),
  idUsuario: int('id_usuario').notNull(),
}, (table) => [
  primaryKey({ name: 'sesion_id_pk', columns: [table.id] }),
  foreignKey({ name: 'sesion_id_usuairo_fk', columns: [table.idUsuario], foreignColumns: [usuarioTable.id] })
])

export type Usuario = InferSelectModel<typeof usuarioTable>;
export type UsuarioInsert = InferInsertModel<typeof usuarioTable>;
export type Sesion = InferSelectModel<typeof sesionTable>;