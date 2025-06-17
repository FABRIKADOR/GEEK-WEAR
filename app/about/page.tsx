"use client"

import { useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Rocket, Users, Heart, Zap, Star, Trophy, Target, Shield, Sparkles, Globe, Code, Gamepad2 } from "lucide-react"

const AboutPage = () => {
  const [currentYear] = useState(new Date().getFullYear())
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const timelineRef = useRef(null)
  const teamRef = useRef(null)

  const isHeroInView = useInView(heroRef, { once: true })
  const isStatsInView = useInView(statsRef, { once: true })
  const isTimelineInView = useInView(timelineRef, { once: true })
  const isTeamInView = useInView(teamRef, { once: true })

  // Animated counter hook
  const useCounter = (end: number, duration = 2000) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isStatsInView) return

      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        setCount(Math.floor(progress * end))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }, [end, duration, isStatsInView])

    return count
  }

  const stats = [
    { label: "Productos Únicos", value: useCounter(500), suffix: "+", icon: Sparkles },
    { label: "Clientes Felices", value: useCounter(10000), suffix: "+", icon: Heart },
    { label: "Países Atendidos", value: useCounter(25), suffix: "+", icon: Globe },
    { label: "Años de Experiencia", value: useCounter(currentYear - 2020), suffix: "", icon: Trophy },
  ]

  const timeline = [
    {
      year: "2020",
      title: "El Comienzo",
      description: "Fundación de GeekWear con la visión de revolucionar la moda geek",
      icon: Rocket,
    },
    {
      year: "2021",
      title: "Expansión Digital",
      description: "Lanzamiento de nuestra plataforma online y primeras colaboraciones",
      icon: Code,
    },
    {
      year: "2022",
      title: "Comunidad Global",
      description: "Alcanzamos 5,000 clientes y expandimos a 15 países",
      icon: Users,
    },
    {
      year: "2023",
      title: "Innovación Continua",
      description: "Nuevas líneas de productos y tecnología de personalización",
      icon: Zap,
    },
    {
      year: "2024",
      title: "El Futuro es Ahora",
      description: "Liderando la revolución de la moda geek con IA y realidad aumentada",
      icon: Star,
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Calidad Premium",
      description: "Materiales de primera calidad que duran años",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Sparkles,
      title: "Diseños Únicos",
      description: "Creaciones originales que expresan tu personalidad",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Zap,
      title: "Envío Ultrarrápido",
      description: "Recibe tus productos en tiempo récord",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Shield,
      title: "Soporte 24/7",
      description: "Estamos aquí cuando nos necesites",
      color: "from-orange-500 to-red-500",
    },
  ]

  const team = [
    {
      name: "Arian Aguilar",
      role: "Líder del Proyecto & Arquitecto Principal",
      description: "Desarrollador principal y visionario del proyecto. Ingeniero en Software de la UPQROO, Cancún",
      avatar: "/placeholder.svg?height=200&width=200&query=professional tech leader mexican developer",
    },
    {
      name: "Axel Coutiño",
      role: "Co-fundador & Estratega",
      description:
        "Especialista en experiencia de usuario y estrategia de producto. Ingeniero en Software de la UPQROO, Cancún",
      avatar: "/placeholder.svg?height=200&width=200&query=professional developer mexican engineer",
    },
    {
      name: "Roberto Fierro",
      role: "Director Creativo",
      description:
        "Artista digital especializado en cultura geek y diseño visual. Ingeniero en Software de la UPQROO, Cancún",
      avatar: "/placeholder.svg?height=200&width=200&query=creative director mexican developer",
    },
    {
      name: "Christopher Ramon",
      role: "Ingeniero de Software",
      description:
        "Desarrollador full-stack apasionado por la innovación tecnológica. Ingeniero en Software de la UPQROO, Cancún",
      avatar: "/placeholder.svg?height=200&width=200&query=software engineer mexican developer",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url(/images/hero-about.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-blue-900/80 to-cyan-900/90" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              GeekWear
            </h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-300"
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Donde la pasión geek se convierte en moda épica
            </motion.p>
            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1 }}
            >
              <Gamepad2 className="w-8 h-8 text-purple-400 animate-pulse" />
              <Code className="w-8 h-8 text-blue-400 animate-pulse" />
              <Star className="w-8 h-8 text-cyan-400 animate-pulse" />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="relative mb-4">
                  <stat.icon className="w-12 h-12 mx-auto text-purple-400 mb-4" />
                  <motion.div
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                    animate={isStatsInView ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 + 1 }}
                  >
                    {stat.value}
                    {stat.suffix}
                  </motion.div>
                </div>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section ref={timelineRef} className="py-20 bg-black relative">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            Nuestra Épica Historia
          </motion.h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500" />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className={`flex items-center mb-16 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={isTimelineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.3 }}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <item.icon className="w-6 h-6 text-purple-400 mr-3" />
                      <span className="text-2xl font-bold text-purple-400">{item.year}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="relative z-10">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full border-4 border-black" />
                </div>

                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        className="py-20 relative"
        style={{
          backgroundImage: "url(/images/mission-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-blue-900/90" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            Nuestra Misión Galáctica
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Crear la ropa más épica del universo para geeks, gamers y entusiastas de la cultura pop. Desarrollado por un
            talentoso equipo de ingenieros en software mexicanos de Cancún, egresados de la UPQROO. Cada prenda es una
            obra de arte que cuenta tu historia y expresa tu pasión por lo extraordinario.
          </motion.p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            ¿Por qué elegir GeekWear?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl border border-gray-700 group-hover:border-purple-500/50 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-purple-400 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section
        ref={teamRef}
        className="py-20 relative"
        style={{
          backgroundImage: "url(/images/team-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-gray-900/80" />
        <div className="relative z-10 container mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            Nuestro Equipo Legendario 🇲🇽
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="group text-center"
                initial={{ opacity: 0, y: 50, rotateY: 90 }}
                animate={isTeamInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-6 rounded-xl border border-gray-700 group-hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm h-80 flex flex-col justify-between">
                  <div className="relative mb-6">
                    <img
                      src={member.avatar || "/placeholder.svg"}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto border-4 border-purple-500/30 group-hover:border-purple-500 transition-all duration-300"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 group-hover:from-purple-500/40 group-hover:to-cyan-500/40 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-purple-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 via-blue-900 to-cyan-900">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-8 text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            ¿Listo para unirte a la revolución?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Descubre nuestra colección épica y encuentra la prenda perfecta que exprese tu pasión geek
          </motion.p>
          <motion.button
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explorar Productos
          </motion.button>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
