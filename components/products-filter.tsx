"use client"

import type React from "react"

import { useState, useTransition, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { Category, Franchise } from "@/types"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductsFilterProps {
  categories: Category[]
  franchises: Franchise[]
  selectedCategory?: string
  selectedFranchise?: string
  searchQuery?: string
}

export function ProductsFilter({
  categories,
  franchises,
  selectedCategory,
  selectedFranchise,
  searchQuery,
}: ProductsFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchQuery || "")
  const [categoryId, setCategoryId] = useState<string | undefined>(selectedCategory)
  const [franchiseId, setFranchiseId] = useState<string | undefined>(selectedFranchise)
  const [isLoading, setIsLoading] = useState(false)

  // Debugging
  useEffect(() => {
    console.log("ProductsFilter initialized with:", {
      selectedCategory,
      selectedFranchise,
      searchQuery,
      categories: categories.map((c) => ({ id: c.id, name: c.name })),
      franchises: franchises.map((f) => ({ id: f.id, name: f.name })),
    })
  }, [selectedCategory, selectedFranchise, searchQuery, categories, franchises])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const handleCategoryChange = (id: string) => {
    console.log("Category selected:", id)
    setCategoryId(categoryId === id ? undefined : id)
  }

  const handleFranchiseChange = (id: string) => {
    console.log("Franchise selected:", id)
    setFranchiseId(franchiseId === id ? undefined : id)
  }

  const applyFilters = () => {
    setIsLoading(true)
    console.log("Applying filters:", { search, categoryId, franchiseId })

    const params = new URLSearchParams()

    // Solo agregar parámetros válidos
    if (search?.trim()) {
      params.set("q", search.trim())
    }

    if (categoryId) {
      params.set("category", categoryId)
    }

    if (franchiseId) {
      params.set("franchise", franchiseId)
    }

    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname

    console.log("Navigating to:", url)

    startTransition(() => {
      router.push(url)
      setIsLoading(false)
    })
  }

  const clearFilters = () => {
    setSearch("")
    setCategoryId(undefined)
    setFranchiseId(undefined)
    setIsLoading(true)

    startTransition(() => {
      router.push(pathname)
      setIsLoading(false)
    })
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearchSubmit} className="space-y-2">
        <Label htmlFor="search">Buscar</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="search"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </form>

      <Accordion type="multiple" defaultValue={["categories", "franchises"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categorías</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.length === 0 ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={categoryId === category.id}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                      {category.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="franchises">
          <AccordionTrigger>Franquicias</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {franchises.length === 0 ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : (
                franchises.map((franchise) => (
                  <div key={franchise.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`franchise-${franchise.id}`}
                      checked={franchiseId === franchise.id}
                      onCheckedChange={() => handleFranchiseChange(franchise.id)}
                    />
                    <Label htmlFor={`franchise-${franchise.id}`} className="text-sm cursor-pointer">
                      {franchise.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col space-y-2">
        <Button onClick={applyFilters} disabled={isPending || isLoading}>
          {isPending || isLoading ? "Aplicando..." : "Aplicar Filtros"}
        </Button>
        <Button variant="outline" onClick={clearFilters} disabled={isPending || isLoading}>
          Limpiar Filtros
        </Button>
      </div>
    </div>
  )
}
