import { Skeleton } from "@mantine/core"
import CustomNavbar from "../components/layout/custom-nav-bar"
import { NavBarShell } from "../components/layout/nav-bar-shell"
import { Suspense } from "react"


function NavbarSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-blue-600 p-2">
      <Skeleton height={60} mb="xl" style={{ opacity: '20%' }} />

      <Skeleton height={40} mb="sm" style={{ opacity: '20%' }} />
      <Skeleton height={40} mb="sm" style={{ opacity: '20%' }} />
      <Skeleton height={40} mb="sm" style={{ opacity: '20%' }} />
      <Skeleton height={40} mb="sm" style={{ opacity: '20%' }} />

      <Skeleton height={70} mb="sm" style={{ opacity: '20%', marginTop: 'auto' }} />
    </div>
  )
}

interface Props {
  children: React.ReactNode
  modal: React.ReactNode
}

export default async function DashboardLayout({ children, modal }: Readonly<Props>) {
  return (
    <NavBarShell navbarChild={
      <Suspense fallback={<NavbarSkeleton />}>
        <CustomNavbar />
      </Suspense>}
    >
      {children}
      {modal}
    </NavBarShell>
  )
}