'use server'

import { RespuestaDTO } from "@/lib/dto/common.dto"
import { PagoDTO, PagoSchemaDTO } from "@/lib/dto/pagos.dto"

import { auth } from "@/server/auth/auth"
import {  anularPago, registrarPago,  } from "@/server/services/pago.service"
import { revalidatePath } from "next/cache"

type RespuestaRegistro = RespuestaDTO<PagoDTO>

export async function registrarPagoAction(_prevState: RespuestaRegistro | undefined, data: any): Promise<RespuestaRegistro | undefined> {
  const respuesta: RespuestaRegistro = { ok: true }
  const session = await auth()

  try {
    const pagoDTO = await PagoSchemaDTO.validate(data)

    const pagoGuardado = await registrarPago(pagoDTO, session?.user!)

    respuesta.data = pagoGuardado
  } catch (e: any) {
    return { ok: false, error: e.errors }
  }

  revalidatePath('/pagos')
  return respuesta
}

export async function anularPagoAction(idPago: number): Promise<RespuestaDTO<any>> {
  const respuesta: RespuestaDTO<any> = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    // intentamos anular al cliente
    await anularPago(idPago, session?.user!)

  } catch (e) {
    respuesta.error = e
  }

  revalidatePath('/pagos')
  return respuesta
}