import { getProducts } from "@/lib/database"
import { PaginationControls } from "@/components/pagination-controls"
import ProductCard from "@/components/product-card"

interface ProductsGridProps {
  page: number
  limit: number
  categoryId?: string
  franchiseId?: string
  searchQuery?: string
}

export async function ProductsGrid({ page, limit, categoryId, franchiseId, searchQuery }: ProductsGridProps) {
  console.log("ProductsGrid rendering with:", { page, limit, categoryId, franchiseId, searchQuery })

  try {
    const { data: products, count } = await getProducts(limit, page, categoryId, franchiseId, undefined, searchQuery)
    console.log(`Fetched ${products.length} products out of ${count}`)

    const totalPages = Math.ceil(count / limit)

    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No products found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your filters or search term</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-500">
            <p>Debug info:</p>
            <p>Category ID: {categoryId || "none"}</p>
            <p>Franchise ID: {franchiseId || "none"}</p>
            <p>Search Query: {searchQuery || "none"}</p>
            <p>
              Page: {page}, Limit: {limit}
            </p>
          </div>
        </div>
      )
    }

    return (
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8">
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/products"
              categoryId={categoryId}
              franchiseId={franchiseId}
              searchQuery={searchQuery}
            />
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error rendering ProductsGrid:", error)
    return (
      <div className="text-center py-12 text-red-500">
        <h3 className="text-lg font-medium">Error loading products</h3>
        <p className="mt-2">There was an error loading the products. Please try again later.</p>
        <pre className="mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-500 overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }
}

// Exportación por defecto para resolver el error
export default ProductsGrid
