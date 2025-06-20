"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Grid3X3, Gamepad2, Zap, Trophy } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-deep-space via-dark-slate to-midnight-blue text-white overflow-hidden min-h-[80vh] sm:min-h-[90vh] flex items-center w-full">
      {/* Efectos de fondo estáticos */}
      <div className="absolute inset-0 z-0 w-full">
        {/* Grid pattern estático */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

        {/* Efectos de luz estáticos */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-green/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-electric-purple/5 rounded-full blur-3xl"></div>

        {/* Overlay para legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-r from-deep-space/90 via-dark-slate/70 to-midnight-blue/90 z-10"></div>
      </div>

      {/* Contenido principal */}
      <div className="w-full relative z-20 py-12 sm:py-20 md:py-32 px-3 sm:px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Título principal */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-2 sm:mb-4 tracking-tight">
              <span className="text-white">Game</span>{" "}
              <span className="bg-gradient-to-r from-cyber-blue via-neon-green to-electric-purple bg-clip-text text-transparent">
                Vault
              </span>
            </h1>
            <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 tracking-wide">
              Tu{" "}
              <span className="bg-gradient-to-r from-neon-green via-cyber-blue to-electric-purple bg-clip-text text-transparent">
                Arsenal
              </span>{" "}
              Gaming
            </h2>
          </div>

          {/* Subtítulo */}
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed text-gray-300 font-light px-2">
            Descubre nuestra increíble colección de juegos, membresías premium y contenido exclusivo para{" "}
            <span className="text-neon-green font-semibold">verdaderos gamers</span>
          </p>

          {/* Botones principales */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-2">
            <Button
              asChild
              size="lg"
              className="group relative bg-gradient-to-r from-cyber-blue to-neon-green text-dark-slate hover:from-neon-green hover:to-cyber-blue font-semibold text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-cyber-blue/25 hover:scale-105 border-0 w-full sm:w-auto sm:min-w-[200px]"
            >
              <Link href="/productos">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 transition-transform group-hover:scale-110" />
                Explorar Juegos
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="group relative bg-transparent text-white hover:bg-cyber-blue/10 font-semibold text-sm sm:text-base px-6 sm:px-8 py-4 sm:py-6 rounded-xl transition-all duration-300 border-2 border-cyber-blue/50 hover:border-neon-green/50 backdrop-blur-sm w-full sm:w-auto sm:min-w-[200px] hover:shadow-lg hover:shadow-cyber-blue/20"
            >
              <Link href="/productos">
                <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 transition-transform group-hover:scale-110" />
                Ver Categorías
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 sm:ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Estadísticas estáticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
            <div className="group text-center backdrop-blur-md bg-cyber-blue/5 rounded-2xl p-4 sm:p-6 border border-cyber-blue/20 hover:bg-cyber-blue/10 hover:border-cyber-blue/40 transition-all duration-300 hover:shadow-lg hover:shadow-cyber-blue/20">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2 group-hover:text-cyber-blue transition-colors">
                500+
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase flex items-center justify-center gap-1">
                <Gamepad2 className="w-3 h-3" />
                Juegos Únicos
              </div>
            </div>
            <div className="group text-center backdrop-blur-md bg-neon-green/5 rounded-2xl p-4 sm:p-6 border border-neon-green/20 hover:bg-neon-green/10 hover:border-neon-green/40 transition-all duration-300 hover:shadow-lg hover:shadow-neon-green/20">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2 group-hover:text-neon-green transition-colors">
                24/7
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" />
                Entrega Instantánea
              </div>
            </div>
            <div className="group text-center backdrop-blur-md bg-electric-purple/5 rounded-2xl p-4 sm:p-6 border border-electric-purple/20 hover:bg-electric-purple/10 hover:border-electric-purple/40 transition-all duration-300 hover:shadow-lg hover:shadow-electric-purple/20">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 sm:mb-2 group-hover:text-electric-purple transition-colors">
                10+
              </div>
              <div className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3" />
                Plataformas
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
