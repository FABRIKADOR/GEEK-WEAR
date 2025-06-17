"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll al top cada vez que cambie la ruta
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
