"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, MapPin, Gift, Sparkles, Star, Heart, MessageCircle } from "lucide-react"

// Componente de partículas flotantes
function FloatingParticles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDelay: Math.random() * 10,
    animationDuration: 8 + Math.random() * 4,
    size: 12 + Math.random() * 8,
    isHeart: Math.random() > 0.5,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-pulse opacity-20"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            animationDuration: `${particle.animationDuration}s`,
            animation: `float ${particle.animationDuration}s ease-in-out infinite`,
          }}
        >
          {particle.isHeart ? (
            <Heart className="text-white" size={particle.size} fill="currentColor" />
          ) : (
            <Star className="text-white" size={particle.size} fill="currentColor" />
          )}
        </div>
      ))}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default function InvitacionXV() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date("2025-07-04T19:00:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleLocationClick = () => {
    window.open(
      "https://www.google.com/maps/place/Salón+Diamante/@21.1626422,-86.8882980,20z/data=!3m1!4b1!4m6!3m5!1s0x8f4c2ca725a20bdf:0xc74ec59f7bf7d3db!8m2!3d21.1626422!4d-86.8882980!16s%2Fg%2F11c5p8y8qy",
      "_blank",
    )
  }

  const handleAmazonClick = () => {
    window.open("https://www.amazon.com.mx/registries/gl/guest-view/13F1XA158XEFZ", "_blank")
  }

  const handleWhatsAppConfirm = () => {
    const message = encodeURIComponent(
      "Hola, confirmo mi asistencia a los XV años de Camila del Cielo Aguilar Nowell el 4 de julio de 2025 a las 7:00 PM en Salón Diamante. ¡Nos vemos ahí! 🎉",
    )
    window.open(`https://wa.me/5219983061480?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 lg:p-8 font-serif relative">
      {/* Imagen de fondo */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/camila-xv.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Overlay oscuro para legibilidad */}
      <div className="fixed inset-0 bg-black bg-opacity-75" />

      <FloatingParticles />

      <div className="w-full max-w-md lg:max-w-4xl space-y-8 lg:space-y-12 relative z-10">
        {/* Header con fecha */}
        <div className="text-center">
          <div className="inline-block border border-zinc-500 rounded-full px-8 py-3 lg:px-12 lg:py-4 mb-12 lg:mb-16 bg-zinc-800 bg-opacity-90">
            <span className="text-sm lg:text-lg font-light tracking-wider text-zinc-300">4 de Julio, 2025</span>
          </div>

          {/* Título principal */}
          <h1 className="text-6xl lg:text-8xl font-bold mb-3 lg:mb-4 italic bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
            Mis XV
          </h1>
          <h1 className="text-6xl lg:text-8xl font-bold mb-8 lg:mb-12 italic bg-gradient-to-b from-white to-gray-300 bg-clip-text text-transparent">
            Años
          </h1>

          {/* Decoración elegante */}
          <div className="flex justify-center items-center space-x-6 lg:space-x-8 mb-8 lg:mb-12">
            <div className="w-1 h-8 lg:h-12 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
            <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
            <div className="w-1 h-8 lg:h-12 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
          </div>

          {/* Nombre */}
          <h2 className="text-2xl lg:text-4xl font-light mb-3 lg:mb-4 italic text-gray-200 tracking-wide">
            Camila del Cielo Aguilar
          </h2>
          <h2 className="text-2xl lg:text-4xl font-light mb-12 lg:mb-16 italic text-gray-200 tracking-wide">Nowell</h2>

          {/* Faltan */}
          <p className="text-lg lg:text-2xl mb-8 lg:mb-12 italic text-gray-300 tracking-wider">Faltan</p>
        </div>

        {/* Contador regresivo */}
        <div className="grid grid-cols-4 gap-3 lg:gap-6 mb-12 lg:mb-16">
          <div className="text-center">
            <div className="bg-zinc-800 bg-opacity-90 border border-zinc-600 rounded-lg p-4 lg:p-6 shadow-lg">
              <div className="text-3xl lg:text-5xl font-bold text-gray-100">{timeLeft.days}</div>
            </div>
            <div className="text-xs lg:text-sm mt-3 lg:mt-4 text-gray-400 italic tracking-wider">Días</div>
          </div>
          <div className="text-center">
            <div className="bg-zinc-800 bg-opacity-90 border border-zinc-600 rounded-lg p-4 lg:p-6 shadow-lg">
              <div className="text-3xl lg:text-5xl font-bold text-gray-100">{timeLeft.hours}</div>
            </div>
            <div className="text-xs lg:text-sm mt-3 lg:mt-4 text-gray-400 italic tracking-wider">Horas</div>
          </div>
          <div className="text-center">
            <div className="bg-zinc-800 bg-opacity-90 border border-zinc-600 rounded-lg p-4 lg:p-6 shadow-lg">
              <div className="text-3xl lg:text-5xl font-bold text-gray-100">{timeLeft.minutes}</div>
            </div>
            <div className="text-xs lg:text-sm mt-3 lg:mt-4 text-gray-400 italic tracking-wider">Minutos</div>
          </div>
          <div className="text-center">
            <div className="bg-zinc-800 bg-opacity-90 border border-zinc-600 rounded-lg p-4 lg:p-6 shadow-lg">
              <div className="text-3xl lg:text-5xl font-bold text-gray-100">{timeLeft.seconds}</div>
            </div>
            <div className="text-xs lg:text-sm mt-3 lg:mt-4 text-gray-400 italic tracking-wider">Segundos</div>
          </div>
        </div>

        {/* Información del evento */}
        <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {/* Hora */}
          <Card className="bg-zinc-900 bg-opacity-90 border-zinc-600 shadow-xl">
            <CardContent className="p-8 lg:p-10 text-center">
              <div className="flex justify-center mb-4 lg:mb-6">
                <div className="bg-zinc-600 rounded-full p-3 lg:p-4 shadow-lg">
                  <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-gray-200" />
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 italic text-gray-200 tracking-wide">
                Hora
              </h3>
              <p className="text-3xl lg:text-4xl font-bold mb-2 lg:mb-3 text-gray-100">7:00 PM</p>
              <p className="text-sm lg:text-base text-gray-400 italic">Hora de Cancún</p>
            </CardContent>
          </Card>

          {/* Lugar */}
          <Card className="bg-zinc-900 bg-opacity-90 border-zinc-600 shadow-xl">
            <CardContent className="p-8 lg:p-10 text-center">
              <div className="flex justify-center mb-4 lg:mb-6">
                <div className="bg-zinc-600 rounded-full p-3 lg:p-4 shadow-lg">
                  <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-gray-200" />
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 italic text-gray-200 tracking-wide">
                Lugar
              </h3>
              <p className="text-2xl font-semibold mb-6 text-gray-100 italic">Salón Diamante</p>
              <Button
                variant="outline"
                className="border-zinc-600 text-gray-200 hover:bg-zinc-700 bg-transparent hover:text-white transition-all duration-300 italic tracking-wide"
                onClick={handleLocationClick}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Ver ubicación
              </Button>
            </CardContent>
          </Card>

          {/* Mesa de regalos */}
          <Card className="bg-zinc-900 bg-opacity-90 border-zinc-600 shadow-xl">
            <CardContent className="p-8 lg:p-10 text-center">
              <div className="flex justify-center mb-4 lg:mb-6">
                <div className="bg-zinc-600 rounded-full p-3 lg:p-4 shadow-lg">
                  <Gift className="w-6 h-6 lg:w-8 lg:h-8 text-gray-200" />
                </div>
              </div>
              <h3 className="text-xl lg:text-2xl font-semibold mb-3 lg:mb-4 italic text-gray-200 tracking-wide">
                Mesa de Regalos
              </h3>
              <p className="text-sm text-gray-300 mb-6 italic">Tu presencia es el mejor regalo</p>
              <Button
                className="bg-zinc-700 hover:bg-zinc-600 text-white w-full transition-all duration-300 italic tracking-wide shadow-lg"
                onClick={handleAmazonClick}
              >
                <Gift className="w-4 h-4 mr-2" />
                Ver Lista en Amazon
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Botón de confirmación por WhatsApp */}
        <div className="text-center mt-8 lg:mt-12">
          <Button
            onClick={handleWhatsAppConfirm}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-8 py-4 lg:px-12 lg:py-6 text-lg lg:text-xl font-semibold italic tracking-wide shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 mr-3" />
            Confirmar Asistencia
          </Button>
        </div>

        {/* Mensaje final */}
        <div className="text-center mt-12 lg:mt-16 px-6 lg:px-12">
          <div className="border-t border-zinc-700 pt-8 lg:pt-12">
            <p className="text-sm lg:text-lg italic text-gray-300 leading-relaxed tracking-wide font-light max-w-2xl mx-auto mb-6">
              "Eres un invitado especial para mí y agradezco puedas llegar a tiempo para no perderte ningún detalle de
              esta fiesta y así poder compartir estos momentos especiales en mi vida."
            </p>
            <p className="text-sm lg:text-lg italic text-gray-300 leading-relaxed tracking-wide font-light max-w-2xl mx-auto">
              "Con la bendición de Dios y el amor de mis padres, te invito a celebrar conmigo este día tan especial."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
