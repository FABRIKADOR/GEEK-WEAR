import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/hooks/use-cart"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import Chatbox from "@/components/chatbox"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GeekWear - Camisetas Anime y Gaming",
  description:
    "Descubre las mejores camisetas de anime y gaming. Calidad premium, diseños únicos y envíos a toda México.",
  keywords: ["camisetas anime", "camisetas gaming", "ropa geek", "manga", "videojuegos"],
  authors: [{ name: "GeekWear" }],
  creator: "GeekWear",
  publisher: "GeekWear",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
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
