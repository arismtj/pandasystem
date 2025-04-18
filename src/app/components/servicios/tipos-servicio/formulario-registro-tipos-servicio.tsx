'use client'

import { registrarTipoServicioAction } from "@/actions/tiposervicio.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { TipoServicioDTO, TipoServicioSchemaDTO } from "@/lib/dto/tiposervicio.dto"
import { Button, Flex, LoadingOverlay, NumberInput, Text, TextInput } from "@mantine/core"
import { useForm, yupResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SelectActivoInactivo, SelectFrecuencia } from "../../custom-selects"

interface Props {
  tipoServicio: TipoServicioDTO | null,
}

export function FormularioRegistroTipoServicio({ tipoServicio }: Props) {
  const { back } = useRouter()
  const [isPending, setIsPending] = useState(false) // estado para mostrar un loading


  const form = useForm<TipoServicioDTO>({
    initialValues: {
      id: tipoServicio?.id,
      nombre: tipoServicio?.nombre || '',
      frecuencia: tipoServicio?.frecuencia || '',
      // @ts-expect-error Lo ignoramos al crear uno nuevo
      precioUnitario: tipoServicio?.precioUnitario?.toString() || '',
      estado: tipoServicio?.estado || ESTADO_ACTIVO,
    },
    validate: yupResolver(TipoServicioSchemaDTO)
  })

  function onCancelar() {
    back()
  }

  function onSubmitTipoServicio(data: any) {
    modals.openConfirmModal({
      title: 'Confirmar',
      centered: true,
      children: (<Text size="sm">¿Desea registrar el tipo de servicio?</Text>),
      labels: { confirm: 'Registrar', cancel: 'Cancelar' },
      onConfirm: async () => {
        setIsPending(true)
        const resp = await registrarTipoServicioAction(data)
        if (resp?.ok) {
          notifications.show({
            title: 'Completado',
            withBorder: true,
            color: 'green',
            message: 'Se ha registrado exitosamente el tipo de servicio'
          })
          back()
        }
        setIsPending(false)
      }
    })
  }

  return <>
    <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

    <form onSubmit={form.onSubmit(onSubmitTipoServicio)}>

      <TextInput
        withAsterisk
        label="Nombre"
        key={form.key('nombre')}
        {...form.getInputProps('nombre')}
      />

      <SelectFrecuencia
        withAsterisk
        label="Frecuencia"
        key={form.key('frecuencia')}
        {...form.getInputProps('frecuencia')}
      />

      <NumberInput
        withAsterisk
        hideControls
        label="Precio unitario"
        prefix="S/."
        decimalScale={2}
        key={form.key('precioUnitario')}
        {...form.getInputProps('precioUnitario')}
      />

      {tipoServicio?.id && <SelectActivoInactivo
        withAsterisk
        label="Estado"
        key={form.key('estado')}
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