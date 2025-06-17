"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Package, RefreshCw, Truck, ShieldCheck } from "lucide-react"
import type { ProductWithDetails } from "@/types"

interface ProductDescriptionProps {
  product: ProductWithDetails
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <div className="bg-white rounded-lg shadow-sm border mx-2 sm:mx-0">
      <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b bg-transparent h-12 sm:h-14">
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 sm:h-14"
          >
            <span className="font-medium text-xs sm:text-sm">Descripción</span>
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 sm:h-14"
          >
            <span className="font-medium text-xs sm:text-sm">Detalles</span>
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none h-12 sm:h-14"
          >
            <span className="font-medium text-xs sm:text-sm">Envío y Devoluciones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="p-3 sm:p-6">
          <div className="prose max-w-none">
            {product.description ? (
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            ) : (
              <p>No hay descripción disponible para este producto.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details" className="p-3 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
                Información Básica
              </h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <Badge variant="outline" className="ml-2">
                    {product.variants[0]?.sku || "N/A"}
                  </Badge>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <Badge variant="outline" className="ml-2">
                    {product.category.name}
                  </Badge>
                </li>
                {product.franchise && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Franquicia:</span>
                    <Badge variant="outline" className="ml-2">
                      {product.franchise.name}
                    </Badge>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 flex items-center">
                <Package className="mr-2 h-5 w-5 text-primary" />
                Especificaciones
              </h3>
              <ul className="space-y-2">
                {product.variants.length > 0 && (
                  <>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Tallas:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {[...new Set(product.variants.map((v) => v.size))].map((size) => (
                          <Badge key={size} variant="secondary" className="ml-1">
                            {size}
                          </Badge>
                        ))}
                      </div>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-600">Colores:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {[...new Set(product.variants.map((v) => v.color))].map((color) => (
                          <Badge key={color} variant="secondary" className="ml-1">
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </li>
                  </>
                )}
                <li className="flex justify-between">
                  <span className="text-gray-600">Material:</span>
                  <span className="font-medium">100% Algodón</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Cuidados:</span>
                  <span className="font-medium">Lavado a máquina</span>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="p-3 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-primary/10 p-4">
                <h3 className="text-lg font-medium flex items-center text-primary">
                  <Truck className="mr-2 h-5 w-5" />
                  Opciones de Envío
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-start">
                  <Badge className="mt-1 mr-3" variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    3-5 días
                  </Badge>
                  <div>
                    <p className="font-medium">Envío Estándar</p>
                    <p className="text-sm text-gray-600">Envío gratis en pedidos superiores a $500.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Badge className="mt-1 mr-3" variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    1-2 días
                  </Badge>
                  <div>
                    <p className="font-medium">Envío Express</p>
                    <p className="text-sm text-gray-600">$150 adicionales para entrega rápida.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Badge className="mt-1 mr-3" variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    7-14 días
                  </Badge>
                  <div>
                    <p className="font-medium">Envío Internacional</p>
                    <p className="text-sm text-gray-600">Disponible para la mayoría de países.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-primary/10 p-4">
                <h3 className="text-lg font-medium flex items-center text-primary">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Política de Devoluciones
                </h3>
              </div>
              <div className="p-4">
                <p className="mb-3">
                  Aceptamos devoluciones dentro de 30 días de la compra. El producto debe estar en condiciones
                  originales y en el empaque original.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      1
                    </span>
                    <span>Contacta a nuestro servicio al cliente para iniciar el proceso</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      2
                    </span>
                    <span>Empaca el producto en su empaque original</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      3
                    </span>
                    <span>Envía el producto usando la etiqueta de devolución proporcionada</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                      4
                    </span>
                    <span>Recibirás tu reembolso en 5-7 días hábiles después de recibir tu devolución</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
