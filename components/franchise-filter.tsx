"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { franchiseService } from "@/services/franchise-service"

export default function FranchiseFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [franchises, setFranchises] = useState([])
  const [selectedFranchises, setSelectedFranchises] = useState<string[]>([])

  useEffect(() => {
    const loadFranchises = async () => {
      try {
        const data = await franchiseService.getFranchises()
        setFranchises(data)
      } catch (error) {
        console.error("Error al cargar franquicias:", error)
      }
    }
    loadFranchises()
  }, [])

  useEffect(() => {
    const franchiseParams = searchParams.get("franchises")
    if (franchiseParams) {
      setSelectedFranchises(franchiseParams.split(","))
    }
  }, [searchParams])

  const toggleFranchise = (franchiseId: string) => {
    const newSelected = selectedFranchises.includes(franchiseId)
      ? selectedFranchises.filter((id) => id !== franchiseId)
      : [...selectedFranchises, franchiseId]

    setSelectedFranchises(newSelected)

    const params = new URLSearchParams(searchParams.toString())
    if (newSelected.length > 0) {
      params.set("franchises", newSelected.join(","))
    } else {
      params.delete("franchises")
    }

    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedFranchises([])
    const params = new URLSearchParams(searchParams.toString())
    params.delete("franchises")
    router.push(`?${params.toString()}`)
  }

  const franchisesByType = franchises.reduce((acc, franchise) => {
    if (!acc[franchise.type]) {
      acc[franchise.type] = []
    }
    acc[franchise.type].push(franchise)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filtrar por Franquicia</h3>
        {selectedFranchises.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      {/* Mostrar franquicias seleccionadas */}
      {selectedFranchises.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFranchises.map((franchiseId) => {
            const franchise = franchises.find((f) => f.id === franchiseId)
            return franchise ? (
              <Badge
                key={franchiseId}
                variant="default"
                className="cursor-pointer"
                onClick={() => toggleFranchise(franchiseId)}
              >
                {franchise.name}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ) : null
          })}
        </div>
      )}

      {/* Filtros por tipo */}
      {Object.entries(franchisesByType).map(([type, typeFranchises]) => (
        <div key={type} className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 capitalize">
            {type === "videogame"
              ? "Videojuegos"
              : type === "anime"
                ? "Anime"
                : type === "comic"
                  ? "Cómics"
                  : "Películas"}
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {typeFranchises.map((franchise) => (
              <Button
                key={franchise.id}
                variant={selectedFranchises.includes(franchise.id) ? "default" : "outline"}
                size="sm"
                className="justify-start text-xs h-8"
                onClick={() => toggleFranchise(franchise.id)}
              >
                {franchise.name}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
