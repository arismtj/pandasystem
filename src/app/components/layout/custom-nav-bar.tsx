import classes from '../css/navbar.module.css'

import { auth } from '@/server/auth/auth'
import { listarModulosUsuario } from '@/server/services/usuario.service'
import { Avatar, Group, Text, Title, UnstyledButton } from '@mantine/core'
import { unstable_cache } from 'next/cache'
import { redirect } from 'next/navigation'
import { NavLinksItems } from './nav-bar-shell'
import { MenuUsuario } from './user-menu'

const cachedModulosUsuario = unstable_cache(
  async (idUsuario: number) => await listarModulosUsuario(idUsuario), ['auth-modules']
)

// Este es un server component, ya que se ejecuta en el servidor obtenemos los módulos a los que el usuario tiene permiso
// y lo envia renderizado al cliente
export default async function CustomNavbar() {
  const session = await auth()

  // Si la sesion no existe o no es válida que nos mande al login
  if (!session?.user?.id) {
    redirect('/login')
  }

  const modulosUsuario = await cachedModulosUsuario(+session.user?.id!)


  return (
    <nav className={classes.navbar}>
      <div className="flex-1 px-2">
        <Group className={classes.header} justify="space-between">
          <Title order={3}>Panda Corp</Title>
        </Group>
        <br />
        <NavLinksItems links={[
          { nombre: 'Inicio', url: '/', icono: 'home', id: 0 },
          ...modulosUsuario
        ]} />
      </div>

      <div className={classes.footer}>
        <UnstyledButton className={classes.user}>
          <Group>
            <Avatar color='cyan' radius="xl">{session.user?.nombres.charAt(0)} {session.user?.apellidos.charAt(0)}</Avatar>

            <div className='flex-1'>
              <Text size="sm" fw={800}>{session.user?.nombres} {session.user?.apellidos}</Text>
            </div>

            <MenuUsuario />
          </Group>
        </UnstyledButton>
      </div>
    </nav>
  )
}