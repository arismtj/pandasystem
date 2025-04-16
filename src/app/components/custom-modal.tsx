'use client'

import { MantineSize, Modal } from "@mantine/core"

interface Props {
  children: React.ReactNode
  onClose?: () => void
  title?: string
  size?: MantineSize | number
}

export function OpenedModal({ children, onClose, ...props }: Props) {
  return (
    <Modal
      opened
      size={props.size}
      centered
      title={props.title}
      onClose={() => onClose?.()}>
      {children}
    </Modal>
  )
}