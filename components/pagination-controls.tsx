"use client"
import { useSearchParams } from "next/navigation"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
}

export function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const searchParams = useSearchParams()

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()

    // Solo agregar parámetros si tienen valores válidos
    if (page > 1) {
      params.set("page", page.toString())
    }

    if (searchParams.get("category")) {
      params.set("category", searchParams.get("category")!)
    }

    if (searchParams.get("franchise")) {
      params.set("franchise", searchParams.get("franchise")!)
    }

    if (searchParams.get("q")) {
      params.set("q", searchParams.get("q")!)
    }

    const queryString = params.toString()
    const currentPath = window.location.pathname

    return queryString ? `${currentPath}?${queryString}` : currentPath
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  return (
    <div className="flex justify-center mt-4">
      {currentPage > 1 && (
        <a href={createPageUrl(currentPage - 1)} className="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300">
          Anterior
        </a>
      )}

      {getPageNumbers().map((page) => (
        <a
          key={page}
          href={createPageUrl(page)}
          className={`px-4 py-2 mx-1 rounded ${
            page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </a>
      ))}

      {currentPage < totalPages && (
        <a href={createPageUrl(currentPage + 1)} className="px-4 py-2 mx-1 bg-gray-200 rounded hover:bg-gray-300">
          Siguiente
        </a>
      )}
    </div>
  )
}
