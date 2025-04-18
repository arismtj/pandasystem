'use client'

import { registrarClienteAction } from "@/actions/cliente.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { ClienteDTO, ClienteSchemaDTO } from "@/lib/dto/cliente.dto"
import { SelectDTO } from "@/lib/dto/common.dto"
import { Button, CloseButton, Flex, Grid, GridCol, Image, LoadingOverlay, Select, SimpleGrid, StyleProp, Text, TextInput } from "@mantine/core"
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { useForm, yupResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useRouter } from "next/navigation"
import { useState } from "react"
import { SelectActivoInactivo } from "../custom-selects"

import '@mantine/dropzone/styles.css'

interface Props {
  cliente: ClienteDTO | null,
  zonas: SelectDTO[] // Esta lista de permisos la usaremos en el select de zonas
}

export function FormularioRegistroCliente({ cliente, zonas }: Props) {
  const { back } = useRouter()
  const [isPending, setIsPending] = useState(false) // estado para mostrar un loading
  const [fotoFachada, setFotoFachada] = useState<FileWithPath | null>(null)

  const gridSpan: StyleProp<number> = { sm: 6 }

  const form = useForm<ClienteDTO>({
    initialValues: {
      id: cliente?.id,
      nombres: cliente?.nombres || '',
      apellidos: cliente?.apellidos || '',
      dni: cliente?.dni || '',
      celular: cliente?.celular || '',
      // @ts-expect-error Lo ignoramos al crear uno nuevo
      idZona: cliente?.idZona.toString(),
      direccion: cliente?.direccion || '',
      departamento: cliente?.departamento || '',
      provincia: cliente?.provincia || '',
      distrito: cliente?.distrito || '',
      referencia: cliente?.referencia || '',
      fachada: cliente?.fachada || '',
      coordenadas: cliente?.coordenadas || '',
      estado: cliente?.estado || ESTADO_ACTIVO,
    },
    validate: yupResolver(ClienteSchemaDTO)
  })

  function previsualizacion(): React.ReactNode {

    if (fotoFachada) {
      const imageUrl = URL.createObjectURL(fotoFachada)
      return <div className="mt-1">
        <CloseButton className="float-end" onClick={() => asignarFotoFachada(null)} />
        <Image
          key={cliente?.id + 'fachadaSelect'}
          src={imageUrl}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
      </div>
    }

    if (cliente?.fachada) {
      const imageUrl = `/api/descargar-archivo/${cliente.fachada}`
      return <Image
        key={cliente.id + 'fachada'}
        src={imageUrl}
      />
    }

    return <></>
  }

  function asignarFotoFachada(files: FileWithPath[] | null) {
    // si la lista de archivos es null o está vacia, asignamos null
    const img = files && files.length > 0 ? files[0] : null

    form.setFieldValue('fachada', img?.name || cliente?.fachada || '')

    setFotoFachada(img)
  }

  function onCancelar() {
    back()
  }

  function onSubmitCliente(data: any) {
    modals.openConfirmModal({
      title: 'Confirmar',
      centered: true,
      children: (<Text size="sm">¿Desea registrar el cliente?</Text>),
      labels: { confirm: 'Registrar', cancel: 'Cancelar' },
      onConfirm: async () => {
        setIsPending(true)
        const resp = await registrarClienteAction(data, fotoFachada)
        if (resp?.ok) {
          notifications.show({
            title: 'Completado',
            withBorder: true,
            color: 'green',
            message: 'Se ha registrado exitosamente el cliente'
          })
          back()
        } else {
          notifications.show({
            title: 'Error', withBorder: true, color: 'red', message: resp?.error
          })
        }
        setIsPending(false)
      }
    })
  }

  return <>
    <LoadingOverlay visible={isPending} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />

    <form onSubmit={form.onSubmit(onSubmitCliente)}>

      <Grid>
        <GridCol span={gridSpan}>
          <TextInput
            withAsterisk
            label="Nombres"
            key={form.key('nombres')}
            {...form.getInputProps('nombres')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <TextInput
            withAsterisk
            label="Apellidos"
            key={form.key('apellidos')}
            {...form.getInputProps('apellidos')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <TextInput
            withAsterisk
            label="Nro DNI"
            maxLength={8}
            key={form.key('dni')}
            {...form.getInputProps('dni')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <TextInput
            label="Nro Teléfono"
            key={form.key('celular')}
            {...form.getInputProps('celular')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          {/* Aqui listamos todos los permisos obtenidos en el prop */}
          <Select
            withAsterisk
            allowDeselect
            data={zonas}
            label="Zona"
            key={form.key('idZona')}
            {...form.getInputProps('idZona')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <TextInput
            withAsterisk
            label="Direccion"
            key={form.key('direccion')}
            {...form.getInputProps('direccion')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <TextInput
            withAsterisk
            label="Departamento"
            key={form.key('departamento')}
            {...form.getInputProps('departamento')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <TextInput
            withAsterisk
            label="Provincia"
            key={form.key('provincia')}
            {...form.getInputProps('provincia')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <TextInput
            withAsterisk
            label="Distrito"
            key={form.key('distrito')}
            {...form.getInputProps('distrito')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <TextInput
            label="Referencia"
            key={form.key('referencia')}
            {...form.getInputProps('referencia')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          <TextInput
            withAsterisk
            label="Coordenadas"
            key={form.key('coordenadas')}
            {...form.getInputProps('coordenadas')}
          />
        </GridCol>

        <GridCol span={gridSpan}>
          {cliente?.id && <SelectActivoInactivo
            withAsterisk
            label="Estado"
            {...form.getInputProps('estado')}
          />}
        </GridCol>
      </Grid>
      <br />
      <div>
        <Dropzone accept={IMAGE_MIME_TYPE} maxFiles={1} onDrop={asignarFotoFachada} {...form.getInputProps('fachada')}>
          <Text ta="center">Seleccionar/Arrastrar imagen de la fachada aqui</Text>
        </Dropzone>
        <TextInput
          hidden
          key={form.key('fachada')}
          {...form.getInputProps('fachada')}
        />

        <SimpleGrid cols={{ base: 1, sm: 4 }}>
          {previsualizacion()}
        </SimpleGrid>
      </div>
      <br />
      <Flex direction={"row"} gap="md">
        <Button type="submit">Registrar</Button>

        <Button color="orange" onClick={onCancelar}>Cancelar</Button>
      </Flex>
    </form>
  </>

}