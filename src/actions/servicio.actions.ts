'use server'

import { RespuestaDTO } from "@/lib/dto/common.dto"
import { ServicioDTO, ServicioSchemaDTO } from "@/lib/dto/servicio.dto"

import { auth } from "@/server/auth/auth"
import { anularServicio, registrarServicio } from "@/server/services/servicio.service"
import { revalidatePath } from "next/cache"

type RespuestaRegistro = RespuestaDTO<ServicioDTO>

export async function registrarServicioAction(_prevState: RespuestaRegistro | undefined, data: any): Promise<RespuestaRegistro | undefined> {
  const respuesta: RespuestaRegistro = { ok: true }
  const session = await auth()

  try {
    const servicioDTO = await ServicioSchemaDTO.validate(data)

    const servicioGuardado = await registrarServicio(servicioDTO, session?.user!)

    respuesta.data = servicioGuardado
  } catch (e: any) {
    return { ok: false, error: e.errors }
  }

  revalidatePath('/clientes')
  return respuesta
}

export async function anularServicioAction(idServicio: number): Promise<RespuestaDTO<any>> {
  const respuesta: RespuestaDTO<any> = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    // intentamos anular al cliente
    await anularServicio(idServicio, session?.user!)

  } catch (e) {
    respuesta.error = e
  }

  revalidatePath('/servicios')
  return respuesta
}