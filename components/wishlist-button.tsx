"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

interface WishlistButtonProps {
  productId: string
}

export function WishlistButton({ productId }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        setUser(data.session.user)
        checkIfInWishlist(data.session.user.id)
      } else {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [productId])

  const checkIfInWishlist = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking wishlist:", error)
      }

      setIsInWishlist(!!data)
      setIsLoading(false)
    } catch (error) {
      console.error("Error checking wishlist:", error)
      setIsLoading(false)
    }
  }

  const toggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión primero",
        description: "Debes iniciar sesión para guardar productos en tu lista de deseos",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    setIsLoading(true)

    try {
      if (isInWishlist) {
        // Eliminar de la lista de deseos
        const { error } = await supabase
          .from("wishlist_items")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId)

        if (error) throw error

        setIsInWishlist(false)
        toast({
          title: "Producto eliminado",
          description: "El producto ha sido eliminado de tu lista de deseos",
        })
      } else {
        // Agregar a la lista de deseos
        const { error } = await supabase.from("wishlist_items").insert({
          user_id: user.id,
          product_id: productId,
        })

        if (error) throw error

        setIsInWishlist(true)
        toast({
          title: "Producto guardado",
          description: "El producto ha sido añadido a tu lista de deseos",
        })
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar tu lista de deseos. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full"
      onClick={toggleWishlist}
      disabled={isLoading}
      aria-label={isInWishlist ? "Eliminar de favoritos" : "Añadir a favoritos"}
    >
      <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"}`} aria-hidden="true" />
    </Button>
  )
}
