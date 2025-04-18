import { anularPermisoAction } from "@/actions/permiso.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { FiltroPermisoDTO, PermisoDTO } from "@/lib/dto/permiso.dto"
import { listarPermisosPorFiltro } from "@/server/services/permiso.service"
import { ActionIcon, Table, TableScrollContainer, TableTbody, TableTd, TableTh, TableThead, TableTr, Tooltip } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"
import { BotonAnular } from "../../boton-anular"

interface Props extends FiltroPermisoDTO {

}

export const TABLA_PERMISOS_COLS = ['', 'Cod.', 'Nombre', 'Estado']

export default async function TablaPermisos(props: Props) {

  const data: PermisoDTO[] = await listarPermisosPorFiltro({
    nombre: props.nombre,
    page: props.page || 1,
    rowsPerPage: props.rowsPerPage
  })

  const columnas = TABLA_PERMISOS_COLS.map(item => {
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
              <Tooltip label="Editar permiso">
                <Link href={"/usuarios/permisos/registro/" + item.id}>
                  <ActionIcon size="sm">
                    <IconEdit />
                  </ActionIcon>
                </Link>
              </Tooltip>
              {item.estado === ESTADO_ACTIVO && <>
                &nbsp;&nbsp;
                <Tooltip label="Anular permiso">
                  <BotonAnular
                    title="¿Desea anular el permiso?"
                    serverAction={async () => {
                      'use server'
                      return await anularPermisoAction(item.id!)
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