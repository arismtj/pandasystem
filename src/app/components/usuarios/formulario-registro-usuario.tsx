'use client'

import { registrarUsuarioAction } from "@/actions/usuarios.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { SelectDTO } from "@/lib/dto/common.dto"
import { UsuarioDTO, UsuarioSchemaDTO } from "@/lib/dto/usuario.dto"
import { Button, Flex, LoadingOverlay, NumberInput, Select, Text, TextInput } from "@mantine/core"
import { useForm, yupResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SelectActivoInactivo } from "../custom-selects"

interface Props {
  usuario: UsuarioDTO | null
  permisos: SelectDTO[] // Esta lista de permisos la usaremos en el select de permisos
}

export function FormularioRegistroUsuario({ usuario, permisos }: Props) {
  const { back } = useRouter()
  const [isPending, setIsPending] = useState(false)


  const form = useForm<UsuarioDTO>({
    initialValues: {
      id: usuario?.id,
      username: usuario?.username || '',
      nombres: usuario?.nombres || '',
      apellidos: usuario?.apellidos || '',
      numeroTelefono: usuario?.numeroTelefono || '',
      // @ts-expect-error Lo ignoramos al crear uno nuevo
      idPermiso: usuario?.idPermiso.toString(),
      estado: usuario?.estado || ESTADO_ACTIVO,
    },
    validate: yupResolver(UsuarioSchemaDTO)
  })

  function onCancelar() {
    back()
  }

  function onSubmitUsuario(data: any) {
    modals.openConfirmModal({
      title: 'Confirmar',
      centered: true,
      children: (<Text size="sm">¿Desea registrar el usuario?</Text>),
      labels: { confirm: 'Registrar', cancel: 'Cancelar' },
      onConfirm: async () => {
        setIsPending(true)
        const resp = await registrarUsuarioAction(undefined, data)
        if (resp?.ok) {
          notifications.show({
            title: 'Completado',
            withBorder: true,
            color: 'green',
            message: 'Se ha registrado exitosamente el usuario'
          })
          back()
        }
        setIsPending(false)
      }
    })
  }

  return <>
    <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

    <form onSubmit={form.onSubmit(onSubmitUsuario)}>
      <TextInput
        withAsterisk
        readOnly={!!usuario}
        label="Nombre de usuario"
        key={form.key('username')}
        {...form.getInputProps('username')}
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
        withAsterisk
        label="Email"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <NumberInput
        hideControls
        label="Nro Teléfono"
        key={form.key('numeroTelefono')}
        {...form.getInputProps('numeroTelefono')}
      />

      {/* Aqui listamos todos los permisos obtenidos en el prop */}
      <Select
        withAsterisk
        allowDeselect
        data={permisos}
        label="Permiso"
        key={form.key('idPermiso')}
        {...form.getInputProps('idPermiso')}
      />

      {usuario?.id && <SelectActivoInactivo
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