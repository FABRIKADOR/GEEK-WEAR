import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  text?: string
  fullScreen?: boolean
}

export function LoadingSpinner({
  size = "md",
  className,
  text = "Cargando...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  const containerClasses = fullScreen
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex flex-col items-center justify-center py-8"

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner principal */}
        <div className="relative">
          <div className={cn("animate-spin rounded-full border-4 border-gray-200", sizeClasses[size])}>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-grape animate-spin"></div>
          </div>

          {/* Círculo interno pulsante */}
          <div
            className={cn(
              "absolute inset-2 rounded-full bg-gradient-to-r from-grape to-dark-blue opacity-20 animate-pulse",
              size === "sm" ? "inset-1" : size === "lg" ? "inset-3" : size === "xl" ? "inset-4" : "inset-2",
            )}
          ></div>
        </div>

        {/* Texto de carga */}
        {text && (
          <div className="text-center">
            <p className={cn("font-medium text-gray-700 animate-pulse", textSizeClasses[size])}>{text}</p>
            <div className="flex justify-center mt-2 space-x-1">
              <div className="w-2 h-2 bg-grape rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-grape rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
              <div className="w-2 h-2 bg-grape rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para loading de página completa
export function PageLoader({ text = "Cargando página..." }: { text?: string }) {
  return <LoadingSpinner size="lg" text={text} fullScreen />
}

// Componente para loading inline
export function InlineLoader({ text = "Cargando..." }: { text?: string }) {
  return <LoadingSpinner size="sm" text={text} />
}

// Componente para loading de secciones
export function SectionLoader({ text = "Cargando contenido..." }: { text?: string }) {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <LoadingSpinner size="md" text={text} />
    </div>
  )
}
