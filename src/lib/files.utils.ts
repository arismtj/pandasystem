import { readFile, writeFile } from "fs/promises"
import path from "path"

export async function guardarArchivo(file: File, folder: string = ''): Promise<string> {
  const buffer = await file.arrayBuffer()

  const filename = path.join(folder, Date.now().toString() + path.extname(file.name))
  await writeFile(path.join(process.env.PANDACORP_RUTA_ARCHIVOS!, filename), Buffer.from(buffer))

  return filename
}

export async function eliminarArchivo(nombreArchivo: string): Promise<void> {

}

export async function descargarArchivo(nombreArchivo: string) {
  const filePath = path.join(process.env.PANDACORP_RUTA_ARCHIVOS!, nombreArchivo)
  const fileBuffer = await readFile(filePath)

  return fileBuffer
}