'use client'

import { registrarZonaAction } from "@/actions/zona.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { ZonaDTO, ZonaSchemaDTO } from "@/lib/dto/zona.dto"
import { Button, Flex, LoadingOverlay, Text, TextInput } from "@mantine/core"
import { useForm, yupResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SelectActivoInactivo } from "../custom-selects"

interface Props {
  zona: ZonaDTO | null,
}

export function FormularioRegistroZona({ zona: cliente }: Props) {
  const { back } = useRouter()
  const [isPending, setIsPending] = useState(false) // estado para mostrar un loading


  const form = useForm<ZonaDTO>({
    initialValues: {
      id: cliente?.id,
      nombre: cliente?.nombre || '',
      estado: cliente?.estado || ESTADO_ACTIVO,
    },
    validate: yupResolver(ZonaSchemaDTO)
  })

  function onCancelar() {
    back()
  }

  function onSubmitCliente(data: any) {
    modals.openConfirmModal({
      title: 'Confirmar',
      centered: true,
      children: (<Text size="sm">¿Desea registrar la zona?</Text>),
      labels: { confirm: 'Registrar', cancel: 'Cancelar' },
      onConfirm: async () => {
        setIsPending(true)
        const resp = await registrarZonaAction(data)
        if (resp?.ok) {
          notifications.show({
            title: 'Completado',
            withBorder: true,
            color: 'green',
            message: 'Se ha registrado exitosamente la zona'
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
        label="Nombres"
        key={form.key('nombre')}
        {...form.getInputProps('nombre')}
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