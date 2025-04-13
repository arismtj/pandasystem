'use server'

import { ClienteDTO, ClienteSchemaDTO } from "@/lib/dto/cliente.dto"
import { RespuestaDTO } from "@/lib/dto/common.dto"

import { auth } from "@/server/auth/auth"
import { anularCliente, registrarCliente } from "@/server/services/cliente.service"
import { revalidatePath } from "next/cache"

type RespuestaRegistro = RespuestaDTO<ClienteDTO>

export async function registrarClienteAction(data: any): Promise<RespuestaRegistro | undefined> {
  const respuesta: RespuestaRegistro = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    const clienteDTO = await ClienteSchemaDTO.validate(data)

    const clienteGuardado = await registrarCliente(clienteDTO, session?.user!)

    respuesta.data = clienteGuardado
  } catch (e: any) {
    return { ok: false, error: e.errors }
  }

  revalidatePath('/clientes')
  return respuesta
}

export async function anularClienteAction(idCliente: number): Promise<RespuestaDTO<any>> {
  const respuesta: RespuestaDTO<any> = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    // intentamos anular al cliente
    await anularCliente(idCliente, session?.user!)

  } catch (e) {
    respuesta.error = e
  }

  revalidatePath('/clientes')
  return respuesta
}