'use client'

import { registrarPermisoAction } from "@/actions/permiso.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { SelectDTO } from "@/lib/dto/common.dto"
import { PermisoDTO, PermisoSchemaDTO } from "@/lib/dto/permiso.dto"
import { Button, Flex, LoadingOverlay, MultiSelect, Text, TextInput } from "@mantine/core"
import { useForm, yupResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SelectActivoInactivo } from "../../custom-selects"

interface Props {
  permiso: PermisoDTO | null,
  modulos: SelectDTO[]
}

export function FormularioRegistroPermiso({ permiso, modulos }: Props) {
  const { back } = useRouter()
  const [isPending, setIsPending] = useState(false) // estado para mostrar un loading


  const form = useForm<PermisoDTO>({
    initialValues: {
      id: permiso?.id,
      nombre: permiso?.nombre || '',
      // @ts-expect-error Lo ignoramos al crear uno nuevo
      idsModulo: permiso?.idsModulo?.map(item => item.toString()) || [],
      estado: permiso?.estado || ESTADO_ACTIVO,
    },
    validate: yupResolver(PermisoSchemaDTO)
  })

  function onCancelar() {
    back()
  }

  function onSubmitPermiso(data: any) {
    modals.openConfirmModal({
      title: 'Confirmar',
      centered: true,
      children: (<Text size="sm">¿Desea registrar el permiso?</Text>),
      labels: { confirm: 'Registrar', cancel: 'Cancelar' },
      onConfirm: async () => {
        setIsPending(true)
        const resp = await registrarPermisoAction(data)
        if (resp?.ok) {
          notifications.show({
            title: 'Completado',
            withBorder: true,
            color: 'green',
            message: 'Se ha registrado exitosamente el permiso'
          })
          back()
        }
        setIsPending(false)
      }
    })
  }

  return <>
    <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

    <form onSubmit={form.onSubmit(onSubmitPermiso)}>

      <TextInput
        withAsterisk
        label="Nombres"
        key={form.key('nombre')}
        {...form.getInputProps('nombre')}
      />

      <MultiSelect
        data={modulos}
        label="Módulos permitidos"
        key={form.key('idsModulo')}
        {...form.getInputProps('idsModulo')}
      />

      {permiso?.id && <SelectActivoInactivo
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