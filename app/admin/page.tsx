import Link from "next/link"
import { redirect } from "next/navigation"
import { ShoppingBag, Package, Users, Tag, BarChart, Zap } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { AdminCheck } from "@/components/admin-check"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Panel de Administración - GeekWear",
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <AdminCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Productos</CardTitle>
              <CardDescription>Gestiona tu catálogo de productos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <ShoppingBag className="h-8 w-8 text-primary" />
                <Button asChild>
                  <Link href="/admin/productos">Gestionar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pedidos</CardTitle>
              <CardDescription>Ver y gestionar pedidos de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Package className="h-8 w-8 text-primary" />
                <Button asChild>
                  <Link href="/admin/orders">Gestionar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Clientes</CardTitle>
              <CardDescription>Gestionar cuentas de clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Users className="h-8 w-8 text-primary" />
                <Button asChild>
                  <Link href="/admin/customers">Gestionar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Categorías</CardTitle>
              <CardDescription>Gestionar categorías de productos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Tag className="h-8 w-8 text-primary" />
                <Button asChild>
                  <Link href="/admin/categorias">Gestionar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Franquicias</CardTitle>
              <CardDescription>Gestionar franquicias y marcas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Zap className="h-8 w-8 text-primary" />
                <Button asChild>
                  <Link href="/admin/franquicias">Gestionar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Estadísticas</CardTitle>
              <CardDescription>Ver el rendimiento de tu tienda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <BarChart className="h-8 w-8 text-primary" />
                <Button asChild>
                  <Link href="/admin/estadisticas">Ver</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminCheck>
  )
}
