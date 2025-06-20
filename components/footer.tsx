"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Gamepad2, Youtube, Twitch } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase-client"

export default function Footer() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await supabase.from("categories").select("id,name,slug").order("name").limit(4)
        if (data) {
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <footer className="bg-gradient-to-r from-deep-space to-dark-slate text-white border-t border-cyber-blue/20">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gamepad2 className="h-8 w-8 text-cyber-blue" />
              <h3 className="text-xl font-bold text-cyber-blue">GameVault</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Tu arsenal gaming definitivo. Juegos, membresías y contenido premium al mejor precio.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-cyber-blue transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-neon-green transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-electric-purple transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gaming-orange transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-plasma-pink transition-colors">
                <Twitch className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-neon-green">Categorías</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="text-gray-300 hover:text-cyber-blue transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-neon-green">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-cyber-blue transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-cyber-blue transition-colors">
                  Soporte
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-cyber-blue transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-cyber-blue transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-neon-green">Contacto</h3>
            <address className="not-italic text-gray-300 space-y-2">
              <p>Gaming Center 123</p>
              <p>Ciudad Gaming, CP 12345</p>
              <p>Email: support@gamevault.com</p>
              <p>Teléfono: (123) 456-GAME</p>
            </address>
          </div>
        </div>

        <div className="border-t border-cyber-blue/20 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} GameVault. Todos los derechos reservados. Hecho para gamers, por gamers.
          </p>
        </div>
      </div>
    </footer>
  )
}
