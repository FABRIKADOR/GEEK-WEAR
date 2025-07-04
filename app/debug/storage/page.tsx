"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { storageService } from "@/services/storage-service"
import { supabase } from "@/lib/supabase-client"

export default function StorageDebugPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [buckets, setBuckets] = useState<any[]>([])
  const { toast } = useToast()

  const checkBuckets = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.storage.listBuckets()

      if (error) {
        throw error
      }

      setBuckets(data || [])

      toast({
        title: "Buckets verificados",
        description: `Se encontraron ${data?.length || 0} buckets`,
      })
    } catch (error) {
      console.error("Error al verificar buckets:", error)
      toast({
        title: "Error",
        description: "No se pudieron verificar los buckets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createProfileBucket = async () => {
    setIsLoading(true)
    try {
      await storageService.createBucketIfNotExists("profile-images", true)

      toast({
        title: "Bucket creado",
        description: "El bucket profile-images ha sido creado correctamente",
      })

      // Actualizar la lista de buckets
      await checkBuckets()
    } catch (error) {
      console.error("Error al crear bucket:", error)
      toast({
        title: "Error al crear bucket",
        description: `${error}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createProductBucket = async () => {
    setIsLoading(true)
    try {
      await storageService.createBucketIfNotExists("product-images", true)

      toast({
        title: "Bucket creado",
        description: "El bucket product-images ha sido creado correctamente",
      })

      // Actualizar la lista de buckets
      await checkBuckets()
    } catch (error) {
      console.error("Error al crear bucket:", error)
      toast({
        title: "Error al crear bucket",
        description: `${error}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Debug de Storage</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verificar Buckets</CardTitle>
            <CardDescription>Verifica qué buckets existen en tu proyecto de Supabase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkBuckets} disabled={isLoading}>
              {isLoading ? "Verificando..." : "Verificar Buckets"}
            </Button>

            {buckets.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Buckets encontrados:</h3>
                <ul className="space-y-2">
                  {buckets.map((bucket) => (
                    <li key={bucket.id} className="flex items-center justify-between p-2 border rounded">
                      <span>{bucket.name}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${bucket.public ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {bucket.public ? "Público" : "Privado"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crear Buckets</CardTitle>
            <CardDescription>Crea los buckets necesarios para la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={createProfileBucket} disabled={isLoading}>
                Crear Bucket de Perfiles
              </Button>
              <Button onClick={createProductBucket} disabled={isLoading}>
                Crear Bucket de Productos
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <strong>1.</strong> Primero verifica qué buckets existen
              </p>
              <p>
                <strong>2.</strong> Si no existe "profile-images", créalo con el botón correspondiente
              </p>
              <p>
                <strong>3.</strong> Si no existe "product-images", créalo con el botón correspondiente
              </p>
              <p>
                <strong>4.</strong> Ejecuta el script SQL en la consola de Supabase para configurar las políticas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
