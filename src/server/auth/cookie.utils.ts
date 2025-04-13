import { cookies } from "next/headers"
import { SessionValidationResult, validarTokenSesion } from "./sesion.utils"
import { cache } from "react"

export async function setSessionTokenCookie(token: string, expiresAt: Date): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/"
  })
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  })
}

export const getCurrentSession = cache(async (): Promise<SessionValidationResult> => {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value ?? null
  return validateCurrentSession(token)
})

export async function validateCurrentSession(token: string | null) {
  if (token === null) {
    return { session: null, user: null }
  }
  const result = await validarTokenSesion(token)
  return result
}