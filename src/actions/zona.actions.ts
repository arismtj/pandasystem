'use server'

import { RespuestaDTO } from "@/lib/dto/common.dto"
import { ZonaDTO, ZonaSchemaDTO } from "@/lib/dto/zona.dto"

import { auth } from "@/server/auth/auth"
import { anularZona, registrarZona } from "@/server/services/zona.service"
import { revalidatePath } from "next/cache"

type RespuestaRegistro = RespuestaDTO<ZonaDTO>

export async function registrarZonaAction(data: any): Promise<RespuestaRegistro | undefined> {
  const respuesta: RespuestaRegistro = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    const zonaDTO = await ZonaSchemaDTO.validate(data)

    const zonaGuardada = await registrarZona(zonaDTO, session?.user!)

    respuesta.data = zonaGuardada
  } catch (e: any) {
    return { ok: false, error: e.errors }
  }

  revalidatePath('/zonas')
  return respuesta
}

export async function anularZonaAction(idZona: number): Promise<RespuestaDTO<any>> {
  const respuesta: RespuestaDTO<any> = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    // intentamos anular al cliente
    await anularZona(idZona, session?.user!)

  } catch (e) {
    respuesta.error = e
  }

  revalidatePath('/zonas')
  return respuesta
}