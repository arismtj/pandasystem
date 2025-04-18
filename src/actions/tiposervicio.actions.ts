'use server'

import { RespuestaDTO, SelectDTO2 } from "@/lib/dto/common.dto"
import { TipoServicioDTO, TipoServicioSchemaDTO } from "@/lib/dto/tiposervicio.dto"

import { auth } from "@/server/auth/auth"
import { anularTipoServicio, listarTiposServicioSelect, registrarTipoServicio } from "@/server/services/tiposervicio.service"
import { revalidatePath } from "next/cache"

type RespuestaRegistro = RespuestaDTO<TipoServicioDTO>

export async function registrarTipoServicioAction(data: any): Promise<RespuestaRegistro | undefined> {
  const respuesta: RespuestaRegistro = { ok: true }
  const session = await auth()

  try {
    const tipoServicioDTO = await TipoServicioSchemaDTO.validate(data)

    const tipoServicioGuardado = await registrarTipoServicio(tipoServicioDTO, session?.user!)

    respuesta.data = tipoServicioGuardado
  } catch (e: any) {
    return { ok: false, error: e.errors }
  }

  revalidatePath('/servicios/tipos-servicio')
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

  revalidatePath('/servicios/tipos-servicio')
  return respuesta
}

export async function autocompletarTiposServicio(query: string, excluirId?: number | string): Promise<SelectDTO2[]> {
  return listarTiposServicioSelect(query, { excluirId })
}