import { anularServicioAction } from "@/actions/servicio.actions"
import { ESTADO_ACTIVO, SELECT_FRECUENCIA } from "@/lib/constantes"
import { FiltroServicioDTO, ServicioDTO } from "@/lib/dto/servicio.dto"
import { listarServiciosPorFiltro } from "@/server/services/servicio.service"
import { ActionIcon, Table, TableScrollContainer, TableTbody, TableTd, TableTh, TableThead, TableTr, Tooltip } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"
import { BotonAnular } from "../boton-anular"
import { selectDtoArrayToMap } from "@/lib/utils"
import { HeaderTabla } from "@/lib/types.ui"

interface Props extends FiltroServicioDTO {

}

const COLUMNAS_TABLA: HeaderTabla[] = [
  { label: '' },
  { label: 'Cod' },
  { label: 'Cliente' },
  { label: 'Dirección' },
  { label: 'Tipo de servicio' },
  { label: 'Frecuencia' },
  { label: 'Monto', className: 'text-center' },
  { label: 'Fecha inicio' },
  { label: 'Ultimo pago' },
  { label: 'Estado' }
]

export const TABLA_SERVICIOS_COLS = COLUMNAS_TABLA.map(item => item.label)

export default async function TablaClientes(props: Props) {

  const mapFrecuencias = selectDtoArrayToMap(SELECT_FRECUENCIA)

  const data: ServicioDTO[] = await listarServiciosPorFiltro({
    nombre: props.nombre,
    page: props.page || 1,
    rowsPerPage: props.rowsPerPage
  })

  const columnas = COLUMNAS_TABLA.map(item => {
    return <TableTh key={'th' + item.label} className={item.className}>
      {item.label}
    </TableTh>
  })

  return <TableScrollContainer minWidth={900}>
    <Table withTableBorder striped>
      <TableThead>
        <TableTr>
          {columnas}
        </TableTr>
      </TableThead>

      <TableTbody>
        {data.map((item, index) => {
          return <TableTr key={`${index}-${item.id || ''}`}>
            <TableTd miw={80} width={80}>
              <Tooltip label="Editar usuario">
                <Link href={"/servicios/registro/" + item.id}>
                  <ActionIcon size="sm">
                    <IconEdit />
                  </ActionIcon>
                </Link>
              </Tooltip>

              {item.estado === ESTADO_ACTIVO && <>
                &nbsp;&nbsp;
                <Tooltip label="Anular servicio">
                  <BotonAnular
                    title="¿Desea anular el servicio?"
                    serverAction={async () => {
                      'use server'
                      return await anularServicioAction(item.id!)
                    }}
                  />
                </Tooltip>
              </>}
            </TableTd>
            <TableTd>{item.id}</TableTd>
            <TableTd miw={200}>{item.nombreCliente}</TableTd>
            <TableTd miw={250}>{item.direccionCliente}</TableTd>
            <TableTd miw={180}>{item.nombreTipoServicio}</TableTd>

            {/* @ts-expect-error */}
            <TableTd miw={150}>{mapFrecuencias.get(item.frecuenciaServicio)}</TableTd>
            <TableTd miw={100} className="text-center">{item.precioUnidad}</TableTd>
            <TableTd miw={120}>{item.fechaInicio.toLocaleDateString()}</TableTd>
            <TableTd miw={120}>{item.ultimoPago?.toLocaleDateString()}</TableTd>
            <TableTd>{item.estado === ESTADO_ACTIVO ? 'Activo' : 'Inactivo'}</TableTd>
          </TableTr>
        })}
      </TableTbody>
    </Table>
  </TableScrollContainer>
}