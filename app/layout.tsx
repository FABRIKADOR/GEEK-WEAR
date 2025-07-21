import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/hooks/use-cart"
import Chatbox from "@/components/chatbox"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GeekWear - Tu Tienda Geek Favorita",
  description:
    "Descubre la mejor colección de camisetas, accesorios y productos geek. Anime, gaming, tecnología y más en GeekWear México.",
  keywords: ["geek", "anime", "gaming", "camisetas", "accesorios", "tecnología", "México"],
  authors: [{ name: "GeekWear Team" }],
  creator: "GeekWear",
  publisher: "GeekWear",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "GeekWear - Tu Tienda Geek Favorita",
    description: "Descubre la mejor colección de productos geek en México",
    type: "website",
    locale: "es_MX",
    siteName: "GeekWear",
  },
  twitter: {
    card: "summary_large_image",
    title: "GeekWear - Tu Tienda Geek Favorita",
    description: "Descubre la mejor colección de productos geek en México",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
              {children}
              <Toaster />
              <Chatbox />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
