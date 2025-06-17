"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Key, CheckCircle, XCircle } from "lucide-react"

export default function SecurityDebugPage() {
  const [securityStatus, setSecurityStatus] = useState<{
    jwt: boolean
    encryption: boolean
    middleware: boolean
    storage: boolean
  }>({
    jwt: false,
    encryption: false,
    middleware: false,
    storage: false,
  })

  const [testResults, setTestResults] = useState<string[]>([])

  const runSecurityTests = async () => {
    setTestResults([])
    const results: string[] = []

    // Test JWT
    try {
      const response = await fetch("/api/test-jwt", { method: "POST" })
      const data = await response.json()
      if (data.success) {
        setSecurityStatus((prev) => ({ ...prev, jwt: true }))
        results.push("✅ JWT: Funcionando correctamente")
      } else {
        results.push("❌ JWT: Error - " + data.error)
      }
    } catch (error) {
      results.push("❌ JWT: Error de conexión")
    }

    // Test Cifrado
    try {
      const testData = "Datos de prueba"
      const { encrypt, decrypt } = await import("@/lib/encryption")
      const encrypted = encrypt(testData)
      const decrypted = decrypt(encrypted)

      if (decrypted === testData) {
        setSecurityStatus((prev) => ({ ...prev, encryption: true }))
        results.push("✅ Cifrado: Funcionando correctamente")
      } else {
        results.push("❌ Cifrado: Error en descifrado")
      }
    } catch (error) {
      results.push("❌ Cifrado: Error - " + error)
    }

    // Test Almacenamiento Seguro
    try {
      const { secureStorage } = await import("@/lib/secure-storage")
      const testData = { test: "data", number: 123 }

      secureStorage.setTempData("test", testData, 1)
      const retrieved = secureStorage.getTempData("test")

      if (JSON.stringify(retrieved) === JSON.stringify(testData)) {
        setSecurityStatus((prev) => ({ ...prev, storage: true }))
        results.push("✅ Almacenamiento Seguro: Funcionando correctamente")
      } else {
        results.push("❌ Almacenamiento Seguro: Error en recuperación")
      }
    } catch (error) {
      results.push("❌ Almacenamiento Seguro: Error - " + error)
    }

    // Test Middleware
    try {
      const response = await fetch("/account/profile")
      if (response.status === 401 || response.url.includes("/auth/login")) {
        setSecurityStatus((prev) => ({ ...prev, middleware: true }))
        results.push("✅ Middleware: Protección de rutas funcionando")
      } else {
        results.push("⚠️ Middleware: Verificar protección de rutas")
      }
    } catch (error) {
      results.push("❌ Middleware: Error de conexión")
    }

    setTestResults(results)
  }

  useEffect(() => {
    runSecurityTests()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Shield className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Panel de Seguridad</h1>
          <p className="text-gray-600">Verificación del estado de seguridad de la aplicación</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Key className="h-4 w-4" />
                JWT Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {securityStatus.jwt ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={securityStatus.jwt ? "default" : "destructive"}>
                  {securityStatus.jwt ? "Activo" : "Error"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4" />
                Cifrado AES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {securityStatus.encryption ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={securityStatus.encryption ? "default" : "destructive"}>
                  {securityStatus.encryption ? "Activo" : "Error"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4" />
                Middleware
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {securityStatus.middleware ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={securityStatus.middleware ? "default" : "destructive"}>
                  {securityStatus.middleware ? "Activo" : "Error"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4" />
                Almacenamiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {securityStatus.storage ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <Badge variant={securityStatus.storage ? "default" : "destructive"}>
                  {securityStatus.storage ? "Activo" : "Error"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resultados de Pruebas de Seguridad</CardTitle>
            <CardDescription>Estado actual de todos los componentes de seguridad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg font-mono text-sm ${
                    result.startsWith("✅")
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : result.startsWith("⚠️")
                        ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {result}
                </div>
              ))}
            </div>

            <Button onClick={runSecurityTests} className="w-full">
              <Shield className="mr-2 h-4 w-4" />
              Ejecutar Pruebas de Seguridad
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información de Seguridad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">🔐 Características Implementadas:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• JWT con expiración de 24 horas</li>
                  <li>• Cifrado AES para datos sensibles</li>
                  <li>• Rate limiting (100 req/15min)</li>
                  <li>• Headers de seguridad CSP</li>
                  <li>• Sanitización de inputs</li>
                  <li>• Almacenamiento seguro cifrado</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🛡️ Rutas Protegidas:</h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• /account/* (Cuenta de usuario)</li>
                  <li>• /admin/* (Panel de administración)</li>
                  <li>• /checkout/* (Proceso de compra)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
