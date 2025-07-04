import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import { CartProvider } from "@/hooks/use-cart"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "GameVault - Tienda de Videojuegos Gaming",
  description: "La mejor tienda de videojuegos, gaming y entretenimiento digital",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  generator: "v0.dev",
  keywords: "videojuegos, gaming, tienda, juegos, consolas, PC gaming, entretenimiento digital",
  author: "GameVault",
  robots: "index, follow",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta
          name="description"
          content="GameVault - La mejor tienda de videojuegos, gaming y entretenimiento digital. Encuentra los mejores juegos para todas las plataformas."
        />
        <meta
          name="keywords"
          content="videojuegos, gaming, tienda, juegos, consolas, PC gaming, entretenimiento digital"
        />
        <meta name="author" content="GameVault" />
        <meta property="og:title" content="GameVault - Tienda de Videojuegos Gaming" />
        <meta property="og:description" content="La mejor tienda de videojuegos, gaming y entretenimiento digital" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GameVault - Tienda de Videojuegos Gaming" />
        <meta name="twitter:description" content="La mejor tienda de videojuegos, gaming y entretenimiento digital" />
        <link rel="icon" href="/favicon.ico" />
        <title>GameVault - Tienda de Videojuegos Gaming</title>
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
                <Header />
                <main className="flex-1 w-full overflow-x-hidden">{children}</main>
                <Footer />
              </div>
              <ScrollToTop />
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
