import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"
import { verifyJWT } from "@/lib/jwt"

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
  try {
    // Intentar obtener el token del header Authorization
    const authHeader = request.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const jwtToken = authHeader.substring(7)
      const payload = await verifyJWT(jwtToken)
      if (payload?.sub) {
        return payload.sub
      }
    }

    // Intentar obtener el token de las cookies
    const token = request.cookies.get("auth-token")?.value
    if (token) {
      const payload = await verifyJWT(token)
      if (payload?.sub) {
        return payload.sub
      }
    }

    return null
  } catch (error) {
    console.error("Error verifying user token:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const videoUrl = searchParams.get("videoUrl")

    if (videoUrl) {
      // Obtener progreso de un video específico
      const { data, error } = await supabase
        .from("video_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("video_url", videoUrl)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching video progress:", error)
        return NextResponse.json({ error: "Error al obtener progreso" }, { status: 500 })
      }

      // Si no hay datos (PGRST116), devolver null
      const progress = error?.code === "PGRST116" ? null : data

      return NextResponse.json({
        progress,
        message: progress ? "Progreso encontrado" : "No hay progreso previo",
      })
    } else {
      // Obtener todos los progresos del usuario
      const { data, error } = await supabase
        .from("video_progress")
        .select("*")
        .eq("user_id", userId)
        .order("last_watched_at", { ascending: false })

      if (error) {
        console.error("Error fetching user video progress:", error)
        return NextResponse.json({ error: "Error al obtener progreso" }, { status: 500 })
      }

      return NextResponse.json({
        progress: data || [],
        count: data?.length || 0,
      })
    }
  } catch (error) {
    console.error("Error in video progress GET:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserFromRequest(request)

    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { videoUrl, videoTitle, currentTime, duration, completed } = body

    // Validar datos requeridos
    if (!videoUrl || !videoTitle || currentTime === undefined || duration === undefined) {
      return NextResponse.json(
        {
          error: "Datos faltantes",
          required: ["videoUrl", "videoTitle", "currentTime", "duration"],
        },
        { status: 400 },
      )
    }

    // Validar que los valores sean números válidos
    const numCurrentTime = Number(currentTime)
    const numDuration = Number(duration)

    if (isNaN(numCurrentTime) || isNaN(numDuration) || numCurrentTime < 0 || numDuration <= 0) {
      return NextResponse.json(
        {
          error: "Valores de tiempo inválidos",
        },
        { status: 400 },
      )
    }

    // Determinar si está completado (95% o más, o explícitamente marcado)
    const isCompleted = completed || numCurrentTime >= numDuration * 0.95

    // Actualizar o crear progreso
    const { data, error } = await supabase
      .from("video_progress")
      .upsert(
        {
          user_id: userId,
          video_url: videoUrl,
          video_title: videoTitle,
          current_time: numCurrentTime,
          duration: numDuration,
          completed: isCompleted,
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
      return NextResponse.json({ error: "Error al actualizar progreso" }, { status: 500 })
    }

    return NextResponse.json({
      progress: data,
      message: "Progreso actualizado correctamente",
    })
  } catch (error) {
    console.error("Error in video progress POST:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
