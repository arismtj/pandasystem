'use client'

import { signOut } from "next-auth/react"
import { Menu, MenuDropdown, MenuItem, MenuLabel, MenuTarget, Text } from "@mantine/core"
import { modals } from '@mantine/modals'
import { IconChevronRight, IconLogout } from "@tabler/icons-react"

interface Props {

}
export function MenuUsuario({ }: Props) {

  function cerrarSesion(data: any) {
    modals.openConfirmModal({
      title: 'Confirmar',
      centered: true,
      children: (<Text size="sm">¿Desea cerrar la sesión?</Text>),
      labels: { confirm: 'Si', cancel: 'No' },
      onConfirm: () => signOut()
    })
  }

  return <Menu shadow="md" width={200}>
    <MenuTarget>
      <IconChevronRight size={14} stroke={4} />
    </MenuTarget>

    <MenuDropdown>
      <MenuLabel>Sesión</MenuLabel>
      <MenuItem leftSection={<IconLogout size={14} />} onClick={cerrarSesion}>
        Cerrar sesión
      </MenuItem>
    </MenuDropdown>
  </Menu>
}