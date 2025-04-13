"use client"

import { Modulo } from "@/db/schemas/permiso"
import { AppShell, Burger, Group } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { getDynamicIcon, TIconType } from "../async-icon"
import classes from '../css/navbar.module.css'
import { useMemo } from "react"

interface NavbarShellProps {
  children: React.ReactNode
  navbarChild: React.ReactNode
}

export function NavBarShell({ children, navbarChild }: NavbarShellProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          {/* <MantineLogo size={30} /> */}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        {navbarChild}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>

      {/* <AppShell.Footer p="md">Footer</AppShell.Footer> */}
    </AppShell>
  )
}

interface NavLinksItemsProps {
  links: Modulo[]
}

export function NavLinksItems({ links }: NavLinksItemsProps) {
  const currentPath = usePathname()

  return (
    links.map((item) => {

      const Icon = useMemo(() => getDynamicIcon(item.icono as TIconType), [item.icono])
      return <Link
        className={classes.link}
        data-active={item.url === currentPath || undefined}
        href={item.url}
        key={item.nombre}
      >
        <Icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.nombre}</span>
      </Link>
    })
  )
}