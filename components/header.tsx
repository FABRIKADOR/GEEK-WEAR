"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Menu, X, Search, ChevronDown } from "lucide-react"
import { useCartStore } from "@/lib/cart"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase-client"
import { CartSidebar } from "./cart-sidebar"
import { useCartSidebar } from "@/hooks/use-cart-sidebar"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [categories, setCategories] = useState([])
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const pathname = usePathname()
  const router = useRouter()
  const cart = useCartStore((state) => state.cart)
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)
  const { openCart } = useCartSidebar()

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)

          // Verificar si el usuario es administrador
          const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

          setIsAdmin(profile?.role === "admin" || session.user.email === "hola@mail.com")
        } else {
          setUser(null)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Error checking user:", error)
      }
    }

    const fetchCategories = async () => {
      try {
        const { data } = await supabase.from("categories").select("id,name,slug").order("name")
        if (data) {
          setCategories(data)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    checkUser()
    fetchCategories()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user)

        // Verificar si el usuario es administrador
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

        setIsAdmin(profile?.role === "admin" || session.user.email === "hola@mail.com")
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAdmin(false)
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setIsAdmin(false)
      setIsProfileOpen(false)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleProfileClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsProfileOpen(!isProfileOpen)
  }

  const handleLinkClick = (href) => {
    setIsProfileOpen(false)
    router.push(href)
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="w-full max-w-full px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="font-bold text-lg sm:text-2xl text-grape flex-shrink-0">
              GeekWear
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-4 lg:space-x-6">
              <Link
                href="/"
                className={`text-gray-700 hover:text-grape transition-colors text-sm lg:text-base ${
                  pathname === "/" ? "font-semibold text-grape" : ""
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className={`text-gray-700 hover:text-grape transition-colors text-sm lg:text-base ${
                  pathname === "/productos" ? "font-semibold text-grape" : ""
                }`}
              >
                Productos
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center text-gray-700 hover:text-grape transition-colors text-sm lg:text-base ${
                      pathname.startsWith("/productos") && pathname.includes("category")
                        ? "font-semibold text-grape"
                        : ""
                    }`}
                  >
                    Categorías <ChevronDown className="ml-1 h-3 w-3 lg:h-4 lg:w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link href={`/productos?category=${category.id}`}>{category.name}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/about"
                className={`text-gray-700 hover:text-grape transition-colors text-sm lg:text-base ${
                  pathname === "/about" ? "font-semibold text-grape" : ""
                }`}
              >
                Sobre Nosotros
              </Link>
              <Link
                href="/contact"
                className={`text-gray-700 hover:text-grape transition-colors text-sm lg:text-base ${
                  pathname === "/contact" ? "font-semibold text-grape" : ""
                }`}
              >
                Contacto
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              <button className="text-gray-700 hover:text-grape transition-colors p-1">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <button onClick={openCart} className="relative p-1">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-grape transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center text-gray-700 hover:text-grape transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-grape focus:ring-opacity-50 rounded"
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-medium text-gray-900 text-sm">Mi Cuenta</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => handleLinkClick("/account/profile")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Perfil
                        </button>

                        <button
                          onClick={() => handleLinkClick("/account/orders")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Mis Pedidos
                        </button>

                        <button
                          onClick={() => handleLinkClick("/account/wishlist")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Lista de Deseos
                        </button>
                      </div>

                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                            Administración
                          </div>

                          <div className="py-1">
                            <button
                              onClick={() => handleLinkClick("/admin")}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Panel de Control
                            </button>

                            <button
                              onClick={() => handleLinkClick("/admin/productos")}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Productos
                            </button>

                            <button
                              onClick={() => handleLinkClick("/admin/categorias")}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Categorías
                            </button>

                            <button
                              onClick={() => handleLinkClick("/admin/franquicias")}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Franquicias
                            </button>

                            <button
                              onClick={() => handleLinkClick("/admin/orders")}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              Pedidos
                            </button>
                          </div>
                        </>
                      )}

                      <div className="border-t border-gray-100 my-1"></div>
                      <div className="py-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-grape transition-colors p-1 h-auto">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
              )}

              {/* Mobile menu button */}
              <button className="md:hidden text-gray-700 hover:text-grape transition-colors p-1" onClick={toggleMenu}>
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-50 md:hidden overflow-y-auto">
            <div className="w-full px-4 py-4">
              <div className="flex justify-between items-center mb-8">
                <Link href="/" className="font-bold text-2xl text-grape" onClick={closeMenu}>
                  GeekWear
                </Link>
                <button className="text-gray-700 hover:text-grape transition-colors" onClick={closeMenu}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <nav className="flex flex-col space-y-6 text-lg">
                <Link
                  href="/"
                  className={`text-gray-700 hover:text-grape transition-colors ${
                    pathname === "/" ? "font-semibold text-grape" : ""
                  }`}
                  onClick={closeMenu}
                >
                  Inicio
                </Link>
                <Link
                  href="/productos"
                  className={`text-gray-700 hover:text-grape transition-colors ${
                    pathname === "/productos" ? "font-semibold text-grape" : ""
                  }`}
                  onClick={closeMenu}
                >
                  Productos
                </Link>
                <div>
                  <h3
                    className={`text-gray-700 font-medium mb-2 ${
                      pathname.startsWith("/productos") && pathname.includes("category")
                        ? "font-semibold text-grape"
                        : ""
                    }`}
                  >
                    Categorías
                  </h3>
                  <div className="pl-4 space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/productos?category=${category.id}`}
                        className="block text-gray-600 hover:text-grape transition-colors"
                        onClick={closeMenu}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  href="/about"
                  className={`text-gray-700 hover:text-grape transition-colors ${
                    pathname === "/about" ? "font-semibold text-grape" : ""
                  }`}
                  onClick={closeMenu}
                >
                  Sobre Nosotros
                </Link>
                <Link
                  href="/contact"
                  className={`text-gray-700 hover:text-grape transition-colors ${
                    pathname === "/contact" ? "font-semibold text-grape" : ""
                  }`}
                  onClick={closeMenu}
                >
                  Contacto
                </Link>

                {isAdmin && (
                  <div>
                    <h3 className="text-gray-700 font-medium mb-2">Administración</h3>
                    <div className="pl-4 space-y-2">
                      <Link
                        href="/admin"
                        className="block text-gray-600 hover:text-grape transition-colors"
                        onClick={closeMenu}
                      >
                        Panel de Control
                      </Link>
                      <Link
                        href="/admin/productos"
                        className="block text-gray-600 hover:text-grape transition-colors"
                        onClick={closeMenu}
                      >
                        Productos
                      </Link>
                      <Link
                        href="/admin/categorias"
                        className="block text-gray-600 hover:text-grape transition-colors"
                        onClick={closeMenu}
                      >
                        Categorías
                      </Link>
                      <Link
                        href="/admin/franquicias"
                        className="block text-gray-600 hover:text-grape transition-colors"
                        onClick={closeMenu}
                      >
                        Franquicias
                      </Link>
                      <Link
                        href="/admin/orders"
                        className="block text-gray-600 hover:text-grape transition-colors"
                        onClick={closeMenu}
                      >
                        Pedidos
                      </Link>
                    </div>
                  </div>
                )}

                {user ? (
                  <>
                    <Link
                      href="/account/profile"
                      className="block py-2 text-gray-700 hover:text-grape transition-colors"
                      onClick={closeMenu}
                    >
                      Mi Perfil
                    </Link>
                    <button
                      className="text-left text-gray-700 hover:text-grape transition-colors"
                      onClick={() => {
                        handleSignOut()
                        closeMenu()
                      }}
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-grape transition-colors"
                    onClick={closeMenu}
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  )
}
