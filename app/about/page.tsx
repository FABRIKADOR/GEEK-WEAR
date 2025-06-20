"use client"

import { useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import {
  Rocket,
  Users,
  Zap,
  Star,
  Trophy,
  Target,
  Shield,
  Sparkles,
  Globe,
  Code,
  Gamepad2,
  Monitor,
  Headphones,
} from "lucide-react"

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
    { label: "Juegos Únicos", value: useCounter(2500), suffix: "+", icon: Gamepad2 },
    { label: "Gamers Activos", value: useCounter(50000), suffix: "+", icon: Users },
    { label: "Plataformas", value: useCounter(15), suffix: "+", icon: Monitor },
    { label: "Años Online", value: useCounter(currentYear - 2019), suffix: "", icon: Trophy },
  ]

  const timeline = [
    {
      year: "2019",
      title: "El Spawn",
      description: "Fundación de GameVault con la misión de democratizar el gaming digital",
      icon: Rocket,
    },
    {
      year: "2020",
      title: "Level Up",
      description: "Lanzamiento de nuestra plataforma y primeras alianzas con desarrolladores indie",
      icon: Code,
    },
    {
      year: "2021",
      title: "Multijugador Global",
      description: "Alcanzamos 10,000 usuarios y expandimos a 20 países",
      icon: Globe,
    },
    {
      year: "2022",
      title: "Next-Gen Features",
      description: "Introducimos membresías premium y contenido exclusivo",
      icon: Zap,
    },
    {
      year: "2023",
      title: "Gaming Revolution",
      description: "Liderando el futuro del gaming digital con IA y cloud gaming",
      icon: Star,
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Calidad AAA",
      description: "Solo los mejores juegos y contenido premium",
      color: "from-cyber-blue to-neon-green",
    },
    {
      icon: Sparkles,
      title: "Experiencia Única",
      description: "Interfaz diseñada por y para gamers",
      color: "from-electric-purple to-plasma-pink",
    },
    {
      icon: Zap,
      title: "Descarga Instantánea",
      description: "Acceso inmediato a tu biblioteca digital",
      color: "from-neon-green to-gaming-orange",
    },
    {
      icon: Shield,
      title: "Soporte 24/7",
      description: "Equipo de gamers para gamers, siempre disponible",
      color: "from-gaming-orange to-cyber-blue",
    },
  ]

  const team = [
    {
      name: "Carlos Catalán Maya",
      role: "Founder & CEO Gaming Visionary",
      description:
        "Fundador y visionario principal de GameVault. Especialista en desarrollo gaming y estrategia digital. Gaming Engineer de la UPQROO, Cancún",
      avatar: "/placeholder.svg?height=200&width=200",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-space via-dark-slate to-midnight-blue text-white overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=1080&width=1920&query=gaming setup with multiple monitors neon lights)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-deep-space/90 via-dark-slate/80 to-midnight-blue/90" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyber-blue rounded-full"
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
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyber-blue via-neon-green to-electric-purple bg-clip-text text-transparent">
              GameVault
            </h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-300"
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Donde la pasión gamer se convierte en experiencias épicas
            </motion.p>
            <motion.div
              className="flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 1 }}
            >
              <Gamepad2 className="w-8 h-8 text-cyber-blue animate-pulse" />
              <Monitor className="w-8 h-8 text-neon-green animate-pulse" />
              <Headphones className="w-8 h-8 text-electric-purple animate-pulse" />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-6 h-10 border-2 border-cyber-blue rounded-full flex justify-center">
            <div className="w-1 h-3 bg-cyber-blue rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-r from-dark-slate to-midnight-blue">
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
                  <stat.icon className="w-12 h-12 mx-auto text-cyber-blue mb-4" />
                  <motion.div
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyber-blue to-neon-green bg-clip-text text-transparent"
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
      <section ref={timelineRef} className="py-20 bg-deep-space relative">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyber-blue to-neon-green bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            Nuestra Historia Gaming
          </motion.h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyber-blue to-neon-green" />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className={`flex items-center mb-16 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                animate={isTimelineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.3 }}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                  <div className="bg-gradient-to-r from-midnight-blue to-dark-slate p-6 rounded-lg border border-cyber-blue/30 hover:border-cyber-blue/60 transition-all duration-300">
                    <div className="flex items-center mb-3">
                      <item.icon className="w-6 h-6 text-cyber-blue mr-3" />
                      <span className="text-2xl font-bold text-cyber-blue">{item.year}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="relative z-10">
                  <div className="w-4 h-4 bg-gradient-to-r from-cyber-blue to-neon-green rounded-full border-4 border-deep-space" />
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
          backgroundImage: "url(/placeholder.svg?height=800&width=1600&query=futuristic gaming room with rgb lighting)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-deep-space/90 to-midnight-blue/90" />
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            Nuestra Misión Gaming
          </motion.h2>
          <motion.p
            className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Crear la plataforma gaming más épica del universo para jugadores, streamers y entusiastas de los
            videojuegos. Desarrollado por un talentoso equipo de ingenieros gamers mexicanos de Cancún, egresados de la
            UPQROO. Cada juego es una aventura que cuenta tu historia y expresa tu pasión por lo extraordinario.
          </motion.p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-b from-dark-slate to-deep-space">
        <div className="container mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyber-blue to-neon-green bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            ¿Por qué elegir GameVault?
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
                <div className="bg-gradient-to-br from-midnight-blue to-dark-slate p-8 rounded-xl border border-cyber-blue/30 group-hover:border-cyber-blue/50 transition-all duration-300 h-full">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-r ${value.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-cyber-blue transition-colors duration-300">
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
          backgroundImage:
            "url(/placeholder.svg?height=800&width=1600&query=gaming team workspace with multiple screens)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-deep-space/80 to-dark-slate/80" />
        <div className="relative z-10 container mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyber-blue to-neon-green bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1 }}
          >
            Nuestro Squad Legendario 🇲🇽
          </motion.h2>

          <div className="flex justify-center">
            <div className="max-w-sm">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  className="group text-center"
                  initial={{ opacity: 0, y: 50, rotateY: 90 }}
                  animate={isTeamInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="bg-gradient-to-br from-midnight-blue/90 to-dark-slate/90 p-6 rounded-xl border border-cyber-blue/30 group-hover:border-cyber-blue/50 transition-all duration-300 backdrop-blur-sm h-80 flex flex-col justify-between">
                    <div className="relative mb-6">
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto border-4 border-cyber-blue/30 group-hover:border-cyber-blue transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber-blue/20 to-neon-green/20 group-hover:from-cyber-blue/40 group-hover:to-neon-green/40 transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-cyber-blue transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-cyber-blue font-medium mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                      {member.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-deep-space via-midnight-blue to-dark-slate">
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-8 text-white"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            ¿Listo para el siguiente nivel?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Descubre nuestra biblioteca épica y encuentra el juego perfecto que exprese tu pasión gamer
          </motion.p>
          <motion.button
            className="bg-gradient-to-r from-cyber-blue to-neon-green text-dark-slate px-8 py-4 rounded-full font-bold text-lg hover:from-neon-green hover:to-cyber-blue transition-all duration-300 transform hover:scale-105"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explorar Juegos
          </motion.button>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
