import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminCheck } from "@/components/admin-check"
import { getProducts } from "@/lib/database"

export const metadata = {
  title: "Administrar Productos - Admin - GeekWear",
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const page = typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1
  const limit = 10

  const { data: products, count } = await getProducts(limit, page)
  const totalPages = Math.ceil(count / limit)

  return (
    <AdminCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Administrar Productos</h1>
          <Button asChild>
            <Link href="/admin/products/create">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Producto
            </Link>
          </Button>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Producto</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Categoría</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Precio</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-md">
                          <Image
                            src={
                              product.images[0]?.url ||
                              `/placeholder.svg?height=40&width=40&text=${encodeURIComponent(product.name.charAt(0)) || "/placeholder.svg"}`
                            }
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.variants.length} variantes</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.category.name}</td>
                    <td className="px-4 py-3 text-sm">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          product.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" asChild>
                          <Link href={`/admin/products/edit/${product.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={`/admin/products?page=${i + 1}`}
                  className={`px-3 py-1 rounded-md text-sm ${
                    page === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </AdminCheck>
  )
}
