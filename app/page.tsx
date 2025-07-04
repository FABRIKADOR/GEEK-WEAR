import { Suspense } from "react"
import Link from "next/link"
import { getProducts, getCategories } from "@/lib/database"
import HeroSection from "@/components/hero-section"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Truck, Shield, Headphones, Zap, Heart } from "lucide-react"
import FeaturedProducts from "@/components/featured-products"
import ProductCard from "@/components/product-card"

export default async function HomePage() {
  // Obtener SOLO productos destacados directamente
  const { data: featuredProducts } = await getProducts(50, 1, undefined, undefined, true) // featured: true
  console.log("Featured products from database:", featuredProducts.length)

  // Obtener productos recientes (sin filtro de destacados)
  const { data: recentProducts } = await getProducts(8, 1, undefined, undefined, false) // featured: false o undefined

  // Obtener categorías
  const categories = await getCategories()

  return (
    <main>
      <HeroSection />

      {/* Categorías Principales */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Explora Nuestras Categorías</h2>
            <p className="text-xl text-muted-foreground">Encuentra exactamente lo que buscas</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Playeras", icon: "👕", color: "from-rose to-fandango", count: "120+", slug: "playeras" },
              { name: "Hoodies", icon: "🧥", color: "from-grape to-dark-blue", count: "85+", slug: "hoodies" },
              { name: "Accesorios", icon: "🎒", color: "from-neon-blue to-grape", count: "200+", slug: "accesorios" },
              { name: "Figuras", icon: "🎮", color: "from-fandango to-rose", count: "150+", slug: "figuras" },
              { name: "Posters", icon: "🖼️", color: "from-dark-blue to-neon-blue", count: "300+", slug: "posters" },
              { name: "Tazas", icon: "☕", color: "from-rose to-grape", count: "75+", slug: "tazas" },
              { name: "Stickers", icon: "✨", color: "from-neon-blue to-fandango", count: "500+", slug: "stickers" },
              { name: "Llaveros", icon: "🔑", color: "from-grape to-rose", count: "90+", slug: "llaveros" },
            ].map((category, index) => (
              <Link key={index} href={`/products?q=${category.slug}`} className="group">
                <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-2xl`}
                    >
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
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
      <section className="py-16 bg-gradient-to-r from-grape to-dark-blue">
        <div className="container mx-auto px-4">
          <FeaturedProducts products={featuredProducts} />
        </div>
      </section>

      {/* Franquicias Populares */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Franquicias Populares</h2>
            <p className="text-xl text-muted-foreground">Tus universos favoritos en un solo lugar</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { name: "Marvel", logo: "🦸‍♂️", bg: "bg-red-500", search: "marvel" },
              { name: "DC Comics", logo: "🦇", bg: "bg-blue-600", search: "dc" },
              { name: "Star Wars", logo: "⭐", bg: "bg-yellow-500", search: "star wars" },
              { name: "Anime", logo: "🎌", bg: "bg-pink-500", search: "anime" },
              { name: "Gaming", logo: "🎮", bg: "bg-purple-500", search: "gaming" },
              { name: "Disney", logo: "🏰", bg: "bg-blue-400", search: "disney" },
            ].map((franchise, index) => (
              <Link key={index} href={`/products?q=${franchise.search}`} className="group">
                <Card className="hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-full ${franchise.bg} flex items-center justify-center text-white text-xl`}
                    >
                      {franchise.logo}
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{franchise.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ofertas Especiales */}
      <section className="py-16 bg-gradient-to-r from-fandango to-rose">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Ofertas Especiales</h2>
            <p className="text-xl text-white/80">¡No te pierdas estas increíbles promociones!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-xl font-bold mb-2">Flash Sale</h3>
                <p className="mb-4">50% OFF en playeras seleccionadas</p>
                <Link href="/products?q=playeras&sale=true">
                  <Button variant="secondary" className="bg-white text-fandango hover:bg-gray-100">
                    Ver Ofertas
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-pink-300" />
                <h3 className="text-xl font-bold mb-2">Combo Geek</h3>
                <p className="mb-4">Compra 2 productos y llévate el 3ro gratis</p>
                <Link href="/products?combo=true">
                  <Button variant="secondary" className="bg-white text-fandango hover:bg-gray-100">
                    Explorar
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-6 text-center">
                <Truck className="w-12 h-12 mx-auto mb-4 text-green-300" />
                <h3 className="text-xl font-bold mb-2">Envío Gratis</h3>
                <p className="mb-4">En compras mayores a $50</p>
                <Link href="/products?free_shipping=true">
                  <Button variant="secondary" className="bg-white text-fandango hover:bg-gray-100">
                    Comprar Ahora
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Últimos Productos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Últimos Productos</h2>
              <p className="text-xl text-muted-foreground">Descubre las novedades más recientes</p>
            </div>
            <Link href="/products">
              <Button size="lg" className="bg-grape hover:bg-dark-blue">
                Ver Todos
              </Button>
            </Link>
          </div>

          <Suspense fallback={<div className="text-center py-12">Cargando productos...</div>}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {recentProducts.length > 0 ? (
                recentProducts.map((product) => <ProductCard key={product.id} product={product} />)
              ) : (
                <div className="col-span-full text-center py-8">No hay productos disponibles</div>
              )}
            </div>
          </Suspense>
        </div>
      </section>

      {/* Por Qué Elegirnos */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">¿Por Qué Elegirnos?</h2>
            <p className="text-xl text-muted-foreground">La mejor experiencia geek garantizada</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-grape to-dark-blue rounded-full flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
              <p className="text-muted-foreground">Entrega en 24-48 horas en toda España</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-rose to-fandango rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
              <p className="text-muted-foreground">Productos oficiales y de la mejor calidad</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-neon-blue to-grape rounded-full flex items-center justify-center">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
              <p className="text-muted-foreground">Atención al cliente siempre disponible</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-fandango to-rose rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Satisfacción</h3>
              <p className="text-muted-foreground">Garantía de devolución de 30 días</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-dark-blue to-grape">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">¡Únete a la Comunidad Geek!</h2>
            <p className="text-xl text-white/80 mb-8">
              Sé el primero en conocer nuestras ofertas exclusivas y nuevos productos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email aquí..."
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white/50"
              />
              <Button className="bg-white text-grape hover:bg-gray-100 font-medium px-8">Suscribirse</Button>
            </div>
            <p className="text-white/60 text-sm mt-4">
              No spam, solo contenido geek de calidad. Puedes darte de baja cuando quieras.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
