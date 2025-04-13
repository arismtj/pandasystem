'use client'

import { ESTADO_ACTIVO } from "@/lib/constantes"
import { SelectDTO } from "@/lib/dto/common.dto"
import { Button, Flex, LoadingOverlay, NumberInput, Select, Text, TextInput } from "@mantine/core"
import { useForm, yupResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SelectActivoInactivo } from "../custom-selects"
import { ServicioDTO, ServicioSchemaDTO } from "@/lib/dto/servicio.dto"
import { registrarServicioAction } from "@/actions/servicio.actions"

interface Props {
  servicio: ServicioDTO | null
}

export function FormularioRegistroServicio({ servicio }: Props) {
  const { back } = useRouter()
  const [isPending, setIsPending] = useState(false)


  const form = useForm<ServicioDTO>({
    initialValues: {
      id: servicio?.id,
      nombre: servicio?.nombre || '',
      tipo: servicio?.tipo || '',
      precio: servicio?.precio || '',
      estado: servicio?.estado || ESTADO_ACTIVO,
    },
    validate: yupResolver(ServicioSchemaDTO)
  })

  function onCancelar() {
    back()
  }

  function onSubmitServicio(data: any) {
    modals.openConfirmModal({
      title: 'Confirmar',
      centered: true,
      children: (<Text size="sm">¿Desea registrar el servicio?</Text>),
      labels: { confirm: 'Registrar', cancel: 'Cancelar' },
      onConfirm: async () => {
        setIsPending(true)
        const resp = await registrarServicioAction(undefined, data)
        if (resp?.ok) {
          notifications.show({
            title: 'Completado',
            withBorder: true,
            color: 'green',
            message: 'Se ha registrado exitosamente el servicio'
          })
          back()
        }
        setIsPending(false)
      }
    })
  }

  return <>
    <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

    <form onSubmit={form.onSubmit(onSubmitServicio)}>

      <TextInput
        withAsterisk
        label="Nombre"
        key={form.key('nombre')}
        {...form.getInputProps('nombre')}
      />

      <TextInput
        withAsterisk
        label="Tipo"
        key={form.key('tipo')}
        {...form.getInputProps('tipo')}
      />

      <NumberInput
        withAsterisk
        hideControls
        label="Precio"
        prefix="S/."
        decimalScale={2}
        key={form.key('precio')}
        {...form.getInputProps('precio')}
      />


      {servicio?.id && <SelectActivoInactivo
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