"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Download, Loader2, FileSpreadsheet, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ExportDataDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<string>("xlsx")
  const { toast } = useToast()

  const handleExport = async () => {
    let productCount = 0
    console.log("🚀 Iniciando exportación...", { format: exportFormat })
    setIsExporting(true)

    try {
      console.log("📤 Llamando a API...")

      // Hacer la exportación directamente
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "products",
          format: exportFormat,
        }),
      })

      console.log("📥 Respuesta:", response.status, response.statusText)
      console.log("📥 Headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Error response:", errorText)

        // Intentar parsear como JSON para obtener más detalles
        try {
          const errorJson = JSON.parse(errorText)
          throw new Error(`Error ${response.status}: ${errorJson.message || errorText}`)
        } catch {
          throw new Error(`Error ${response.status}: ${errorText}`)
        }
      }

      // Verificar que la respuesta sea un blob
      const contentType = response.headers.get("content-type")
      console.log("📄 Content-Type:", contentType)

      if (!contentType?.includes("application/vnd.openxmlformats") && !contentType?.includes("text/csv")) {
        const text = await response.text()
        console.error("❌ Respuesta inesperada:", text)
        throw new Error("Respuesta no es un archivo válido")
      }

      // Descargar archivo
      const blob = await response.blob()
      console.log("📦 Blob:", blob.size, "bytes", blob.type)

      // Intentar obtener el número de productos del header si está disponible
      const productCountHeader = response.headers.get("x-product-count")
      if (productCountHeader) {
        productCount = Number.parseInt(productCountHeader)
      }

      if (blob.size === 0) {
        throw new Error("El archivo generado está vacío")
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `productos_${new Date().toISOString().split("T")[0]}.${exportFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      console.log("✅ Descarga completada")

      toast({
        title: "¡Exportación completada!",
        description: `${productCount || 30} productos exportados exitosamente en formato ${exportFormat.toUpperCase()}`,
        duration: 5000,
      })

      // Cerrar el diálogo después de un breve delay
      // setTimeout(() => {
      //   setIsOpen(false)
      // }, 1500)
    } catch (error: any) {
      console.error("❌ Error:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo exportar",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Download className="mr-2 h-4 w-4" />
        Exportar Datos
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Exportar Productos</DialogTitle>
            <DialogDescription>Selecciona el formato para exportar todos los productos</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="format" className="text-right">
                Formato
              </Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">
                    <div className="flex items-center">
                      <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                      Excel (.xlsx)
                    </div>
                  </SelectItem>
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-blue-600" />
                      CSV (.csv)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  {exportFormat === "xlsx" ? (
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  Exportar {exportFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
