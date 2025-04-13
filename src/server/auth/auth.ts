import { ESTADO_ACTIVO } from "@/lib/constantes"
import NextAuth, { DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { obtenerUsuarioPorUsername } from "../services/usuario.service"
import { bcryptCompare } from "./bcrypt.utils"

const USUARIO_CONTRASEÑA_INCORRECTO = 'Usuario o contraseña incorrecto'

declare module "next-auth" {
  interface User {
    nombres: string
    apellidos: string
    idPermiso?: number
    numeroTelefono?: string | null
  }

  interface Session {
    user: User
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          nombres: session.user.name?.split('|')[0]!,
          apellidos: session.user.name?.split('|')[1]!,
        }
      }
    },
    authorized: async ({ auth }) => {
      return !!auth
    }
  },
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      authorize: async (credentials) => {

        const rawData = {
          username: credentials.username as string | null,
          password: credentials.password as string | null
        }

        if (!rawData.password || !rawData.username) {
          throw new Error('Usuario o contraseña incompleto')
        }

        const usuario = await obtenerUsuarioPorUsername(rawData.username)

        if (!usuario) {
          throw new Error(USUARIO_CONTRASEÑA_INCORRECTO)
        }

        if (usuario.estado !== ESTADO_ACTIVO) {
          throw new Error('El usuario se encuentra inactivo')
        }

        const contraseniaValida = await bcryptCompare(rawData.password, usuario.password)

        if (!contraseniaValida) {
          throw new Error(USUARIO_CONTRASEÑA_INCORRECTO)
        }

        return {
          id: usuario.id + '',
          name: usuario.nombres + '|' + usuario.apellidos,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          idPermiso: usuario.idPermiso,
          numeroTelefono: usuario.numeroTelefono,
        }
      }
    })
  ],
})