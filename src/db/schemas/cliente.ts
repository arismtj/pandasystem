import { ESTADO_ACTIVO } from "@/lib/constantes"
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { char, datetime, foreignKey, int, mysqlTable, primaryKey, varchar,  } from "drizzle-orm/mysql-core"
import { zonaTable } from "./zona"
import { text } from "stream/consumers"

// Para evitar problemas, todos los campos en la BD deben ser snake_case y en minusculas pero en el mapeo se puede usar camelCase
// En todas las tablas se usará el nombre id para los primary key

// Tabla de usuarios
export const clienteTable = mysqlTable('cliente', {
  id: int().autoincrement().notNull(),
  nombres: varchar({ length: 100 }).notNull(),
  apellidos: varchar({ length: 100 }).notNull(),
  dni: varchar({ length: 8 }).notNull(),
  celular: varchar({ length: 50 }),
  direccion: varchar({ length: 250 }).notNull(),
  departamento: varchar({length: 150}).notNull(),
  provincia: varchar({length: 150}).notNull(),
  distrito: varchar({length: 150}).notNull(),
  referencia: varchar({ length: 250 }),  
  coordenadas: varchar({ length: 250 }).notNull(),
  fachada: varchar({length:250}).notNull(),
  idZona: int('id_zona').notNull(),

  // Campos de auditoria
  estado: char({ length: 1 }).notNull().default(ESTADO_ACTIVO),
  fechaCreacion: datetime('fecha_creacion').notNull().default(sql`now()`),
  usuarioCreacion: int('usuario_creacion').notNull(),
  fechaModificacion: datetime('fecha_modificacion'),
  usuarioModificacion: int('usuario_modificacion'),

}, (table) => [
  primaryKey({ name: 'cliente_id_pk', columns: [table.id] }),
  foreignKey({ name: 'cliente_id_zona_fk', columns: [table.idZona], foreignColumns: [zonaTable.id] })
])


export type Cliente = InferSelectModel<typeof clienteTable>
export type ClienteInsert = InferInsertModel<typeof clienteTable>
