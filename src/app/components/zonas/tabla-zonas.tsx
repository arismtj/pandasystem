import { anularZonaAction } from "@/actions/zona.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { FiltroZonaDTO, ZonaDTO } from "@/lib/dto/zona.dto"
import { listarZonasPorFiltro } from "@/server/services/zona.service"
import { ActionIcon, Table, TableScrollContainer, TableTbody, TableTd, TableTh, TableThead, TableTr, Tooltip } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"
import { BotonAnular } from "../boton-anular"

interface Props extends FiltroZonaDTO {

}

export const TABLA_ZONAS_COLS = ['', 'Cod.', 'Nombre', 'Estado']

export default async function TablaZonas(props: Props) {

  const data: ZonaDTO[] = await listarZonasPorFiltro({
    nombre: props.nombre,
    page: props.page || 1,
    rowsPerPage: props.rowsPerPage
  })

  const columnas = TABLA_ZONAS_COLS.map(item => {
    return <TableTh key={'th' + item}>{item}</TableTh>
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
              <Tooltip label="Editar zona">
                <Link href={"/zonas/registro/" + item.id}>
                  <ActionIcon size="sm">
                    <IconEdit />
                  </ActionIcon>
                </Link>
              </Tooltip>
              {item.estado === ESTADO_ACTIVO && <>
                &nbsp;&nbsp;
                <Tooltip label="Anular zona">
                  <BotonAnular
                    title="¿Desea anular la zona?"
                    serverAction={async () => {
                      'use server'
                      return await anularZonaAction(item.id!)
                    }}
                  />
                </Tooltip>
              </>}
            </TableTd>
            <TableTd>{item.id}</TableTd>
            <TableTd miw={150}>{item.nombre}</TableTd>
            <TableTd>{item.estado === ESTADO_ACTIVO ? 'Activo' : 'Inactivo'}</TableTd>
          </TableTr>
        })}
      </TableTbody>
    </Table>
  </TableScrollContainer>
}