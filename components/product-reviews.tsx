"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"

interface ProductReviewsProps {
  productId: string
}

interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  title?: string
  content: string
  created_at: string
  profiles?: {
    full_name?: string
    avatar_url?: string
    username?: string
  }
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchReviews()
    checkAuth()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)

      // Obtener reseñas del producto específico con información del usuario
      const { data: reviewsData, error } = await supabase
        .from("product_reviews")
        .select(`
          id,
          user_id,
          product_id,
          rating,
          title,
          content,
          created_at,
          profiles (
            full_name,
            avatar_url,
            username
          )
        `)
        .eq("product_id", productId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching reviews:", error)
        return
      }

      setReviews(reviewsData || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
      }
    } catch (error) {
      console.error("Error checking auth:", error)
    }
  }

  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating })
  }

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión primero",
        description: "Debes iniciar sesión para dejar una reseña",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    if (!newReview.content.trim()) {
      toast({
        title: "Contenido requerido",
        description: "Por favor escribe tu opinión sobre el producto",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("product_reviews").insert({
        user_id: user.id,
        product_id: productId,
        rating: newReview.rating,
        title: newReview.title.trim() || null,
        content: newReview.content.trim(),
        is_approved: true,
      })

      if (error) {
        throw error
      }

      toast({
        title: "¡Gracias por tu reseña!",
        description: "Tu opinión ha sido publicada correctamente",
      })

      // Recargar las reseñas para mostrar la nueva
      await fetchReviews()

      // Limpiar el formulario
      setNewReview({ rating: 5, title: "", content: "" })
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "No se pudo publicar tu reseña. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange?.(star)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
            disabled={!interactive}
          >
            <Star className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
          </button>
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getUserName = (review: Review) => {
    // Prioridad cambiada: username > full_name > "Usuario"
    return review.profiles?.username || review.profiles?.full_name || "Usuario"
  }

  const getUserAvatar = (review: Review) => {
    return review.profiles?.avatar_url || ""
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Reseñas de Clientes</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">Reseñas de Clientes</h2>

        {/* Lista de Reseñas */}
        {reviews.length > 0 ? (
          <div className="space-y-4 mb-8">
            {reviews.map((review) => (
              <Card key={review.id} className="mx-2 sm:mx-0">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-start space-x-2 sm:space-x-4">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                      <AvatarImage src={getUserAvatar(review) || "/placeholder.svg"} alt={getUserName(review)} />
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        {getInitials(getUserName(review))}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="font-medium text-gray-900">{getUserName(review)}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-gray-500">{formatDate(review.created_at)}</span>
                      </div>

                      {review.title && <h4 className="font-semibold text-gray-900">{review.title}</h4>}

                      <p className="text-gray-700">{review.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-8">
            <p className="text-gray-500 text-lg">Este producto aún no tiene reseñas.</p>
            <p className="text-gray-400">¡Sé el primero en compartir tu opinión!</p>
          </div>
        )}

        {/* Formulario para Nueva Reseña - SIEMPRE VISIBLE */}
        <Card className="mx-2 sm:mx-0">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl">Escribir una Reseña</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
              {renderStars(newReview.rating, true, handleRatingChange)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título (opcional)</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Resumen de tu experiencia"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tu Reseña</label>
              <Textarea
                placeholder="Comparte tu experiencia con este producto..."
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                rows={3}
                maxLength={500}
                className="text-sm sm:text-base"
              />
              <p className="text-xs text-gray-500 mt-1">{newReview.content.length}/500 caracteres</p>
            </div>

            <Button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              disabled={!newReview.content.trim() || isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar Reseña"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
