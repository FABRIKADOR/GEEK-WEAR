import { Suspense } from "react"
import { getCategories, getFranchises, getProducts } from "@/lib/database"
import { ProductsFilter } from "@/components/products-filter"
import { ProductsGrid } from "@/components/products-grid"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductsPageProps {
  searchParams: {
    q?: string
    category?: string
    franchise?: string
    page?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const limit = 12
  const searchQuery = searchParams.q
  const categoryId = searchParams.category
  const franchiseId = searchParams.franchise

  // Fetch data in parallel
  const [productsData, categories, franchises] = await Promise.all([
    getProducts(limit, page, categoryId, franchiseId, undefined, searchQuery),
    getCategories(),
    getFranchises(),
  ])

  const { data: products, count } = productsData
  const totalPages = Math.ceil(count / limit)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Todos los Productos</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <Suspense fallback={<FilterSkeleton />}>
            <ProductsFilter
              categories={categories}
              franchises={franchises}
              selectedCategory={categoryId}
              selectedFranchise={franchiseId}
              searchQuery={searchQuery}
            />
          </Suspense>
        </div>

        <div className="w-full md:w-3/4">
          <Suspense fallback={<ProductsGridSkeleton />}>
            <ProductsGrid
              products={products}
              currentPage={page}
              totalPages={totalPages}
              searchQuery={searchQuery}
              categoryId={categoryId}
              franchiseId={franchiseId}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function FilterSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <div className="space-y-2 pl-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <div className="space-y-2 pl-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

function ProductsGridSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  )
}
