'use client'

import { RespuestaDTO } from "@/lib/dto/common.dto"
import { ActionIcon, Text } from "@mantine/core"
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconTrash } from "@tabler/icons-react"

interface Props {
    title: string
    serverAction: () => Promise<RespuestaDTO<any>>
}

export function BotonAnular({ serverAction, title }: Props) {

    function anularRegistro() {
        modals.openConfirmModal({
            title: 'Confirmar',
            centered: true,
            children: (
                <Text size="sm">{title}</Text>
            ),
            labels: { confirm: 'Registrar', cancel: 'Cancelar' },
            onConfirm: async () => {
                const notificationId = notifications.show({
                    loading: true, title: 'Procesando',
                    message: 'Anulando cliente', autoClose: false
                })

                const resp: RespuestaDTO<any> = await serverAction()

                console.log('RESPUESTA: ', resp)

                const texto = resp.ok ? { title: 'Completado', message: 'Se ha anulado exitosamente el cliente' } : { title: 'Error', message: 'No se pudo anular' }
                notifications.update({
                    id: notificationId,
                    ...texto,
                    loading: false,
                    withBorder: true, color: 'green', autoClose: 2000,
                    icon: <IconCheck size={20} />
                })
            }
        })
    }

    return <ActionIcon size="sm" color="red" onClick={() => anularRegistro()}>
        <IconTrash />
    </ActionIcon>
}