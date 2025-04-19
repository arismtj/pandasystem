// app/api/download/[filename]/route.ts
import { descargarArchivo } from '@/lib/files.utils'

interface Params {
  params: Promise<{ filename: string }>
}

export async function GET(_req: Request, { params }: Params) {
  const { filename } = await params
  const fileBuffer = await descargarArchivo(filename)

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
