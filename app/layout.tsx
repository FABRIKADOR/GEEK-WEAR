import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/hooks/use-cart"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import Chatbox from "@/components/chatbox"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GeekWear - Ropa Geek y Anime",
  description: "Descubre la mejor colección de ropa geek, anime y gaming. Camisetas, hoodies y accesorios únicos para verdaderos fanáticos.",
  keywords: ["ropa geek", "anime", "gaming", "camisetas", "hoodies", "manga", "otaku"],
  authors: [{ name: "GeekWear" }],
  creator: "GeekWear",
  publisher: "GeekWear",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "GeekWear",
    title: "GeekWear - Ropa Geek y Anime",
    description: "Descubre la mejor colección de ropa geek, anime y gaming.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GeekWear - Ropa Geek y Anime",
    description: "Descubre la mejor colección de ropa geek, anime y gaming.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <ScrollToTop />
              <Chatbox />
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
