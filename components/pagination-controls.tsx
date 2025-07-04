"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  categoryId?: string
  franchiseId?: string
  searchQuery?: string
}

export function PaginationControls({
  currentPage,
  totalPages,
  baseUrl,
  categoryId,
  franchiseId,
  searchQuery,
}: PaginationControlsProps) {
  // Build the URL with all parameters
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()

    params.set("page", page.toString())

    if (categoryId) {
      params.set("category", categoryId)
    }

    if (franchiseId) {
      params.set("franchise", franchiseId)
    }

    if (searchQuery) {
      params.set("q", searchQuery)
    }

    return `${baseUrl}?${params.toString()}`
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []

    // Always include first page
    pageNumbers.push(1)

    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pageNumbers.push(i)
    }

    // Always include last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }

    // Add ellipsis indicators
    const result = []
    let prevPage = 0

    for (const page of pageNumbers) {
      if (page - prevPage > 1) {
        result.push(-prevPage) // Negative numbers represent ellipsis after this page
      }
      result.push(page)
      prevPage = page
    }

    return result
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="outline" size="icon" disabled={currentPage === 1} asChild={currentPage !== 1}>
        {currentPage === 1 ? (
          <span>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </span>
        ) : (
          <Link href={buildUrl(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Link>
        )}
      </Button>

      {pageNumbers.map((page, index) => {
        // Ellipsis
        if (page < 0) {
          return (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          )
        }

        // Regular page
        return (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            asChild={page !== currentPage}
          >
            {page === currentPage ? <span>{page}</span> : <Link href={buildUrl(page)}>{page}</Link>}
          </Button>
        )
      })}

      <Button variant="outline" size="icon" disabled={currentPage === totalPages} asChild={currentPage !== totalPages}>
        {currentPage === totalPages ? (
          <span>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </span>
        ) : (
          <Link href={buildUrl(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Link>
        )}
      </Button>
    </div>
  )
}
