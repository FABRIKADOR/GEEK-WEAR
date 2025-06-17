"use client"

import { motion } from "framer-motion"
import { Shield, Eye, Lock, Users, Globe, Clock, FileText, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react"

const PrivacyPage = () => {
  const sections = [
    {
      id: "info-collection",
      title: "Información que Recopilamos",
      icon: Eye,
      color: "from-blue-500 to-cyan-500",
      content: [
        {
          subtitle: "Información que usted nos proporciona:",
          text: "Esto incluye información que usted proporciona al crear una cuenta, realizar una compra, suscribirse a nuestro boletín informativo o ponerse en contacto con nosotros directamente. Esta información puede incluir su nombre, dirección de correo electrónico, dirección postal, número de teléfono e información de pago.",
        },
        {
          subtitle: "Información recopilada automáticamente:",
          text: "Cuando usted visita nuestro sitio web, recopilamos automáticamente cierta información sobre su dispositivo y su uso de nuestro sitio web. Esta información puede incluir su dirección IP, tipo de navegador, sistema operativo, URL de referencia, páginas visitadas y las fechas/horas de sus visitas.",
        },
      ],
    },
    {
      id: "info-usage",
      title: "Cómo Usamos tu Información",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      content: [
        {
          subtitle: "Propósitos principales:",
          text: "Utilizamos la información que recopilamos para proporcionarle y mantener nuestro sitio web, procesar sus pedidos y gestionar su cuenta con la más alta seguridad.",
        },
        {
          subtitle: "Comunicación y mejoras:",
          text: "Para comunicarnos con usted, incluyendo el envío de correos electrónicos promocionales y actualizaciones, así como para mejorar nuestro sitio web y desarrollar nuevas características basadas en tecnología UPQROO.",
        },
      ],
    },
    {
      id: "info-sharing",
      title: "Compartir Información",
      icon: Globe,
      color: "from-purple-500 to-pink-500",
      content: [
        {
          subtitle: "Proveedores de servicios:",
          text: "Con proveedores de servicios que nos ayudan a operar nuestro sitio web y proporcionar nuestros servicios (por ejemplo, procesadores de pago, proveedores de alojamiento web).",
        },
        {
          subtitle: "Cumplimiento legal:",
          text: "Cuando sea requerido por la ley mexicana o en respuesta a un proceso legal válido, siempre protegiendo sus derechos fundamentales.",
        },
      ],
    },
    {
      id: "data-security",
      title: "Seguridad de Datos",
      icon: Lock,
      color: "from-red-500 to-orange-500",
      content: [
        {
          subtitle: "Protección avanzada:",
          text: "Tomamos medidas de seguridad de nivel militar para proteger su información contra el acceso no autorizado, el uso o la divulgación, utilizando tecnología desarrollada por nuestro equipo UPQROO.",
        },
        {
          subtitle: "Transparencia en limitaciones:",
          text: "Sin embargo, ninguna transmisión de datos a través de Internet o sistema de almacenamiento electrónico es completamente segura. Por lo tanto, no podemos garantizar la seguridad absoluta de su información.",
        },
      ],
    },
    {
      id: "user-rights",
      title: "Tus Derechos",
      icon: CheckCircle,
      color: "from-indigo-500 to-purple-500",
      content: [
        {
          subtitle: "Derechos fundamentales:",
          text: "Usted tiene derecho a acceder, rectificar, borrar y restringir el procesamiento de su información personal, así como a oponerse al procesamiento y solicitar la portabilidad de los datos.",
        },
        {
          subtitle: "Ejercicio de derechos:",
          text: "Para ejercer estos derechos, por favor contáctenos utilizando la información de contacto que se proporciona. Nuestro equipo UPQROO procesará su solicitud en un máximo de 72 horas.",
        },
      ],
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "Encriptación Cuántica",
      description: "Protección de datos con tecnología de vanguardia",
    },
    {
      icon: Eye,
      title: "Transparencia Total",
      description: "Información clara sobre el uso de tus datos",
    },
    {
      icon: Lock,
      title: "Acceso Controlado",
      description: "Solo personal autorizado puede acceder a tu información",
    },
    {
      icon: Clock,
      title: "Respuesta Rápida",
      description: "Atendemos tus solicitudes en máximo 72 horas",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Partículas de fondo */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [null, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 p-1 mr-6"
              >
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Fortaleza
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                  Digital
                </span>
              </h1>
            </div>

            <p className="text-xl text-gray-300 mb-4 max-w-3xl mx-auto">Política de Privacidad - GeekWear 🇲🇽</p>
            <p className="text-sm text-gray-500 mb-8">
              Última actualización: 25 de Octubre, 2023 | Desarrollado por equipo UPQROO
            </p>

            {/* Features de seguridad */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-xl p-4 border border-slate-700/50 group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 p-0.5 mb-3 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navegación lateral */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="sticky top-8"
              >
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-cyan-400" />
                    Navegación
                  </h3>
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <motion.a
                        key={section.id}
                        href={`#${section.id}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center p-3 rounded-xl hover:bg-slate-700/50 transition-all duration-300 group"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg bg-gradient-to-r ${section.color} p-0.5 mr-3 group-hover:scale-110 transition-transform duration-300`}
                        >
                          <div className="w-full h-full bg-slate-800 rounded-lg flex items-center justify-center">
                            <section.icon className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                          {section.title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.a>
                    ))}
                  </nav>
                </div>
              </motion.div>
            </div>

            {/* Contenido principal */}
            <div className="lg:col-span-3 space-y-12">
              {sections.map((section, sectionIndex) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: sectionIndex * 0.1 }}
                  className="relative"
                >
                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 relative overflow-hidden">
                    {/* Efecto de brillo */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${section.color}`} />

                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${section.color} p-0.5 mr-4`}>
                        <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                          <section.icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                    </div>

                    <div className="space-y-6">
                      {section.content.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: itemIndex * 0.1 }}
                          className="relative"
                        >
                          <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            {item.subtitle}
                          </h3>
                          <p className="text-gray-300 leading-relaxed pl-7">{item.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.section>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Información de contacto */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 text-center relative overflow-hidden"
          >
            {/* Efecto de alerta de seguridad */}
            <motion.div
              className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />

            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-yellow-400 mr-3" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Contáctanos
              </h2>
            </div>

            <p className="text-gray-300 mb-6">
              Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos:
            </p>

            <div className="bg-slate-700/50 rounded-2xl p-6 border border-slate-600/50">
              <h3 className="text-xl font-bold text-white mb-4">GeekWear - Equipo UPQROO 🇲🇽</h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <strong>Email:</strong> privacy@geekwear.com
                </p>
                <p>
                  <strong>Ubicación:</strong> Universidad Politécnica de Quintana Roo, Cancún, México
                </p>
                <p>
                  <strong>Equipo:</strong> Arian Aguilar, Axel Coutiño, Roberto Fierro, Christopher Ramon
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:shadow-2xl hover:shadow-cyan-500/25"
            >
              Contactar Equipo de Privacidad
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage
