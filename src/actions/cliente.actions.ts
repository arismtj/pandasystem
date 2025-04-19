'use server'

import { ClienteDTO, ClienteSchemaDTO } from "@/lib/dto/cliente.dto"
import { RespuestaDTO, SelectDTO, SelectOptions } from "@/lib/dto/common.dto"

import { auth } from "@/server/auth/auth"
import { anularCliente, listarClientesSelect, registrarCliente } from "@/server/services/cliente.service"
import { revalidatePath } from "next/cache"

type RespuestaRegistro = RespuestaDTO<ClienteDTO>

export async function registrarClienteAction(data: any, fachada?: File | null): Promise<RespuestaRegistro | undefined> {
  const respuesta: RespuestaRegistro = { ok: true }
  const session = await auth() // obtenemos la sesion del usuario

  try {
    const clienteDTO = await ClienteSchemaDTO.validate(data)

    if (!clienteDTO.id && !fachada) {
      throw new Error('La foto de la fachada es requerida')
    }

    const clienteGuardado = await registrarCliente(clienteDTO, session?.user!, fachada)

    respuesta.data = clienteGuardado
  } catch (e: any) {
    return { ok: false, error: e.errors || e.message }
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

export async function autocompletarCliente(query: string, options: SelectOptions): Promise<SelectDTO[]> {
  if (query.length < 3 && !options.incluirId) {
    return []
  }
  return listarClientesSelect(query, options)
}

export async function autocompletarClienteIncl(query: string, incluirId?: number | string): Promise<SelectDTO[]> {
  return autocompletarCliente(query, { incluirId })
}

export async function autocompletarClienteExcl(query: string, excluirId?: number | string): Promise<SelectDTO[]> {
  return autocompletarCliente(query, { excluirId })
}