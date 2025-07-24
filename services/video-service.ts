import { supabase } from "@/lib/supabase-client"

export interface VideoProgress {
  id?: string
  user_id: string
  video_url: string
  video_title: string
  current_time: number
  duration: number
  completed: boolean
  last_watched_at: string
  created_at?: string
  updated_at?: string
}

export interface VideoData {
  url: string
  title: string
  description: string
  thumbnail?: string
}

export const videoService = {
  // Obtener progreso de video para un usuario
  async getVideoProgress(userId: string, videoUrl: string): Promise<VideoProgress | null> {
    try {
      if (!userId || !videoUrl) {
        console.error("Missing userId or videoUrl")
        return null
      }

      const { data, error } = await supabase
        .from("video_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("video_url", videoUrl)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // No rows found - esto es normal para videos no vistos
          console.log("No progress found for video:", videoUrl)
          return null
        }
        console.error("Error fetching video progress:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error fetching video progress:", error)
      return null
    }
  },

  // Obtener todos los progresos de video de un usuario
  async getUserVideoProgress(userId: string): Promise<VideoProgress[]> {
    try {
      if (!userId) {
        console.error("Missing userId")
        return []
      }

      const { data, error } = await supabase
        .from("video_progress")
        .select("*")
        .eq("user_id", userId)
        .order("last_watched_at", { ascending: false })

      if (error) {
        console.error("Error fetching user video progress:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Unexpected error fetching user video progress:", error)
      return []
    }
  },

  // Actualizar progreso de video
  async updateVideoProgress(progress: Partial<VideoProgress>): Promise<VideoProgress | null> {
    try {
      if (!progress.user_id || !progress.video_url || !progress.video_title) {
        console.error("Missing required fields for video progress update")
        return null
      }

      // Validar números
      const currentTime = Number(progress.current_time) || 0
      const duration = Number(progress.duration) || 0

      if (duration <= 0) {
        console.error("Invalid duration for video progress")
        return null
      }

      // Determinar si está completado
      const completed = progress.completed || currentTime >= duration * 0.95

      const { data, error } = await supabase
        .from("video_progress")
        .upsert(
          {
            user_id: progress.user_id,
            video_url: progress.video_url,
            video_title: progress.video_title,
            current_time: currentTime,
            duration: duration,
            completed: completed,
            last_watched_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,video_url",
          },
        )
        .select()
        .single()

      if (error) {
        console.error("Error updating video progress:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Unexpected error updating video progress:", error)
      return null
    }
  },

  // Marcar video como completado
  async markVideoCompleted(userId: string, videoUrl: string, videoTitle: string, duration: number): Promise<boolean> {
    try {
      if (!userId || !videoUrl || !videoTitle || duration <= 0) {
        console.error("Invalid parameters for marking video as completed")
        return false
      }

      const { error } = await supabase.from("video_progress").upsert(
        {
          user_id: userId,
          video_url: videoUrl,
          video_title: videoTitle,
          current_time: duration,
          duration: duration,
          completed: true,
          last_watched_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,video_url",
        },
      )

      if (error) {
        console.error("Error marking video as completed:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Unexpected error marking video as completed:", error)
      return false
    }
  },

  // Obtener URL pública del video desde Supabase Storage
  getVideoUrl(fileName: string): string {
    try {
      const { data } = supabase.storage.from("product-images").getPublicUrl(`productos/${fileName}`)
      return data.publicUrl
    } catch (error) {
      console.error("Error getting video URL:", error)
      return ""
    }
  },

  // Validar si un video existe en el storage
  async checkVideoExists(fileName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage.from("product-images").list("productos", {
        search: fileName,
      })

      if (error) {
        console.error("Error checking video existence:", error)
        return false
      }

      return data && data.length > 0
    } catch (error) {
      console.error("Unexpected error checking video existence:", error)
      return false
    }
  },

  // Obtener estadísticas de progreso para un usuario
  async getUserVideoStats(userId: string): Promise<{
    totalVideos: number
    completedVideos: number
    inProgressVideos: number
    averageProgress: number
  }> {
    try {
      if (!userId) {
        return { totalVideos: 0, completedVideos: 0, inProgressVideos: 0, averageProgress: 0 }
      }

      const progress = await this.getUserVideoProgress(userId)

      const totalVideos = progress.length
      const completedVideos = progress.filter((p) => p.completed).length
      const inProgressVideos = progress.filter((p) => p.current_time > 0 && !p.completed).length

      const averageProgress =
        totalVideos > 0
          ? Math.round(
              progress.reduce((acc, p) => {
                const percentage = p.duration > 0 ? (p.current_time / p.duration) * 100 : 0
                return acc + percentage
              }, 0) / totalVideos,
            )
          : 0

      return {
        totalVideos,
        completedVideos,
        inProgressVideos,
        averageProgress,
      }
    } catch (error) {
      console.error("Error getting user video stats:", error)
      return { totalVideos: 0, completedVideos: 0, inProgressVideos: 0, averageProgress: 0 }
    }
  },
}
