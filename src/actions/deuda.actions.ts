'use server'

import { RespuestaDTO } from "@/lib/dto/common.dto"
import { DeudaDTO, DeudaSchemaDTO } from "@/lib/dto/deuda.dto"
import { PagoDTO, PagoSchemaDTO } from "@/lib/dto/pagos.dto"

import { auth } from "@/server/auth/auth"
import { anularDeuda, registrarDeuda } from "@/server/services/deuda.service"
import { revalidatePath } from "next/cache"

type RespuestaRegistro = RespuestaDTO<DeudaDTO>

export async function registrarDeudaAction(_prevState: RespuestaRegistro | undefined, data: any): Promise<RespuestaRegistro | undefined> {
  const respuesta: RespuestaRegistro = { ok: true }
  const session = await auth()

  try {
    const deudaDTO = await DeudaSchemaDTO.validate(data)

    const deudaGuardado = await registrarDeuda(deudaDTO, session?.user!)

    respuesta.data = deudaGuardado
  } catch (e: any) {
    return { ok: false, error: e.errors }
  }

  revalidatePath('/deudas')
  return respuesta
}

export async function anularDeudaAction(idDeuda: number): Promise<RespuestaDTO<any>> {
  const respuesta: RespuestaDTO<any> = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    // intentamos anular al cliente
    await anularDeuda(idDeuda, session?.user!)

  } catch (e) {
    respuesta.error = e
  }

  revalidatePath('/pagos')
  return respuesta
}