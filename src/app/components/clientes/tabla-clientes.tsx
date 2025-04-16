import { anularClienteAction } from "@/actions/cliente.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { ClienteDTO, FiltroClienteDTO } from "@/lib/dto/cliente.dto"
import { listarClientesPorFiltro } from "@/server/services/cliente.service"
import { ActionIcon, Table, TableScrollContainer, TableTbody, TableTd, TableTh, TableThead, TableTr, Tooltip } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"
import { BotonAnular } from "../boton-anular"

interface Props extends FiltroClienteDTO {

}

export const TABLA_CLIENTES_COLS = ['', 'Cod.', 'Nombres', 'Apellidos', 'Dirección', 'Distrito-Prov-Dep', 'Zona', 'Coordenadas', 'Estado']

export default async function TablaClientes(props: Props) {

  const data: ClienteDTO[] = await listarClientesPorFiltro({
    nombres: props.nombres,
    apellidos: props.apellidos,
    idZona: props.idZona,
    page: props.page || 1,
    rowsPerPage: props.rowsPerPage
  })

  const columnas = TABLA_CLIENTES_COLS.map(item => {
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
            <TableTd miw={80} className="sticky-l-col">
              <Tooltip label="Editar cliente">
                <Link href={"/clientes/registro/" + item.id}>
                  <ActionIcon size="sm">
                    <IconEdit />
                  </ActionIcon>
                </Link>
              </Tooltip>
              {item.estado === ESTADO_ACTIVO && <>
                &nbsp;&nbsp;
                <Tooltip label="Anular cliente">
                  <BotonAnular
                    title="¿Desea anular el cliente?"
                    serverAction={async () => {
                      'use server'
                      return await anularClienteAction(item.id!)
                    }}
                  />
                </Tooltip>
              </>}
            </TableTd>
            {/* <TableTd>{item.id}</TableTd> */}
            <TableTd>{item.id}</TableTd>
            <TableTd miw={150}>{item.nombres}</TableTd>
            <TableTd miw={150}>{item.apellidos}</TableTd>
            <TableTd miw={250}>{item.direccion}</TableTd>
            <TableTd miw={240}>{item.distrito} - {item.provincia}-{item.departamento}</TableTd>
            <TableTd miw={200}>{item.nombreZona}</TableTd>
            <TableTd>{item.coordenadas}</TableTd>
            <TableTd>{item.estado === ESTADO_ACTIVO ? 'Activo' : 'Inactivo'}</TableTd>
          </TableTr>
        })}
      </TableTbody>
    </Table>
  </TableScrollContainer>
}