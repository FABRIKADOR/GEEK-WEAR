"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, Phone, MapPin, Clock, Zap, Shield, Navigation, ExternalLink } from "lucide-react"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })

    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactChannels = [
    {
      icon: Mail,
      title: "Email Cuántico",
      description: "Respuesta instantánea garantizada",
      value: "contact@geekwear.com",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Phone,
      title: "Línea Directa",
      description: "Soporte 24/7 para emergencias geek",
      value: "+52 (998) 123-4567",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MapPin,
      title: "Base de Operaciones",
      description: "UPQROO - Cancún, México 🇲🇽",
      value: "Universidad Politécnica de Quintana Roo",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Clock,
      title: "Horarios Galácticos",
      description: "Siempre disponibles en el metaverso",
      value: "Lun-Vie: 9:00-18:00",
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Partículas de fondo */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Contacto
              </span>
              <span className="text-white"> - </span>
              <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                GeekWear
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Conecta con nuestro equipo legendario de ingenieros UPQROO 🇲🇽
            </p>
          </motion.div>
        </div>
      </section>

      {/* Canales de Contacto */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactChannels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group h-64"
              >
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 h-full relative overflow-hidden flex flex-col">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${channel.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-r ${channel.color} p-0.5 mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                      <channel.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{channel.title}</h3>
                  <p className="text-gray-400 text-sm mb-3 flex-grow">{channel.description}</p>
                  <p className="text-cyan-400 font-semibold text-sm">{channel.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mapa Interactivo */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                📍 Encuéntranos
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Visítanos en nuestra base de operaciones en la Universidad Politécnica de Quintana Roo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mapa Interactivo con iframe */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="w-full h-96 lg:h-[500px] relative overflow-hidden border border-slate-700/50 rounded-2xl">
                  {/* Iframe de Google Maps */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.8234567890123!2d-86.8515!3d21.1619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c2b05aef653db%3A0x8b8b8b8b8b8b8b8b!2sUniversidad%20Polit%C3%A9cnica%20de%20Quintana%20Roo!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-2xl"
                    title="Ubicación de GeekWear - UPQROO"
                  />

                  {/* Overlay con información */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 text-purple-600 mr-2" />
                      GeekWear UPQROO
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Navigation className="w-3 h-3 mr-2" />
                        Cancún, Quintana Roo
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-2" />
                        +52 (998) 123-4567
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-2" />
                        Lun-Vie: 9:00-18:00
                      </div>
                    </div>
                  </div>

                  {/* Botón para abrir en Google Maps */}
                  <motion.a
                    href="https://maps.google.com/?q=Universidad+Politécnica+de+Quintana+Roo,+Cancún,+Quintana+Roo,+México"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 group"
                    title="Abrir en Google Maps"
                  >
                    <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  </motion.a>
                </div>
              </motion.div>
            </div>

            {/* Información de ubicación */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <MapPin className="w-6 h-6 text-purple-400 mr-2" />
                  Ubicación
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-start">
                    <Navigation className="w-4 h-4 mt-1 mr-2 text-cyan-400" />
                    Universidad Politécnica de Quintana Roo, Cancún, Q.R., México
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-green-400" />
                    +52 (998) 123-4567
                  </p>
                  <p className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-orange-400" />
                    Lun-Vie: 9:00 AM - 6:00 PM
                  </p>
                </div>

                <motion.a
                  href="https://maps.google.com/?q=Universidad+Politécnica+de+Quintana+Roo"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-purple-400 hover:to-pink-400 transition-all duration-300 flex items-center justify-center group"
                >
                  <ExternalLink className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Abrir en Google Maps
                </motion.a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
              >
                <h3 className="text-xl font-bold text-white mb-4">🚗 Cómo llegar</h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Desde el centro de Cancún: 25 min en auto</p>
                  <p>• Transporte público: Ruta R1, R2</p>
                  <p>• Estacionamiento gratuito disponible</p>
                  <p>• Acceso para personas con discapacidad</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulario Principal */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulario */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
                />

                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Contáctanos
                </h2>
                <p className="text-gray-300 mb-8">
                  Nos encantaría saber de ti. Envíanos un mensaje y te responderemos lo antes posible.
                </p>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full"
                    />
                    <h4 className="text-xl font-bold text-green-400 mb-2">¡Mensaje Enviado!</h4>
                    <p className="text-gray-400">Tu mensaje ha sido recibido correctamente</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                      <label htmlFor="name" className="block text-cyan-400 text-sm font-bold mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        required
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    <div className="relative group">
                      <label htmlFor="email" className="block text-cyan-400 text-sm font-bold mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Tu email"
                        required
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    <div className="relative group">
                      <label htmlFor="subject" className="block text-cyan-400 text-sm font-bold mb-2">
                        Asunto
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Asunto"
                        required
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    <div className="relative group">
                      <label htmlFor="message" className="block text-cyan-400 text-sm font-bold mb-2">
                        Mensaje
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tu mensaje"
                        required
                        rows={6}
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:shadow-2xl hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                      <div className="relative z-10 flex items-center justify-center space-x-2">
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            <span>Enviando...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            <span>Enviar Mensaje</span>
                          </>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>

            {/* Información de Contacto */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Información de Contacto
                </h2>
                <p className="text-gray-300 mb-2">Ponte en Contacto</p>
                <p className="text-gray-400 mb-8">
                  Si tienes alguna pregunta o comentario, no dudes en ponerte en contacto con nosotros.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                      <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Dirección</h3>
                      <p className="text-gray-300">Universidad Politécnica de Quintana Roo</p>
                      <p className="text-gray-300">Cancún, Quintana Roo, México 🇲🇽</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 p-0.5">
                      <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Teléfono</h3>
                      <p className="text-gray-300">+52 (998) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 p-0.5">
                      <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Horarios de Atención</h3>
                      <p className="text-gray-300">Lunes - Viernes: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-300">Sábado: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-300">Domingo: Cerrado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features adicionales */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 text-center"
                >
                  <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">Respuesta Rápida</h4>
                  <p className="text-xs text-gray-400">24-48 horas</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 text-center"
                >
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white mb-1">Seguro</h4>
                  <p className="text-xs text-gray-400">Datos protegidos</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
