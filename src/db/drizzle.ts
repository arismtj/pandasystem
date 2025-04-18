import { drizzle } from "drizzle-orm/mysql2"

// Mediante esta constante interactuaremos con la BD
export const DB = drizzle(process.env.DATABASE_URL!, { logger: true })

export type DrizzleTransaction = typeof DB