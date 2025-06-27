import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Recordatorio XV Años Camila Aguilar Nowell",
  description:
    "Te invitamos a celebrar los XV años de Camila del Cielo Aguilar Nowell el 4 de Julio, 2025 a las 7:00 PM en Salón Diamante",
  openGraph: {
    title: "Recordatorio XV Años Camila Aguilar Nowell",
    description:
      "Te invitamos a celebrar los XV años de Camila del Cielo Aguilar Nowell el 4 de Julio, 2025 a las 7:00 PM en Salón Diamante",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recordatorio XV Años Camila Aguilar Nowell",
    description:
      "Te invitamos a celebrar los XV años de Camila del Cielo Aguilar Nowell el 4 de Julio, 2025 a las 7:00 PM en Salón Diamante",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta property="og:title" content="Recordatorio XV Años Camila Aguilar Nowell" />
        <meta
          property="og:description"
          content="Te invitamos a celebrar los XV años de Camila del Cielo Aguilar Nowell el 4 de Julio, 2025 a las 7:00 PM en Salón Diamante"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="es_MX" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Recordatorio XV Años Camila Aguilar Nowell" />
        <meta
          name="twitter:description"
          content="Te invitamos a celebrar los XV años de Camila del Cielo Aguilar Nowell el 4 de Julio, 2025 a las 7:00 PM en Salón Diamante"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
