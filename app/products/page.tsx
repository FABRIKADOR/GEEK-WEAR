import { Suspense } from "react"
import { getProducts, getVisibleCategories, getFranchises } from "@/lib/database"
import { ProductsGrid } from "@/components/products-grid"
import { ProductsFilter } from "@/components/products-filter"
import { PaginationControls } from "@/components/pagination-controls"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductsPageProps {
  searchParams: {
    page?: string
    category?: string
    franchise?: string
    q?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = Number(searchParams.page) || 1
  const limit = 12
  const categoryId = searchParams.category
  const franchiseId = searchParams.franchise
  const searchQuery = searchParams.q

  // Obtener datos en paralelo
  const [productsResult, categories, franchises] = await Promise.all([
    getProducts(limit, page, categoryId, franchiseId, undefined, searchQuery),
    getVisibleCategories(), // Solo categorías visibles
    getFranchises(),
  ])

  const { data: products, count } = productsResult
  const totalPages = Math.ceil(count / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <p className="text-muted-foreground">Discover our complete collection of gaming and anime products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              }
            >
              <ProductsFilter
                categories={categories}
                franchises={franchises}
                selectedCategory={categoryId}
                selectedFranchise={franchiseId}
                searchQuery={searchQuery}
              />
            </Suspense>
          </div>
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {products.length} of {count} products
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-96 w-full" />
                ))}
              </div>
            }
          >
            <ProductsGrid products={products} />
          </Suspense>

          {totalPages > 1 && (
            <div className="mt-8">
              <PaginationControls currentPage={page} totalPages={totalPages} searchParams={searchParams} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
