import {
  IconFileUnknown,
  IconLoader2,
  dynamicImports,
} from '@tabler/icons-react'
import dynamic from 'next/dynamic'

const LoadingIcon = () => (
  <IconLoader2 className="animate-pulse" aria-label="Icon is loading..." />
)

export type TIconType = keyof typeof dynamicImports.default

export const getDynamicIcon = (icon: TIconType) => {
  const Icon = dynamic(
    async () => {
      try {
        const componentImport = await dynamicImports.default[icon]()

        if (!componentImport) {
          return IconFileUnknown
        }

        return componentImport.default
      } catch (error) {
        return IconFileUnknown
      }
    },
    {
      loading: LoadingIcon,
    }
  )

  return Icon
}