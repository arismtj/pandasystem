"use server"

import { signIn, signOut } from "@/server/auth/auth"
import { AuthError } from "next-auth"
import { redirect } from "next/navigation"

export async function loginAction(_prevState: string | undefined, formData: FormData) {
  const rawData = {
    username: formData.get('username') as string | null,
    password: formData.get('password') as string | null
  }

  try {
    await signIn('credentials', { ...rawData, redirect: false })
  } catch (error) {
    return (error as AuthError).cause?.err?.message
  }

  // // Si las credenciales son correctas, generamos la cookie
  // const token = await generarTokenSesion()
  // const sesion = await crearSesion(token, usuario.id)

  // setSessionTokenCookie(token, sesion.expiracion)

  return redirect('/')
}

export async function logoutAction() {
  signOut()

  // return redirect('/login')
}