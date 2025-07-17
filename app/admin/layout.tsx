"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, BarChart3, ArrowLeft, Shield, Zap } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isClient, setIsClient] = useState(false)
  const [seoConfig, setSeoConfig] = useState<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      const config = localStorage.getItem("seo-config")
      if (config) {
        setSeoConfig(JSON.parse(config))
      }
    }
  }, [])

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: BarChart3,
      active: pathname === "/admin",
    },
    {
      href: "/admin/seo",
      label: "SEO & Título",
      icon: Globe,
      active: pathname === "/admin/seo",
    },
  ]

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Admin CMS</h1>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Zap className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ver Site
                </Button>
              </Link>

              <div className="text-sm text-gray-600">{seoConfig?.author || "Administrador"}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Menu</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-none transition-colors ${
                          item.active
                            ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">Status Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SEO Score</span>
                  <Badge variant={seoConfig?.title && seoConfig?.description ? "default" : "secondary"}>
                    {seoConfig?.title && seoConfig?.description ? "85%" : "45%"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Analytics</span>
                  <Badge variant={seoConfig?.googleAnalyticsId ? "default" : "secondary"}>
                    {seoConfig?.googleAnalyticsId ? "Ativo" : "Inativo"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Meta Tags</span>
                  <Badge variant={seoConfig?.keywords ? "default" : "secondary"}>
                    {seoConfig?.keywords ? "OK" : "Pendente"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
