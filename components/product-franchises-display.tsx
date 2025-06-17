import { Badge } from "@/components/ui/badge"

interface ProductFranchisesDisplayProps {
  franchises: Array<{
    id: string
    name: string
    slug: string
    type: string
  }>
  className?: string
  showType?: boolean
}

export default function ProductFranchisesDisplay({
  franchises,
  className = "",
  showType = false,
}: ProductFranchisesDisplayProps) {
  if (!franchises || franchises.length === 0) {
    return null
  }

  const getTypeColor = (type: string) => {
    const colors = {
      anime: "bg-pink-100 text-pink-800",
      videogame: "bg-blue-100 text-blue-800",
      comic: "bg-green-100 text-green-800",
      movie: "bg-purple-100 text-purple-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {franchises.map((franchise) => (
        <div key={franchise.id} className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            {franchise.name}
          </Badge>
          {showType && (
            <Badge variant="outline" className={`text-xs ${getTypeColor(franchise.type)}`}>
              {franchise.type}
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}
