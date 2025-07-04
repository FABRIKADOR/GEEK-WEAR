"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Headphones,
  Gamepad2,
  Monitor,
  Bug,
  CreditCard,
  Download,
  Shield,
  Zap,
} from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Formulario enviado:", formData)
    // Aquí iría la lógica para enviar el formulario
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const supportCategories = [
    { id: "technical", name: "Soporte Técnico", icon: Monitor, color: "from-cyber-blue to-neon-green" },
    { id: "account", name: "Cuenta y Perfil", icon: Shield, color: "from-electric-purple to-plasma-pink" },
    { id: "payment", name: "Pagos y Facturación", icon: CreditCard, color: "from-gaming-orange to-cyber-blue" },
    { id: "download", name: "Descargas y Instalación", icon: Download, color: "from-neon-green to-gaming-orange" },
    { id: "bug", name: "Reportar Bug", icon: Bug, color: "from-plasma-pink to-electric-purple" },
    { id: "general", name: "Consulta General", icon: MessageCircle, color: "from-cyber-blue to-electric-purple" },
  ]

  const contactMethods = [
    {
      icon: Headphones,
      title: "Soporte Gaming 24/7",
      description: "Chat en vivo con nuestro equipo de gamers",
      value: "Disponible ahora",
      action: "Iniciar Chat",
      color: "from-cyber-blue to-neon-green",
    },
    {
      icon: Mail,
      title: "Email de Soporte",
      description: "Respuesta garantizada en menos de 2 horas",
      value: "support@gamevault.com",
      action: "Enviar Email",
      color: "from-electric-purple to-plasma-pink",
    },
    {
      icon: Phone,
      title: "Línea Directa Gaming",
      description: "Soporte telefónico para casos urgentes",
      value: "+52 998 123 4567",
      action: "Llamar Ahora",
      color: "from-gaming-orange to-cyber-blue",
    },
  ]

  const faqCategories = [
    {
      title: "Problemas de Descarga",
      icon: Download,
      questions: [
        "¿Por qué mi descarga es lenta?",
        "¿Cómo reinicio una descarga interrumpida?",
        "¿Dónde se guardan mis juegos?",
      ],
    },
    {
      title: "Cuenta y Seguridad",
      icon: Shield,
      questions: ["¿Cómo cambio mi contraseña?", "¿Cómo activo la autenticación 2FA?", "¿Puedo compartir mi cuenta?"],
    },
    {
      title: "Pagos y Reembolsos",
      icon: CreditCard,
      questions: ["¿Qué métodos de pago aceptan?", "¿Cómo solicito un reembolso?", "¿Por qué fue rechazado mi pago?"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space via-dark-slate to-midnight-blue text-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyber-blue via-neon-green to-electric-purple bg-clip-text text-transparent">
              Soporte Gaming
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Nuestro squad de soporte está aquí para ayudarte 24/7.
              <span className="text-cyber-blue font-semibold"> ¡Nunca juegues solo!</span>
            </p>
          </motion.div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-gradient-to-br from-midnight-blue/80 to-dark-slate/80 border-cyber-blue/30 hover:border-cyber-blue/50 transition-all duration-300 h-full backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${method.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white">{method.title}</CardTitle>
                    <CardDescription className="text-gray-400">{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-cyber-blue font-semibold mb-4">{method.value}</p>
                    <Button
                      className={`w-full bg-gradient-to-r ${method.color} text-white hover:scale-105 transition-transform`}
                    >
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Form */}
      <section className="py-20 bg-gradient-to-r from-dark-slate/50 to-midnight-blue/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-gradient-to-br from-midnight-blue/90 to-dark-slate/90 border-cyber-blue/30 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-cyber-blue flex items-center gap-2">
                    <MessageCircle className="w-6 h-6" />
                    Envíanos un Mensaje
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Describe tu problema y nuestro equipo te ayudará lo antes posible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Nombre Gamer</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-dark-slate/50 border-cyber-blue/30 text-white focus:border-cyber-blue"
                          placeholder="Tu nombre o gamertag"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="bg-dark-slate/50 border-cyber-blue/30 text-white focus:border-cyber-blue"
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Categoría de Soporte</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-dark-slate/50 border border-cyber-blue/30 rounded-md px-3 py-2 text-white focus:border-cyber-blue focus:outline-none"
                        required
                      >
                        <option value="">Selecciona una categoría</option>
                        {supportCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Describe tu problema</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="bg-dark-slate/50 border-cyber-blue/30 text-white focus:border-cyber-blue min-h-[120px]"
                        placeholder="Cuéntanos qué está pasando..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-cyber-blue to-neon-green text-dark-slate font-bold py-3 hover:from-neon-green hover:to-cyber-blue transition-all duration-300 hover:scale-105"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Support Categories */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-cyber-blue mb-6">Categorías de Soporte</h3>
              <div className="space-y-4">
                {supportCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    className="group cursor-pointer"
                    whileHover={{ x: 10 }}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center p-4 bg-gradient-to-r from-midnight-blue/60 to-dark-slate/60 rounded-lg border border-cyber-blue/20 group-hover:border-cyber-blue/40 transition-all duration-300">
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mr-4`}
                      >
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-cyber-blue transition-colors">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Soporte especializado para {category.name.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyber-blue to-neon-green bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            Preguntas Frecuentes
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faqCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-br from-midnight-blue/80 to-dark-slate/80 border-cyber-blue/30 hover:border-cyber-blue/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <category.icon className="w-8 h-8 text-cyber-blue" />
                      <CardTitle className="text-xl text-white">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.questions.map((question, qIndex) => (
                        <div
                          key={qIndex}
                          className="p-3 bg-dark-slate/30 rounded-lg border border-cyber-blue/10 hover:border-cyber-blue/30 transition-colors cursor-pointer"
                        >
                          <p className="text-sm text-gray-300 hover:text-white transition-colors">{question}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gradient-to-r from-deep-space to-midnight-blue">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <MapPin className="w-12 h-12 text-cyber-blue mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ubicación</h3>
              <p className="text-gray-400">Cancún, Quintana Roo, México</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Clock className="w-12 h-12 text-neon-green mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Horario</h3>
              <p className="text-gray-400">24/7 Gaming Support</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Gamepad2 className="w-12 h-12 text-electric-purple mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Plataformas</h3>
              <p className="text-gray-400">PC, Mobile, Console</p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Shield className="w-12 h-12 text-gaming-orange mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Seguridad</h3>
              <p className="text-gray-400">Datos 100% Protegidos</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
