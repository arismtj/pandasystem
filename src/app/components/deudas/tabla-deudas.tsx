import { anularZonaAction } from "@/actions/zona.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { DeudaDTO, FiltroDeudaDTO } from "@/lib/dto/deuda.dto"
import { HeaderTabla } from "@/lib/types.ui"
import { listarDeudasPorFiltro } from "@/server/services/deuda.service"
import { ActionIcon, Table, TableScrollContainer, TableTbody, TableTd, TableTh, TableThead, TableTr, Tooltip } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"
import { BotonAnular } from "../boton-anular"

interface Props extends FiltroDeudaDTO {

}

const COLUMNAS_TABLA: HeaderTabla[] = [
  { label: '' },
  { label: 'Servicio' },
  { label: 'Cliente' },
  { label: 'Monto', className: 'text-center' },
  { label: 'Fecha límite' },
  { label: 'Estado' },
]

export const TABLA_DEUDAS_COLS = COLUMNAS_TABLA.map(item => item.label)

export default async function TablaDeudas(props: Props) {

  const data: DeudaDTO[] = await listarDeudasPorFiltro({
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
              {item.estado === ESTADO_ACTIVO && <>
                <Tooltip label="Registrar pago">
                  <ActionIcon size="sm">
                    <IconEdit />
                  </ActionIcon>
                </Tooltip>
              </>}
            </TableTd>
            <TableTd miw={150}>{item.nombreTipoServicio}</TableTd>
            <TableTd miw={150}>{item.nombreCliente}</TableTd>
            <TableTd miw={150} className="text-center">{item.monto}</TableTd>
            <TableTd miw={150}>{item.fechaLimite.toLocaleDateString()}</TableTd>
            <TableTd>{item.estado === ESTADO_ACTIVO ? 'Activo' : 'Inactivo'}</TableTd>
          </TableTr>
        })}
      </TableTbody>
    </Table>
  </TableScrollContainer>
}