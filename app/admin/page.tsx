"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Settings, Eye, ExternalLink } from "lucide-react"
import Link from "next/link"

interface SiteConfig {
  title: string
  description: string
  keywords: string
  author: string
  url: string
  logo: string
  favicon: string
  language: string
  ogImage: string
  twitterCard: string
  googleAnalytics: string
  googleTagManager: string
  facebookPixel: string
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  title: "Moda Feminina Elegante - Sua Loja",
  description:
    "Descubra nossa coleção exclusiva de moda feminina com peças elegantes e modernas. Qualidade, estilo e conforto em cada detalhe.",
  keywords: "moda feminina, roupas elegantes, vestidos, blusas, calças, moda moderna, estilo feminino",
  author: "Sua Loja de Moda",
  url: "https://seusite.com.br",
  logo: "/placeholder-logo.png",
  favicon: "/favicon.ico",
  language: "pt-BR",
  ogImage: "/elegant-modern-fashion.png",
  twitterCard: "summary_large_image",
  googleAnalytics: "",
  googleTagManager: "",
  facebookPixel: "",
}

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG)

  useEffect(() => {
    setIsClient(true)
    loadSiteConfig()
  }, [])

  const loadSiteConfig = () => {
    if (typeof window !== "undefined") {
      try {
        const savedConfig = localStorage.getItem("site-config")
        if (savedConfig) {
          setSiteConfig({ ...DEFAULT_SITE_CONFIG, ...JSON.parse(savedConfig) })
        }
      } catch (error) {
        console.error("Erro ao carregar configuração:", error)
      }
    }
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Título da Página",
      value: siteConfig.title,
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Descrição SEO",
      value: `${siteConfig.description.length} caracteres`,
      icon: Settings,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Palavras-chave",
      value: siteConfig.keywords.split(",").length + " palavras",
      icon: Eye,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Gerencie as configurações de SEO e título da sua landing page</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-lg font-semibold text-gray-900 truncate max-w-[200px]">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/seo">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Globe className="w-4 h-4 mr-2" />
                Configurar SEO e Título
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visualizar Site
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Current Configuration Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração Atual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Informações Básicas</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Título:</span>
                  <p className="text-gray-600 mt-1">{siteConfig.title}</p>
                </div>
                <div>
                  <span className="font-medium">Autor:</span>
                  <p className="text-gray-600 mt-1">{siteConfig.author}</p>
                </div>
                <div>
                  <span className="font-medium">URL:</span>
                  <p className="text-gray-600 mt-1">{siteConfig.url}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">SEO</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Descrição:</span>
                  <p className="text-gray-600 mt-1 line-clamp-2">{siteConfig.description}</p>
                </div>
                <div>
                  <span className="font-medium">Palavras-chave:</span>
                  <p className="text-gray-600 mt-1 line-clamp-2">{siteConfig.keywords}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
