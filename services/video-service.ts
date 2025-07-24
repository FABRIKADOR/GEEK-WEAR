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

export interface VideoStats {
  totalVideos: number
  completedVideos: number
  inProgressVideos: number
  averageProgress: number
}

export const videoService = {
  // Obtener progreso de video para un usuario
  async getVideoProgress(userId: string, videoUrl: string): Promise<VideoProgress | null> {
    try {
      if (!userId || !videoUrl) {
        console.error("❌ Missing userId or videoUrl")
        return null
      }

      console.log("🔍 Buscando progreso para:", { userId, videoUrl })

      const { data, error } = await supabase
        .from("video_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("video_url", videoUrl)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // No rows found - esto es normal para videos no vistos
          console.log("🆕 No progress found for video:", videoUrl)
          return null
        }
        console.error("❌ Error fetching video progress:", error)
        return null
      }

      console.log("✅ Progreso encontrado:", data)
      return data
    } catch (error) {
      console.error("❌ Unexpected error fetching video progress:", error)
      return null
    }
  },

  // Obtener todos los progresos de video de un usuario
  async getUserVideoProgress(userId: string): Promise<VideoProgress[]> {
    try {
      if (!userId) {
        console.error("❌ Missing userId")
        return []
      }

      console.log("🔍 Buscando todos los progresos para userId:", userId)

      const { data, error } = await supabase
        .from("video_progress")
        .select("*")
        .eq("user_id", userId)
        .order("last_watched_at", { ascending: false })

      if (error) {
        console.error("❌ Error fetching user video progress:", error)
        return []
      }

      console.log(`✅ ${data?.length || 0} progresos encontrados`)
      return data || []
    } catch (error) {
      console.error("❌ Unexpected error fetching user video progress:", error)
      return []
    }
  },

  // Actualizar progreso de video
  async updateVideoProgress(progress: Partial<VideoProgress>): Promise<VideoProgress | null> {
    try {
      if (!progress.user_id || !progress.video_url || !progress.video_title) {
        console.error("❌ Missing required fields for video progress update")
        return null
      }

      // Validar números
      const currentTime = Number(progress.current_time) || 0
      const duration = Number(progress.duration) || 0

      if (duration <= 0) {
        console.error("❌ Invalid duration for video progress")
        return null
      }

      // Determinar si está completado
      const completed = progress.completed || currentTime >= duration * 0.95

      console.log("💾 Actualizando progreso:", { currentTime, duration, completed })

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
        console.error("❌ Error updating video progress:", error)
        return null
      }

      console.log("✅ Progreso actualizado:", data)
      return data
    } catch (error) {
      console.error("❌ Unexpected error updating video progress:", error)
      return null
    }
  },

  // Marcar video como completado
  async markVideoCompleted(userId: string, videoUrl: string, videoTitle: string, duration: number): Promise<boolean> {
    try {
      if (!userId || !videoUrl || !videoTitle || duration <= 0) {
        console.error("❌ Invalid parameters for marking video as completed")
        return false
      }

      console.log("🏁 Marcando video como completado:", { userId, videoUrl, videoTitle, duration })

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
        console.error("❌ Error marking video as completed:", error)
        return false
      }

      console.log("✅ Video marcado como completado")
      return true
    } catch (error) {
      console.error("❌ Unexpected error marking video as completed:", error)
      return false
    }
  },

  // Obtener URL pública del video desde Supabase Storage
  getVideoUrl(fileName: string): string {
    try {
      const { data } = supabase.storage.from("product-images").getPublicUrl(`productos/${fileName}`)
      console.log("🔗 URL del video:", data.publicUrl)
      return data.publicUrl
    } catch (error) {
      console.error("❌ Error getting video URL:", error)
      return ""
    }
  },

  // Validar si un video existe en el storage
  async checkVideoExists(fileName: string): Promise<boolean> {
    try {
      console.log("🔍 Verificando existencia del video:", fileName)

      const { data, error } = await supabase.storage.from("product-images").list("productos", {
        search: fileName,
      })

      if (error) {
        console.error("❌ Error checking video existence:", error)
        return false
      }

      const exists = data && data.length > 0
      console.log(exists ? "✅ Video existe" : "❌ Video no existe")
      return exists
    } catch (error) {
      console.error("❌ Unexpected error checking video existence:", error)
      return false
    }
  },

  // Obtener estadísticas de progreso para un usuario
  async getUserVideoStats(userId: string): Promise<VideoStats> {
    try {
      if (!userId) {
        return { totalVideos: 0, completedVideos: 0, inProgressVideos: 0, averageProgress: 0 }
      }

      console.log("📊 Calculando estadísticas para userId:", userId)

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

      const stats = {
        totalVideos,
        completedVideos,
        inProgressVideos,
        averageProgress,
      }

      console.log("📈 Estadísticas calculadas:", stats)
      return stats
    } catch (error) {
      console.error("❌ Error getting user video stats:", error)
      return { totalVideos: 0, completedVideos: 0, inProgressVideos: 0, averageProgress: 0 }
    }
  },

  // Inicializar progreso para un nuevo usuario
  async initializeUserProgress(userId: string, videos: VideoData[]): Promise<boolean> {
    try {
      if (!userId || !videos.length) {
        console.error("❌ Missing userId or videos for initialization")
        return false
      }

      console.log("🚀 Inicializando progreso para usuario:", userId)

      const progressEntries = videos.map((video) => ({
        user_id: userId,
        video_url: video.url,
        video_title: video.title,
        current_time: 0,
        duration: 0, // Se actualizará cuando se cargue el video
        completed: false,
        last_watched_at: new Date().toISOString(),
      }))

      const { error } = await supabase.from("video_progress").upsert(progressEntries, {
        onConflict: "user_id,video_url",
        ignoreDuplicates: true,
      })

      if (error) {
        console.error("❌ Error initializing user progress:", error)
        return false
      }

      console.log("✅ Progreso inicializado para", videos.length, "videos")
      return true
    } catch (error) {
      console.error("❌ Unexpected error initializing user progress:", error)
      return false
    }
  },

  // Limpiar progreso antiguo (opcional)
  async cleanupOldProgress(daysOld = 30): Promise<number> {
    try {
      console.log("🧹 Limpiando progreso anterior a", daysOld, "días")

      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const { data, error } = await supabase
        .from("video_progress")
        .delete()
        .lt("last_watched_at", cutoffDate.toISOString())
        .select("id")

      if (error) {
        console.error("❌ Error cleaning up old progress:", error)
        return 0
      }

      const deletedCount = data?.length || 0
      console.log("✅ Eliminados", deletedCount, "registros antiguos")
      return deletedCount
    } catch (error) {
      console.error("❌ Unexpected error cleaning up old progress:", error)
      return 0
    }
  },
}
