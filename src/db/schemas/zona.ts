import { ESTADO_ACTIVO } from "@/lib/constantes"
import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm"
import { char, datetime, int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core"


// Tabla de zonas
export const zonaTable = mysqlTable('zona', {
    id: int().autoincrement().notNull(),
    nombre: varchar({ length: 250 }).notNull(),

    // Campos de auditoria
    estado: char({ length: 1 }).notNull().default(ESTADO_ACTIVO),
    fechaCreacion: datetime('fecha_creacion').notNull().default(sql`now()`),
    usuarioCreacion: int('usuario_creacion').notNull(),
    fechaModificacion: datetime('fecha_modificacion'),
    usuarioModificacion: int('usuario_modificacion'),

}, (table) => [
    primaryKey({ name: 'zona_id_pk', columns: [table.id] }),
    // Foraneas
])


export type Zona = InferSelectModel<typeof zonaTable>
export type ZonaInsert = InferInsertModel<typeof zonaTable>
