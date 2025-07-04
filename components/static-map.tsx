"use client"

import { motion } from "framer-motion"
import { MapPin, Navigation, Phone, Clock, ExternalLink } from "lucide-react"

interface StaticMapProps {
  className?: string
}

export function StaticMap({ className = "w-full h-96 rounded-2xl" }: StaticMapProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className={`${className} relative overflow-hidden border border-slate-700/50`}>
        {/* Iframe de Google Maps que no requiere API key */}
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
  )
}

export default StaticMap
