import { Suspense } from "react"
import ProductList from "./product-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusIcon } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Administración de Productos</h1>
        <Link href="/admin/productos/nuevo">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Cargando productos...</div>}>
        <ProductList />
      </Suspense>
    </div>
  )
}
