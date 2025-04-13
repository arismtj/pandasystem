
import { bcryptHash } from "@/server/auth/bcrypt.utils"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get('value')

  if (!value) {
    return NextResponse.json({})
  }

  const hash = await bcryptHash(value)

  return NextResponse.json({ hash })
}
