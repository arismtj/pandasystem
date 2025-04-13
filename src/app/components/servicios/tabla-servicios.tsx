import { anularServicioAction } from "@/actions/servicio.actions"
import { ESTADO_ACTIVO } from "@/lib/constantes"
import { FiltroServicioDTO, ServicioDTO } from "@/lib/dto/servicio.dto"
import { listarServiciosPorFiltro } from "@/server/services/servicio.service"
import { ActionIcon, Table, TableTbody, TableTd, TableTh, TableThead, TableTr, Tooltip } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"
import { BotonAnular } from "../boton-anular"

interface Props extends FiltroServicioDTO {

}

export const TABLA_SERVICIOS_COLS = ['', 'Cod', 'Nombre', 'Tipo', 'Precio', 'Estado']

export default async function TablaClientes(props: Props) {

  const data: ServicioDTO[] = await listarServiciosPorFiltro({
    nombre: props.nombre,
    tipo: props.tipo,
    page: props.page || 1,
    rowsPerPage: props.rowsPerPage
  })

  const columnas = TABLA_SERVICIOS_COLS.map(item => {
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
            <TableTd>{item.nombre}</TableTd>
            <TableTd>{item.tipo}</TableTd>
            <TableTd>{item.precio}</TableTd>
            <TableTd>{item.estado === ESTADO_ACTIVO ? 'Activo' : 'Inactivo'}</TableTd>
          </TableTr>
        })}
      </TableTbody>
    </Table>
  </>
}