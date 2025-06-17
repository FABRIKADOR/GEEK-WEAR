"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDebugData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug")
      const result = await response.json()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err.message || "Error fetching debug data")
      console.error("Debug fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugData()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>

      <Button onClick={fetchDebugData} disabled={loading} className="mb-6">
        {loading ? "Loading..." : "Refresh Data"}
      </Button>

      {error && (
        <Card className="mb-6 border-red-500">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {data && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Status: {data.status}</p>
              <p>Connection: {data.connection}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Supabase URL: {data.env.supabaseUrl}</p>
              <p>Supabase Anon Key: {data.env.supabaseAnonKey}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Products</h3>
              <p>Count: {JSON.stringify(data.tables.products.count)}</p>
              {data.tables.products.error && (
                <p className="text-red-500">Error: {JSON.stringify(data.tables.products.error)}</p>
              )}

              <h3 className="text-lg font-semibold mt-4 mb-2">Categories</h3>
              <p>Count: {data.tables.categories.count}</p>
              {data.tables.categories.error ? (
                <p className="text-red-500">Error: {JSON.stringify(data.tables.categories.error)}</p>
              ) : (
                <div className="mt-2 max-h-60 overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Slug
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.tables.categories.data.map((category) => (
                        <tr key={category.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <h3 className="text-lg font-semibold mt-4 mb-2">Franchises</h3>
              <p>Count: {data.tables.franchises.count}</p>
              {data.tables.franchises.error ? (
                <p className="text-red-500">Error: {JSON.stringify(data.tables.franchises.error)}</p>
              ) : (
                <div className="mt-2 max-h-60 overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Slug
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.tables.franchises.data.map((franchise) => (
                        <tr key={franchise.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {franchise.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{franchise.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{franchise.slug}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample Products</CardTitle>
            </CardHeader>
            <CardContent>
              {data.sampleProducts.error ? (
                <p className="text-red-500">Error: {JSON.stringify(data.sampleProducts.error)}</p>
              ) : data.sampleProducts.data.length === 0 ? (
                <p>No products found in the database.</p>
              ) : (
                <div className="mt-2 max-h-80 overflow-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Slug
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Franchise ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Active
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.sampleProducts.data.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.slug}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.franchise_id || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.is_active ? "Yes" : "No"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Raw Response</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96">{JSON.stringify(data, null, 2)}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
