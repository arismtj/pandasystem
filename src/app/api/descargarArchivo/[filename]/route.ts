// app/api/download/[filename]/route.ts
import { descargarArchivo } from '@/lib/files.utils'

interface Params {
  params: { filename: string }
}

export async function GET(req: Request, { params }: Params) {
  const fileBuffer = await descargarArchivo(params.filename)

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${params.filename}"`,
    },
  })
}
