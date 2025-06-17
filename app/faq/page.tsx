"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search, Zap, Shield, Globe, Users, HelpCircle, Star, MessageCircle } from "lucide-react"

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const categories = [
    { id: "all", name: "Todas", icon: Globe, color: "from-cyan-500 to-blue-500" },
    { id: "orders", name: "Pedidos", icon: Zap, color: "from-green-500 to-emerald-500" },
    { id: "shipping", name: "Envíos", icon: MessageCircle, color: "from-purple-500 to-pink-500" },
    { id: "returns", name: "Devoluciones", icon: Shield, color: "from-orange-500 to-red-500" },
    { id: "account", name: "Cuenta", icon: Users, color: "from-indigo-500 to-purple-500" },
  ]

  const faqs = [
    {
      id: 1,
      category: "returns",
      question: "¿Cuál es su política de devoluciones?",
      answer:
        "Aceptamos devoluciones dentro de los 30 días posteriores a la recepción del pedido. El artículo debe estar en su estado original y con todas las etiquetas adjuntas. Nuestro equipo UPQROO procesa las devoluciones en 24-48 horas.",
      popular: true,
    },
    {
      id: 2,
      category: "shipping",
      question: "¿Cuánto tiempo tarda el envío?",
      answer:
        "El tiempo de envío varía según su ubicación. Desde nuestro centro de distribución en Cancún, generalmente los pedidos se entregan dentro de 3 a 7 días hábiles en México, y 7-14 días internacionalmente.",
      popular: true,
    },
    {
      id: 3,
      category: "shipping",
      question: "¿Envían internacionalmente?",
      answer:
        "Sí, enviamos a la mayoría de los países del mundo desde nuestra base en Cancún, México. Los gastos de envío internacional se calcularán durante el proceso de pago con tecnología de última generación.",
      popular: false,
    },
    {
      id: 4,
      category: "orders",
      question: "¿Cómo puedo rastrear mi pedido?",
      answer:
        "Una vez que su pedido haya sido enviado, recibirá un correo electrónico con un número de seguimiento cuántico. Puede utilizar este número para rastrear su pedido en tiempo real a través de nuestro sistema avanzado.",
      popular: true,
    },
    {
      id: 5,
      category: "orders",
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos tarjetas de crédito (Visa, Mastercard, American Express), PayPal, Apple Pay y transferencias bancarias. Todos los pagos están protegidos con encriptación de nivel militar.",
      popular: false,
    },
    {
      id: 6,
      category: "account",
      question: "¿Cómo creo una cuenta?",
      answer:
        'Crear una cuenta es súper fácil. Solo haz clic en "Registrarse" y sigue los pasos. Tu cuenta te dará acceso a funciones exclusivas y un seguimiento completo de tus pedidos.',
      popular: false,
    },
    {
      id: 7,
      category: "account",
      question: "¿Puedo modificar mi pedido después de realizarlo?",
      answer:
        "Puedes modificar tu pedido dentro de las primeras 2 horas después de realizarlo. Después de ese tiempo, nuestro sistema automatizado ya habrá procesado el pedido para envío rápido.",
      popular: false,
    },
    {
      id: 8,
      category: "shipping",
      question: "¿Ofrecen envío express?",
      answer:
        "Sí, ofrecemos envío express de 24-48 horas dentro de México. Este servicio premium está disponible para pedidos realizados antes de las 2:00 PM hora de Cancún.",
      popular: false,
    },
  ]

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const popularFAQs = faqs.filter((faq) => faq.popular)

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
              duration: 4 + Math.random() * 2,
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Centro de
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Conocimiento
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Encuentra respuestas instantáneas a todas tus preguntas sobre GeekWear 🇲🇽
            </p>

            {/* Búsqueda */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-2xl mx-auto mb-12"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar en la base de conocimiento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            Categorías de Ayuda
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(category.id)}
                className={`relative p-6 rounded-2xl border transition-all duration-300 group ${
                  activeCategory === category.id
                    ? "bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-cyan-500"
                    : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} p-0.5 mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-white font-semibold text-center">{category.name}</h3>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas Populares */}
      {activeCategory === "all" && (
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
            >
              ⭐ Preguntas Más Populares
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden group cursor-pointer"
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                >
                  <div className="absolute top-4 right-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 pr-8">{faq.question}</h3>
                  <AnimatePresence>
                    {openFAQ === faq.id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-300 text-sm"
                      >
                        {faq.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lista de FAQs */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            {activeCategory === "all"
              ? "Todas las Preguntas"
              : `Preguntas sobre ${categories.find((c) => c.id === activeCategory)?.name}`}
          </motion.h2>

          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors duration-300"
                >
                  <div className="flex items-center space-x-4">
                    {faq.popular && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
                    <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  </div>
                  <motion.div animate={{ rotate: openFAQ === faq.id ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFAQ === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6"
                    >
                      <div className="border-t border-slate-700/50 pt-4">
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-500">Intenta con otros términos de búsqueda o categoría</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50"
          >
            <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ¿No encontraste lo que buscabas?
            </h3>
            <p className="text-xl text-gray-300 mb-8">
              Nuestro equipo UPQROO está listo para ayudarte 24/7 desde Cancún 🇲🇽
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:shadow-2xl hover:shadow-cyan-500/25"
            >
              Contactar Soporte
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FAQPage
