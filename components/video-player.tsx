"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, CheckCircle, Eye, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@supabase/supabase-js"
import type { VideoProgress } from "@/services/video-service"

// Cliente de Supabase para obtener el token del usuario
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface VideoPlayerProps {
  videoUrl: string
  title: string
  description?: string
  thumbnail?: string
  className?: string
}

export function VideoPlayer({ videoUrl, title, description, thumbnail, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState<VideoProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Función para obtener el token de autenticación
  const getAuthToken = async (): Promise<string | null> => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.access_token) {
        console.log("🎫 Token obtenido de la sesión")
        return session.access_token
      }

      console.log("❌ No hay sesión activa")
      return null
    } catch (error) {
      console.error("❌ Error obteniendo token:", error)
      return null
    }
  }

  // Cargar progreso inicial cuando el usuario y video estén disponibles
  useEffect(() => {
    if (user && videoUrl && !hasLoadedProgress) {
      console.log("🎬 Iniciando carga de progreso para:", videoUrl)
      loadVideoProgress()
    } else if (!user) {
      console.log("👤 No hay usuario autenticado")
      setProgress(null)
      setHasLoadedProgress(false)
      setError(null)
    }
  }, [user, videoUrl, hasLoadedProgress])

  // Actualizar progreso cada 10 segundos mientras se reproduce
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && user && currentTime > 0 && !isUpdating && duration > 0) {
      interval = setInterval(() => {
        console.log("⏰ Actualizando progreso automáticamente...")
        updateVideoProgress()
      }, 10000) // Actualizar cada 10 segundos
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, currentTime, user, isUpdating, duration])

  const loadVideoProgress = async () => {
    if (!user || !videoUrl) {
      console.log("❌ No se puede cargar progreso: falta usuario o videoUrl")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      console.log("📡 Consultando progreso para:", videoUrl)

      const token = await getAuthToken()
      if (!token) {
        throw new Error("No se pudo obtener el token de autenticación")
      }

      const response = await fetch(`/api/video-progress?videoUrl=${encodeURIComponent(videoUrl)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      console.log("📡 Respuesta de API:", response.status, response.statusText)

      if (response.status === 401) {
        throw new Error("No autorizado - inicia sesión nuevamente")
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("📊 Datos recibidos:", data)

      if (data.progress) {
        setProgress(data.progress)
        console.log("✅ Progreso encontrado:", {
          current_time: data.progress.current_time,
          duration: data.progress.duration,
          completed: data.progress.completed,
        })

        // Si hay progreso guardado y el video está listo, posicionar el video
        if (videoRef.current && data.progress.current_time > 0) {
          videoRef.current.currentTime = data.progress.current_time
          setCurrentTime(data.progress.current_time)
          console.log("⏯️ Video posicionado en:", data.progress.current_time)
        }
      } else {
        setProgress(null)
        console.log("🆕 No hay progreso previo para este video")
      }

      setHasLoadedProgress(true)
    } catch (error) {
      console.error("❌ Error loading video progress:", error)
      setError(error instanceof Error ? error.message : "Error desconocido")
      setProgress(null)
    } finally {
      setIsLoading(false)
    }
  }

  const updateVideoProgress = useCallback(async () => {
    if (!user || !videoRef.current || isUpdating || !duration) {
      console.log("⏸️ No se puede actualizar progreso:", {
        user: !!user,
        video: !!videoRef.current,
        isUpdating,
        duration,
      })
      return
    }

    setIsUpdating(true)
    const video = videoRef.current
    const currentTime = video.currentTime
    const videoDuration = video.duration || duration
    const completed = currentTime >= videoDuration * 0.95 // 95% completado

    console.log("💾 Actualizando progreso:", { currentTime, videoDuration, completed })

    try {
      const token = await getAuthToken()
      if (!token) {
        throw new Error("No se pudo obtener el token de autenticación")
      }

      const response = await fetch("/api/video-progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          videoUrl,
          videoTitle: title,
          currentTime: Math.floor(currentTime),
          duration: Math.floor(videoDuration),
          completed,
        }),
      })

      console.log("📡 Respuesta de actualización:", response.status, response.statusText)

      if (response.status === 401) {
        throw new Error("No autorizado - inicia sesión nuevamente")
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.progress) {
        setProgress(data.progress)
        console.log("✅ Progreso actualizado:", data.progress)
      }
    } catch (error) {
      console.error("❌ Error updating video progress:", error)
      setError(error instanceof Error ? error.message : "Error al actualizar progreso")
    } finally {
      setIsUpdating(false)
    }
  }, [user, videoUrl, title, isUpdating, duration])

  const togglePlay = useCallback(async () => {
    if (!videoRef.current) return

    try {
      if (isPlaying) {
        await videoRef.current.pause()
        setIsPlaying(false)
        console.log("⏸️ Video pausado")
      } else {
        // Asegurar que el video esté listo antes de reproducir
        if (videoRef.current.readyState >= 2) {
          await videoRef.current.play()
          setIsPlaying(true)
          console.log("▶️ Video reproduciendo")
        } else {
          console.log("⏳ Esperando a que el video esté listo...")
          // Esperar a que el video esté listo
          videoRef.current.addEventListener(
            "canplay",
            async () => {
              try {
                await videoRef.current?.play()
                setIsPlaying(true)
                console.log("▶️ Video reproduciendo (después de esperar)")
              } catch (error) {
                console.error("❌ Error playing video:", error)
                setIsPlaying(false)
              }
            },
            { once: true },
          )
        }
      }
    } catch (error) {
      console.error("❌ Error toggling play:", error)
      setIsPlaying(false)
    }
  }, [isPlaying])

  const toggleMute = () => {
    if (!videoRef.current) return

    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
    console.log(isMuted ? "🔊 Sonido activado" : "🔇 Sonido desactivado")
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return

    const newCurrentTime = videoRef.current.currentTime
    setCurrentTime(newCurrentTime)
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return

    const videoDuration = videoRef.current.duration
    setDuration(videoDuration)
    setIsLoading(false)
    console.log("📏 Duración del video:", videoDuration)

    // Si hay progreso guardado, aplicarlo ahora que tenemos metadata
    if (progress && progress.current_time > 0 && videoDuration > 0) {
      videoRef.current.currentTime = progress.current_time
      setCurrentTime(progress.current_time)
      console.log("⏯️ Video posicionado después de metadata:", progress.current_time)
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newTime = (clickX / width) * duration

    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
    console.log("🎯 Saltando a:", newTime)
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.current.requestFullscreen()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    if (!duration) return 0
    return (currentTime / duration) * 100
  }

  const getWatchedPercentage = () => {
    if (!progress || !progress.duration || progress.duration === 0) return 0
    return (progress.current_time / progress.duration) * 100
  }

  const getVideoStatus = () => {
    console.log("🏷️ Calculando estado del video:", { user: !!user, progress, hasLoadedProgress, error })

    if (!user) {
      return { type: "login", text: "Inicia sesión para trackear", color: "bg-gray-500/90", icon: Clock }
    }

    if (error) {
      return { type: "error", text: "Error de autenticación", color: "bg-red-500/90", icon: AlertCircle }
    }

    if (!hasLoadedProgress) {
      return { type: "loading", text: "Cargando...", color: "bg-blue-500/90", icon: Clock }
    }

    if (!progress) {
      return { type: "not-watched", text: "No visto", color: "bg-gray-500/90", icon: Clock }
    }

    if (progress.completed) {
      return { type: "completed", text: "Completado", color: "bg-green-500/90", icon: CheckCircle }
    }

    if (progress.current_time > 0) {
      const percentage = Math.round(getWatchedPercentage())
      return { type: "in-progress", text: `${percentage}% visto`, color: "bg-blue-500/90", icon: Eye }
    }

    return { type: "not-watched", text: "No visto", color: "bg-gray-500/90", icon: Clock }
  }

  // Manejar eventos de video para evitar AbortError
  const handlePlay = () => {
    setIsPlaying(true)
    console.log("▶️ Evento play")
  }

  const handlePause = () => {
    setIsPlaying(false)
    console.log("⏸️ Evento pause")
  }

  const handleEnded = () => {
    setIsPlaying(false)
    console.log("🏁 Video terminado")
    // Marcar como completado al finalizar
    if (user && videoRef.current) {
      updateVideoProgress()
    }
  }

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error("❌ Video error:", e)
    setIsLoading(false)
    setIsPlaying(false)
  }

  const videoStatus = getVideoStatus()
  const StatusIcon = videoStatus.icon

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Video Status Badge */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        <div className={`${videoStatus.color} text-white px-3 py-1 rounded-full text-sm flex items-center gap-1`}>
          <StatusIcon className="w-4 h-4" />
          {videoStatus.text}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-16 right-4 z-20 bg-red-500/90 text-white px-3 py-1 rounded-lg text-sm max-w-xs">
          <div className="flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onError={handleError}
        poster={thumbnail}
        preload="metadata"
        playsInline
        controls={false}
        autoPlay
        loop
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        <source src={videoUrl} type="video/x-matroska" />
        Tu navegador no soporta el elemento de video.
      </video>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="bg-black/30 hover:bg-black/50 text-white rounded-full p-4"
            disabled={isLoading}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/30 rounded-full cursor-pointer mb-4" onClick={handleProgressClick}>
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-150"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
                disabled={isLoading}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>

              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4 bg-gray-900">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        {description && <p className="text-gray-300 text-sm">{description}</p>}

        {/* Progress Info */}
        {progress && user && (
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Último visto: {new Date(progress.last_watched_at).toLocaleDateString("es-ES")}
            </div>
            {progress.current_time > 0 && (
              <div>
                Progreso: {formatTime(progress.current_time)} / {formatTime(progress.duration)}
              </div>
            )}
            {progress.completed && (
              <div className="flex items-center gap-1 text-green-400">
                <CheckCircle className="w-4 h-4" />
                Video completado
              </div>
            )}
          </div>
        )}

        {!user && (
          <div className="mt-3 text-sm text-gray-400">
            <p>Inicia sesión para guardar tu progreso de visualización</p>
          </div>
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-3 text-xs text-green-400 font-mono">
            DEBUG: User: {user ? "✅" : "❌"} | Progress: {progress ? "✅" : "❌"} | Loaded:{" "}
            {hasLoadedProgress ? "✅" : "❌"} | Error: {error ? "❌" : "✅"}
          </div>
        )}
      </div>
    </div>
  )
}
