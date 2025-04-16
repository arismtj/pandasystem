'use server'

import { RespuestaDTO } from "@/lib/dto/common.dto"
import { TipoServicioDTO, TipoServicioSchemaDTO } from "@/lib/dto/tiposervicio.dto"

import { auth } from "@/server/auth/auth"
import { anularTipoServicio, registrarTipoServicio } from "@/server/services/tiposervicio.service"
import { revalidatePath } from "next/cache"

type RespuestaRegistro = RespuestaDTO<TipoServicioDTO>

export async function registrarTipoServicioAction(_prevState: RespuestaRegistro | undefined, data: any): Promise<RespuestaRegistro | undefined> {
  const respuesta: RespuestaRegistro = { ok: true }
  const session = await auth()

  try {
    const tipoServicioDTO = await TipoServicioSchemaDTO.validate(data)

    const tipoServicioGuardado = await registrarTipoServicio(tipoServicioDTO, session?.user!)

    respuesta.data = tipoServicioGuardado
  } catch (e: any) {
    return { ok: false, error: e.errors }
  }

  revalidatePath('/tiposervicio')
  return respuesta
}

export async function anularTipoServicioAction(idTipoServicio: number): Promise<RespuestaDTO<any>> {
  const respuesta: RespuestaDTO<any> = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    // intentamos anular al cliente
    await anularTipoServicio(idTipoServicio, session?.user!)

  } catch (e) {
    respuesta.error = e
  }

  revalidatePath('/tiposervicio')
  return respuesta
}