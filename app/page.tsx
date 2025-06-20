import { Suspense } from "react"
import Link from "next/link"
import { getProducts, getVisibleCategories } from "@/lib/database"
import HeroSection from "@/components/hero-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Shield, Headphones, Zap, Heart, Gamepad2, Monitor, Smartphone, Trophy, Crown, Gift } from "lucide-react"
import FeaturedProducts from "@/components/featured-products"
import ProductCard from "@/components/product-card"

export default async function HomePage() {
  // Obtener SOLO productos destacados directamente (solo de categorías visibles)
  const { data: featuredProducts } = await getProducts(50, 1, undefined, undefined, true) // featured: true
  console.log("Featured products from database:", featuredProducts.length)

  // Obtener productos recientes (sin filtro de destacados, solo de categorías visibles)
  const { data: recentProducts } = await getProducts(8, 1, undefined, undefined, false) // featured: false o undefined

  // Obtener solo categorías visibles
  const categories = await getVisibleCategories()
  console.log("Visible categories:", categories.length)

  return (
    <main className="bg-dark-slate">
      <HeroSection />

      {/* Categorías Principales */}
      <section className="py-16 bg-gradient-to-b from-dark-slate to-midnight-blue">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Explora Nuestro Arsenal</h2>
            <p className="text-xl text-gray-300">Encuentra exactamente lo que necesitas para dominar</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                name: "Juegos AAA",
                icon: <Gamepad2 className="w-8 h-8" />,
                color: "from-cyber-blue to-neon-green",
                count: "500+",
                slug: "aaa-games",
              },
              {
                name: "Membresías",
                icon: <Crown className="w-8 h-8" />,
                color: "from-electric-purple to-cyber-blue",
                count: "25+",
                slug: "memberships",
              },
              {
                name: "DLCs",
                icon: <Gift className="w-8 h-8" />,
                color: "from-neon-green to-electric-purple",
                count: "200+",
                slug: "dlc",
              },
              {
                name: "Indie Games",
                icon: <Star className="w-8 h-8" />,
                color: "from-gaming-orange to-plasma-pink",
                count: "150+",
                slug: "indie",
              },
              {
                name: "PC Gaming",
                icon: <Monitor className="w-8 h-8" />,
                color: "from-cyber-blue to-gaming-orange",
                count: "300+",
                slug: "pc",
              },
              {
                name: "Mobile",
                icon: <Smartphone className="w-8 h-8" />,
                color: "from-neon-green to-plasma-pink",
                count: "75+",
                slug: "mobile",
              },
              {
                name: "Retro",
                icon: <Trophy className="w-8 h-8" />,
                color: "from-electric-purple to-neon-green",
                count: "100+",
                slug: "retro",
              },
              {
                name: "VR Games",
                icon: <Zap className="w-8 h-8" />,
                color: "from-gaming-orange to-cyber-blue",
                count: "50+",
                slug: "vr",
              },
            ].map((category, index) => (
              <Link key={index} href={`/products?q=${category.slug}`} className="group">
                <Card className="h-full hover:shadow-lg hover:shadow-cyber-blue/20 transition-all duration-300 group-hover:scale-105 bg-midnight-blue/50 border-cyber-blue/20 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-cyber-blue transition-colors text-white">
                      {category.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-cyber-blue/20 text-cyber-blue border-cyber-blue/30"
                    >
                      {category.count} productos
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16 bg-gradient-to-r from-electric-purple via-cyber-blue to-neon-green">
        <div className="container mx-auto px-4">
          <FeaturedProducts products={featuredProducts} />
        </div>
      </section>

      {/* Plataformas Populares */}
      <section className="py-16 bg-midnight-blue">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Plataformas Populares</h2>
            <p className="text-xl text-gray-300">Juega en tu plataforma favorita</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { name: "Steam", logo: "🎮", bg: "bg-cyber-blue", search: "steam" },
              { name: "Epic Games", logo: "🚀", bg: "bg-neon-green", search: "epic" },
              { name: "PlayStation", logo: "🎯", bg: "bg-electric-purple", search: "playstation" },
              { name: "Xbox", logo: "🎪", bg: "bg-gaming-orange", search: "xbox" },
              { name: "Nintendo", logo: "🎨", bg: "bg-plasma-pink", search: "nintendo" },
              { name: "Mobile", logo: "📱", bg: "bg-volt-yellow", search: "mobile" },
            ].map((platform, index) => (
              <Link key={index} href={`/products?q=${platform.search}`} className="group">
                <Card className="hover:shadow-lg hover:shadow-cyber-blue/20 transition-all duration-300 group-hover:scale-105 bg-dark-slate/50 border-cyber-blue/20 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-full ${platform.bg} flex items-center justify-center text-white text-xl shadow-lg`}
                    >
                      {platform.logo}
                    </div>
                    <h3 className="font-medium group-hover:text-cyber-blue transition-colors text-white">
                      {platform.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ofertas Especiales */}
      <section className="py-16 bg-gradient-to-r from-gaming-orange to-plasma-pink">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ofertas Épicas</h2>
            <p className="text-xl text-white/80">¡No te pierdas estas promociones legendarias!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-volt-yellow animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Flash Sale</h3>
                <p className="mb-4">70% OFF en juegos seleccionados</p>
                <Link href="/products?q=sale&discount=true">
                  <Button variant="secondary" className="bg-white text-gaming-orange hover:bg-gray-100 font-bold">
                    Ver Ofertas
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-plasma-pink animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Bundle Gamer</h3>
                <p className="mb-4">Compra 2 juegos y llévate el 3ro gratis</p>
                <Link href="/products?bundle=true">
                  <Button variant="secondary" className="bg-white text-gaming-orange hover:bg-gray-100 font-bold">
                    Explorar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Crown className="w-12 h-12 mx-auto mb-4 text-volt-yellow animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Membresía Premium</h3>
                <p className="mb-4">Acceso ilimitado por solo $9.99/mes</p>
                <Link href="/products?premium=true">
                  <Button variant="secondary" className="bg-white text-gaming-orange hover:bg-gray-100 font-bold">
                    Suscribirse
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Últimos Productos */}
      <section className="py-16 bg-dark-slate">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2 text-white">Últimos Lanzamientos</h2>
              <p className="text-xl text-gray-300">Descubre los juegos más recientes</p>
            </div>
            <Link href="/products">
              <Button size="lg" className="bg-cyber-blue hover:bg-neon-green text-dark-slate font-bold">
                Ver Todos
              </Button>
            </Link>
          </div>

          <Suspense fallback={<div className="text-center py-12 text-gray-300">Cargando juegos...</div>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                <div className="col-span-full text-center py-8 text-gray-300">No hay juegos disponibles</div>
              )}
            </div>
          </Suspense>
        </div>
      </section>

      {/* Por Qué Elegirnos */}
      <section className="py-16 bg-midnight-blue">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">¿Por Qué GameVault?</h2>
            <p className="text-xl text-gray-300">La mejor experiencia gaming garantizada</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyber-blue to-neon-green rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Entrega Instantánea</h3>
              <p className="text-gray-300">Recibe tus juegos al instante por email</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-neon-green to-electric-purple rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">100% Seguro</h3>
              <p className="text-gray-300">Claves originales y verificadas</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-electric-purple to-gaming-orange rounded-full flex items-center justify-center shadow-lg">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Soporte 24/7</h3>
              <p className="text-gray-300">Atención gamer siempre disponible</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gaming-orange to-plasma-pink rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Precios Épicos</h3>
              <p className="text-gray-300">Los mejores precios del mercado</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-deep-space to-electric-purple">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">¡Únete a la Elite Gamer!</h2>
            <p className="text-xl text-white/80 mb-8">
              Sé el primero en conocer nuestras ofertas exclusivas y nuevos lanzamientos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email de gamer..."
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-cyber-blue bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
              />
              <Button className="bg-cyber-blue text-dark-slate hover:bg-neon-green font-bold px-8">Suscribirse</Button>
            </div>
            <p className="text-white/60 text-sm mt-4">
              Sin spam, solo contenido gaming épico. Puedes darte de baja cuando quieras.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
