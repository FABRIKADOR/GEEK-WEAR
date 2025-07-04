"use client"

import ProductForm from "../product-form"

export default function NewProductPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Crear Nuevo Producto</h1>
      <ProductForm />
    </div>
  )
}
