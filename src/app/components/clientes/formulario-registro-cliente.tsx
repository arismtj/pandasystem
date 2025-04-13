'use client'

import { registrarClienteAction } from "@/actions/cliente.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { ClienteDTO, ClienteSchemaDTO } from "@/lib/dto/cliente.dto"
import { SelectDTO } from "@/lib/dto/common.dto"
import { Button, Flex, LoadingOverlay, Select, Text, TextInput } from "@mantine/core"
import { useForm, yupResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SelectActivoInactivo } from "../custom-selects"

interface Props {
  cliente: ClienteDTO | null,
  zonas: SelectDTO[] // Esta lista de permisos la usaremos en el select de zonas
}

export function FormularioRegistroCliente({ cliente, zonas }: Props) {
  const { back } = useRouter()
  const [isPending, setIsPending] = useState(false) // estado para mostrar un loading


  const form = useForm<ClienteDTO>({
    initialValues: {
      id: cliente?.id,
      ip: cliente?.ip || '',
      nombres: cliente?.nombres || '',
      apellidos: cliente?.apellidos || '',
      numero_dni: cliente?.numero_dni || '',
      numeroTelefono: cliente?.numeroTelefono || '',
      // @ts-expect-error Lo ignoramos al crear uno nuevo
      idZona: cliente?.idZona.toString(),
      direccion: cliente?.direccion || '',
      departamento: cliente?.departamento || '',
      provincia: cliente?.provincia || '',
      distrito: cliente?.distrito || '',
      referencia: cliente?.referencia || '',
      coordenadas: cliente?.coordenadas || '',
      fachada: cliente?.fachada || '',
      estado: cliente?.estado || ESTADO_ACTIVO,
    },
    validate: yupResolver(ClienteSchemaDTO)
  })

  function onCancelar() {
    back()
  }

  function onSubmitCliente(data: any) {
    modals.openConfirmModal({
      title: 'Confirmar',
      centered: true,
      children: (<Text size="sm">¿Desea registrar el cliente?</Text>),
      labels: { confirm: 'Registrar', cancel: 'Cancelar' },
      onConfirm: async () => {
        setIsPending(true)
        const resp = await registrarClienteAction(data)
        if (resp?.ok) {
          notifications.show({
            title: 'Completado',
            withBorder: true,
            color: 'green',
            message: 'Se ha registrado exitosamente el cliente'
          })
          back()
        }
        setIsPending(false)
      }
    })
  }

  return <>
    <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

    <form onSubmit={form.onSubmit(onSubmitCliente)}>
      <TextInput
        withAsterisk
        readOnly={!!cliente}
        label="Código del Cliente"
        key={form.key('codigoCliente')}
        {...form.getInputProps('codigoCliente')}
      />

      <TextInput
        withAsterisk
        label="Dirección IP"
        key={form.key('ip')}
        {...form.getInputProps('ip')}
      />

      <TextInput
        withAsterisk
        label="Nombres"
        key={form.key('nombres')}
        {...form.getInputProps('nombres')}
      />

      <TextInput
        withAsterisk
        label="Apellidos"
        key={form.key('apellidos')}
        {...form.getInputProps('apellidos')}
      />

      <TextInput
        label="Nro DNI"
        key={form.key('numeroDni')}
        {...form.getInputProps('numeroDni')}
      />

      <TextInput
        label="Nro Teléfono"
        key={form.key('numeroTelefono')}
        {...form.getInputProps('numeroTelefono')}
      />
      {/* Aqui listamos todos los permisos obtenidos en el prop */}
      <Select
        withAsterisk
        allowDeselect
        data={zonas}
        label="Zona"
        key={form.key('idZona')}
        {...form.getInputProps('idZona')}
      />

      <TextInput
        label="Direccion"
        key={form.key('direccion')}
        {...form.getInputProps('direccion')}
      />

      <TextInput
        label="Referencia"
        key={form.key('referencia')}
        {...form.getInputProps('referencia')}
      />

      <TextInput
        label="Coordenadas"
        key={form.key('coordenadas')}
        {...form.getInputProps('coordenadas')}
      />

      {cliente?.id && <SelectActivoInactivo
        withAsterisk
        label="Estado"
        {...form.getInputProps('estado')}
      />}

      <br />
      <Flex direction={"row"} gap="md">
        <Button type="submit">Registrar</Button>

        <Button color="orange" onClick={onCancelar}>Cancelar</Button>
      </Flex>
    </form>
  </>

}