import { anularTipoServicioAction } from "@/actions/tiposervicio.actions"
import { ESTADO_ACTIVO, MAP_FRECUENCIA } from "@/lib/constantes"
import { FiltroTipoServicioDTO, TipoServicioDTO } from "@/lib/dto/tiposervicio.dto"
import { listarTipoServiciosPorFiltro } from "@/server/services/tiposervicio.service"
import { ActionIcon, Table, TableScrollContainer, TableTbody, TableTd, TableTh, TableThead, TableTr, Tooltip } from "@mantine/core"
import { IconEdit } from "@tabler/icons-react"
import Link from "next/link"
import { BotonAnular } from "../../boton-anular"

interface Props extends FiltroTipoServicioDTO {

}

export const TABLA_PERMISOS_COLS = ['', 'Cod.', 'Nombre', 'Frecuencia', 'Precio Unitario', 'Estado']

export default async function TablaTiposServicio(props: Props) {

  const data: TipoServicioDTO[] = await listarTipoServiciosPorFiltro({
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
              <Tooltip label="Editar tipo de servicio">
                <Link href={"/servicios/tipos-servicio/registro/" + item.id}>
                  <ActionIcon size="sm">
                    <IconEdit />
                  </ActionIcon>
                </Link>
              </Tooltip>
              {item.estado === ESTADO_ACTIVO && <>
                &nbsp;&nbsp;
                <Tooltip label="Anular tipo de servicio">
                  <BotonAnular
                    title="¿Desea anular el tipo de servicio?"
                    serverAction={async () => {
                      'use server'
                      return await anularTipoServicioAction(item.id!)
                    }}
                  />
                </Tooltip>
              </>}
            </TableTd>
            <TableTd>{item.id}</TableTd>
            <TableTd miw={150}>{item.nombre}</TableTd>

            {/* @ts-expect-error */}
            <TableTd miw={150}>{MAP_FRECUENCIA[item.frecuencia]}</TableTd>

            <TableTd miw={150}>{item.precioUnitario}</TableTd>
            <TableTd>{item.estado === ESTADO_ACTIVO ? 'Activo' : 'Inactivo'}</TableTd>
          </TableTr>
        })}
      </TableTbody>
    </Table>
  </TableScrollContainer>
}