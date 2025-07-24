import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Crear cliente de Supabase con service role para operaciones de servidor
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

async function getUserFromRequest(request: NextRequest): Promise<string | null> {
  try {
    console.log("🔐 Verificando autenticación...")

    // Obtener el token de Supabase de las cookies
    const accessToken = request.cookies.get("sb-access-token")?.value
    const refreshToken = request.cookies.get("sb-refresh-token")?.value

    console.log("🍪 Cookies encontradas:", {
      accessToken: accessToken ? "✅" : "❌",
      refreshToken: refreshToken ? "✅" : "❌",
    })

    if (accessToken) {
      // Verificar el token con Supabase
      const {
        data: { user },
        error,
      } = await supabaseAdmin.auth.getUser(accessToken)

      if (error) {
        console.log("❌ Error verificando token:", error.message)
        return null
      }

      if (user) {
        console.log("✅ Usuario autenticado:", user.id)
        return user.id
      }
    }

    // Intentar con el header Authorization
    const authHeader = request.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      console.log("🎫 Token encontrado en Authorization header")

      const {
        data: { user },
        error,
      } = await supabaseAdmin.auth.getUser(token)

      if (error) {
        console.log("❌ Error verificando token del header:", error.message)
        return null
      }

      if (user) {
        console.log("✅ Usuario autenticado vía header:", user.id)
        return user.id
      }
    }

    console.log("❌ No se encontró autenticación válida")
    return null
  } catch (error) {
    console.error("❌ Error verifying user token:", error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("📡 GET /api/video-progress")

    const userId = await getUserFromRequest(request)

    if (!userId) {
      console.log("🚫 No autorizado - no hay userId")
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Debes iniciar sesión para acceder a esta función",
        },
        { status: 401 },
      )
    }

    const { searchParams } = new URL(request.url)
    const videoUrl = searchParams.get("videoUrl")
    console.log("🎬 VideoUrl solicitado:", videoUrl)

    if (videoUrl) {
      // Obtener progreso de un video específico
      console.log("📊 Consultando progreso específico...")
      const { data, error } = await supabaseAdmin
        .from("video_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("video_url", videoUrl)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          console.log("🆕 No hay progreso previo (PGRST116)")
          return NextResponse.json({
            progress: null,
            message: "No hay progreso previo",
          })
        } else {
          console.error("❌ Error fetching video progress:", error)
          return NextResponse.json(
            {
              error: "Error al obtener progreso",
              details: error.message,
            },
            { status: 500 },
          )
        }
      }

      console.log("✅ Progreso encontrado:", data)
      return NextResponse.json({
        progress: data,
        message: "Progreso encontrado",
      })
    } else {
      // Obtener todos los progresos del usuario
      console.log("📊 Consultando todos los progresos...")
      const { data, error } = await supabaseAdmin
        .from("video_progress")
        .select("*")
        .eq("user_id", userId)
        .order("last_watched_at", { ascending: false })

      if (error) {
        console.error("❌ Error fetching user video progress:", error)
        return NextResponse.json(
          {
            error: "Error al obtener progreso",
            details: error.message,
          },
          { status: 500 },
        )
      }

      console.log(`✅ ${data?.length || 0} progresos encontrados`)
      return NextResponse.json({
        progress: data || [],
        count: data?.length || 0,
      })
    }
  } catch (error) {
    console.error("❌ Error in video progress GET:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📡 POST /api/video-progress")

    const userId = await getUserFromRequest(request)

    if (!userId) {
      console.log("🚫 No autorizado - no hay userId")
      return NextResponse.json(
        {
          error: "No autorizado",
          message: "Debes iniciar sesión para guardar el progreso",
        },
        { status: 401 },
      )
    }

    const body = await request.json()
    const { videoUrl, videoTitle, currentTime, duration, completed } = body

    console.log("📝 Datos recibidos:", { videoUrl, videoTitle, currentTime, duration, completed })

    // Validar datos requeridos
    if (!videoUrl || !videoTitle || currentTime === undefined || duration === undefined) {
      console.log("❌ Datos faltantes")
      return NextResponse.json(
        {
          error: "Datos faltantes",
          required: ["videoUrl", "videoTitle", "currentTime", "duration"],
          received: { videoUrl: !!videoUrl, videoTitle: !!videoTitle, currentTime, duration },
        },
        { status: 400 },
      )
    }

    // Validar que los valores sean números válidos
    const numCurrentTime = Number(currentTime)
    const numDuration = Number(duration)

    if (isNaN(numCurrentTime) || isNaN(numDuration) || numCurrentTime < 0 || numDuration <= 0) {
      console.log("❌ Valores de tiempo inválidos")
      return NextResponse.json(
        {
          error: "Valores de tiempo inválidos",
          details: `currentTime: ${numCurrentTime}, duration: ${numDuration}`,
        },
        { status: 400 },
      )
    }

    // Determinar si está completado (95% o más, o explícitamente marcado)
    const isCompleted = completed || numCurrentTime >= numDuration * 0.95
    const progressPercentage = Math.round((numCurrentTime / numDuration) * 100)
    console.log("🏁 ¿Completado?", isCompleted, `(${progressPercentage}%)`)

    // Actualizar o crear progreso
    console.log("💾 Guardando progreso en BD...")
    const { data, error } = await supabaseAdmin
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
      console.error("❌ Error updating video progress:", error)
      return NextResponse.json(
        {
          error: "Error al actualizar progreso",
          details: error.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Progreso guardado:", data)
    return NextResponse.json({
      progress: data,
      message: "Progreso actualizado correctamente",
    })
  } catch (error) {
    console.error("❌ Error in video progress POST:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
