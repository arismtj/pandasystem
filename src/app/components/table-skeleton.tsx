import { Skeleton, Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from "@mantine/core"

interface TableSkeletonProps {
  rows?: number
  columns?: number | string[]
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
}: TableSkeletonProps) {

  const columnas = () => {
    if (typeof columns === 'number') {
      return Array.from({ length: columns }).map((_, index) => {
        return <TableTh key={'skhead' + index}>
          <Skeleton height={25} />
        </TableTh>
      })
    }

    return columns.map(item => {
      return <TableTh key={'skhead' + item}>{item}</TableTh>
    })
  }

  const filas = Array.from({ length: typeof columns === 'number' ? columns : columns.length }).map((_, index) => {
    return <TableTd key={'skitem' + index}>
      <Skeleton height={30} />
    </TableTd>
  })

  return (
    <Table withTableBorder striped>
      <TableThead>
        <TableTr>
          {columnas()}
        </TableTr>
      </TableThead>


      <TableTbody>
        {Array.from({ length: rows }).map((_, index) => {
          return <TableTr key={'skbody' + index}>
            {filas}
          </TableTr>
        })}
      </TableTbody>
    </Table>
  )
}

