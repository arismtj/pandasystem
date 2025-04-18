'use client'

import { DateInput } from '@mantine/dates'
import { autocompletarCliente } from "@/actions/cliente.actions"
import { registrarServicioAction } from "@/actions/servicio.actions"
import { autocompletarTiposServicio } from "@/actions/tiposervicio.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { ServicioDTO, ServicioSchemaDTO } from "@/lib/dto/servicio.dto"
import { Button, Flex, Grid, GridCol, LoadingOverlay, NumberInput, StyleProp, Text, TextInput } from "@mantine/core"
import { useForm, yupResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AsyncAutocomplete } from "../async-autocomplete"
import { SelectActivoInactivo, SelectEstadoDeuda } from "../custom-selects"

interface Props {
  servicio: ServicioDTO | null
}

export function FormularioRegistroServicio({ servicio }: Props) {
  const { back } = useRouter()
  const [isPending, setIsPending] = useState(false)

  const gridSpan: StyleProp<number> = { sm: 6 }

  const form = useForm<ServicioDTO>({
    initialValues: {
      id: servicio?.id,
      fechaInicio: servicio?.fechaInicio || new Date(),
      fechaFin: servicio?.fechaFin,
      // @ts-expect-error numero como string
      unidad: servicio?.unidad || '',
      // @ts-expect-error numero como string
      precioUnidad: servicio?.precioUnidad || '',
      ultimoPago: servicio?.ultimoPago,
      ultimaDeuda: servicio?.ultimaDeuda,
      estadoDeuda: servicio?.estadoDeuda || 'PE',
      numeroIp: servicio?.numeroIp || '',

      // @ts-expect-error id como string
      idCliente: servicio?.idCliente?.toString(),
      // @ts-expect-error id como string
      idTipoServicio: servicio?.idTipoServicio?.toString(),

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

      <Grid>
        <GridCol span={gridSpan}>
          <AsyncAutocomplete
            label='Cliente'
            key={form.key('idCliente')}
            {...form.getInputProps('idCliente')}
            serverFunction={autocompletarCliente}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <AsyncAutocomplete
            withAsterisk
            minQueryText={0}
            label='Tipo de servicio'
            key={form.key('idTipoServicio')}
            {...form.getInputProps('idTipoServicio')}
            serverFunction={autocompletarTiposServicio}
            onSelect={(value) => {
              // @ts-expect-error espera un número pero el formulario maneja strings
              form.setFieldValue('precioUnidad', value.extras + '')
            }}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <DateInput
            withAsterisk
            valueFormat='DD/MM/YYYY'
            label="Fecha de inicio"
            key={form.key('fechaInicio')}
            {...form.getInputProps('fechaInicio')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <DateInput
            valueFormat='DD/MM/YYYY'
            label="Fecha de fin"
            key={form.key('fechaFin')}
            {...form.getInputProps('fechaFin')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <NumberInput
            withAsterisk
            hideControls
            label="Unidad"
            decimalScale={0}
            key={form.key('unidad')}
            {...form.getInputProps('unidad')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <NumberInput
            withAsterisk
            hideControls
            label="Precio unidad"
            prefix="S/."
            decimalScale={2}
            key={form.key('precioUnidad')}
            {...form.getInputProps('precioUnidad')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <DateInput
            valueFormat='DD/MM/YYYY'
            label="Fecha de último pago"
            key={form.key('ultimoPago')}
            {...form.getInputProps('ultimoPago')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <DateInput
            valueFormat='DD/MM/YYYY'
            label="Fecha de última deuda"
            key={form.key('ultimaDeuda')}
            {...form.getInputProps('ultimaDeuda')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <TextInput
            label="Número IP"
            key={form.key('numeroIp')}
            {...form.getInputProps('numeroIp')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <SelectEstadoDeuda
            withAsterisk
            label="Estado deuda"
            key={form.key('estadoDeuda')}
            {...form.getInputProps('estadoDeuda')}
          />
        </GridCol>

        {servicio?.id && <GridCol span={gridSpan}>
          <SelectActivoInactivo
            withAsterisk
            label="Estado"
            key={form.key('estado')}
            {...form.getInputProps('estado')}
          />
        </GridCol>}

      </Grid>



      <br />
      <Flex direction={"row"} gap="md">
        <Button type="submit">Registrar</Button>

        <Button color="orange" onClick={onCancelar}>Cancelar</Button>
      </Flex>
    </form >
  </>

}