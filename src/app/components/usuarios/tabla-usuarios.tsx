import { FiltroUsuarioDTO, UsuarioDTO } from "@/lib/dto/usuario.dto"
import { listarUsuariosPorFiltro } from "@/server/services/usuario.service"
import { ActionIcon, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Tooltip } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"

interface Props extends FiltroUsuarioDTO {

}

export const TABLA_USUARIOS_COLS = ['', 'Cod', 'Login', 'Nombres', 'Apellidos', 'Email', 'Teléfono', 'Permiso']

export default async function TablaUsuarios(props: Props) {

  const data: UsuarioDTO[] = await listarUsuariosPorFiltro({
    username: props.username,
    nombres: props.nombres,
    apellidos: props.apellidos,
    page: props.page || 1,
    rowsPerPage: props.rowsPerPage
  })

  const columnas = TABLA_USUARIOS_COLS.map(item => {
    return <TableTh key={'th' + item}>{item}</TableTh>
  })

  return <>
    <Table withTableBorder striped>
      <TableThead>
        <TableTr>
          {columnas}
        </TableTr>
      </TableThead>

      <TableTbody>
        {data.map((item, index) => {
          return <TableTr key={`${index}-${item.id || ''}`}>
            <TableTd>
              <Tooltip label="Editar usuario">
                <Link href={"/usuarios/registro/" + item.id}>
                  <ActionIcon size="sm">
                    <IconEdit />
                  </ActionIcon>
                </Link>
              </Tooltip>
            </TableTd>
            <TableTd>{item.id}</TableTd>
            <TableTd>{item.username}</TableTd>
            <TableTd>{item.nombres}</TableTd>
            <TableTd>{item.apellidos}</TableTd>
            <TableTd>{item.email}</TableTd>
            <TableTd>{item.numeroTelefono}</TableTd>
            <TableTd>{item.nombrePermiso}</TableTd>
          </TableTr>
        })}
      </TableTbody>
    </Table>
  </>
}