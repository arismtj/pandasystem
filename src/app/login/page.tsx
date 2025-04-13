"use client"

import { loginAction } from '@/actions/login.actions';
import { Button, Notification, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { useActionState } from 'react';

export default function LoginPage() {
  const [errorMsg, formAction, isPending] = useActionState(loginAction, undefined)

  const xIcon = <IconX size={20} />

  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='w-[420px]'>
        <Title ta="center" className='font-black'>
          ¡Bienvenido de nuevo!
        </Title>

        <Paper withBorder shadow="md" p={30} mt={10} radius="md">
          <form action={formAction}>
            <TextInput name='username' label="Nombre de usuario" placeholder="Usuario" required />
            <PasswordInput name="password" label="Contraseña" placeholder="Tu contraseña" required mt="md" />

            <Button fullWidth mt="xl" type='submit' loading={isPending}>Ingresar</Button>
          </form>
        </Paper>
        {
          errorMsg && <>
            <br />
            <Notification icon={xIcon} color="red" withBorder className='border-red-200'>
              {errorMsg}
            </Notification>
          </>
        }
      </div>
    </div>
  )
}