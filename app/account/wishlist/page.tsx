"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import { useAuth } from "@/contexts/auth-context"
import type { ProductWithDetails } from "@/types"

interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  products: ProductWithDetails
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      loadWishlistItems(user.id)
    } else {
      setIsLoading(false)
    }
  }, [user])

  const loadWishlistItems = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select(`
          *,
          products (
            *,
            categories(id, name, slug, description),
            images:product_images(*),
            product_franchises(
              franchise_id,
              franchises(id, name, slug)
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading wishlist:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar tu lista de deseos",
          variant: "destructive",
        })
        return
      }

      // Transformar los datos para que coincidan con el tipo esperado
      const transformedItems =
        data?.map((item) => ({
          ...item,
          products: {
            ...item.products,
            category: item.products.categories || null,
            variants: [],
            tags: [],
            franchises: item.products.product_franchises?.map((pf) => pf.franchises) || [],
          } as ProductWithDetails,
        })) || []

      setWishlistItems(transformedItems)
    } catch (error) {
      console.error("Error loading wishlist:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar tu lista de deseos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase.from("wishlist_items").delete().eq("id", itemId)

      if (error) throw error

      setWishlistItems((prev) => prev.filter((item) => item.id !== itemId))
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado de tu lista de deseos",
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto de tu lista de deseos",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h2>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h2>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-muted rounded-full p-3 mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Inicia sesión para ver tu lista de deseos</h3>
              <p className="text-muted-foreground mb-6">Debes iniciar sesión para acceder a tu lista de deseos.</p>
              <Button asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h2>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-muted rounded-full p-3 mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-2">Tu Lista de Deseos está Vacía</h3>
              <p className="text-muted-foreground mb-6">
                Guarda productos que te gusten en tu lista de deseos y aparecerán aquí.
              </p>
              <Button asChild>
                <Link href="/productos">Comenzar a Comprar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mi Lista de Deseos</h2>
      <div className="grid gap-4">
        {wishlistItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {item.products.images && item.products.images.length > 0 ? (
                    <img
                      src={item.products.images[0].url || "/placeholder.svg"}
                      alt={item.products.images[0].alt_text || item.products.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg mb-1 truncate">
                    <Link href={`/product/${item.products.slug}`} className="hover:text-purple-600 transition-colors">
                      {item.products.name}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{item.products.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-purple-600">${item.products.price.toFixed(2)}</span>
                      {item.products.compare_at_price && item.products.compare_at_price > item.products.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${item.products.compare_at_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button asChild size="sm">
                        <Link href={`/product/${item.products.slug}`}>Ver Producto</Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromWishlist(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
