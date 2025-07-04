"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
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
    <footer className="bg-gradient-to-r from-grape to-dark-blue text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">GeekWear</h3>
            <p className="text-gray-200 mb-4">Tu tienda de ropa y accesorios para verdaderos fanáticos.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-vivid-sky-blue transition-colors">
                <Facebook />
              </a>
              <a href="#" className="text-white hover:text-vivid-sky-blue transition-colors">
                <Instagram />
              </a>
              <a href="#" className="text-white hover:text-vivid-sky-blue transition-colors">
                <Twitter />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="text-gray-200 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-200 hover:text-white transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-200 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-200 hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-200 hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <address className="not-italic text-gray-200 space-y-2">
              <p>Calle Falsa 123</p>
              <p>Ciudad Ejemplo, CP 12345</p>
              <p>Email: info@geekwear.com</p>
              <p>Teléfono: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} GeekWear. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
