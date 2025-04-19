'use client'

import { DatesProvider } from "@mantine/dates"

import 'dayjs/locale/es'

interface Props {
  children: React.ReactNode
}

export default function MantineDateProvider({ children }: Props) {
  return <DatesProvider settings={{ locale: 'es' }}>
    {children}
  </DatesProvider>
}