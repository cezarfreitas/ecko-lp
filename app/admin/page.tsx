"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Globe, BarChart3, Eye, Settings, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"

interface SiteConfig {
  title: string
  description: string
  keywords: string
  author: string
  url: string
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
  googleAnalytics: "",
  googleTagManager: "",
  facebookPixel: "",
}

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG)

  useEffect(() => {
    setIsClient(true)
    loadConfig()
  }, [])

  const loadConfig = () => {
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

  const getSEOScore = () => {
    let score = 0
    const issues = []

    // Verificar título
    if (siteConfig.title && siteConfig.title.length >= 30 && siteConfig.title.length <= 60) {
      score += 25
    } else {
      issues.push("Título deve ter entre 30-60 caracteres")
    }

    // Verificar descrição
    if (siteConfig.description && siteConfig.description.length >= 120 && siteConfig.description.length <= 160) {
      score += 25
    } else {
      issues.push("Descrição deve ter entre 120-160 caracteres")
    }

    // Verificar palavras-chave
    if (siteConfig.keywords && siteConfig.keywords.split(",").length >= 3) {
      score += 25
    } else {
      issues.push("Adicione pelo menos 3 palavras-chave")
    }

    // Verificar analytics
    if (siteConfig.googleAnalytics || siteConfig.googleTagManager) {
      score += 25
    } else {
      issues.push("Configure Google Analytics ou Tag Manager")
    }

    return { score, issues }
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  const { score, issues } = getSEOScore()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Gerencie as configurações da sua landing page</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Site Status</p>
                <p className="text-2xl font-bold text-gray-900">Online</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SEO Score</p>
                <p className="text-2xl font-bold text-gray-900">{score}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Palavras-chave</p>
                <p className="text-2xl font-bold text-gray-900">
                  {siteConfig.keywords ? siteConfig.keywords.split(",").length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Analytics</p>
                <p className="text-2xl font-bold text-gray-900">{siteConfig.googleAnalytics ? "Ativo" : "Inativo"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configuração Atual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Título</p>
              <p className="text-gray-900 truncate">{siteConfig.title}</p>
              <p className="text-xs text-gray-500">{siteConfig.title.length} caracteres</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Descrição</p>
              <p className="text-gray-900 text-sm line-clamp-2">{siteConfig.description}</p>
              <p className="text-xs text-gray-500">{siteConfig.description.length} caracteres</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Autor</p>
              <p className="text-gray-900">{siteConfig.author}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">URL</p>
              <p className="text-gray-900 truncate">{siteConfig.url}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Status SEO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score Geral</span>
                <Badge variant={score >= 75 ? "default" : score >= 50 ? "secondary" : "destructive"}>{score}%</Badge>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    score >= 75 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>

              {issues.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Melhorias sugeridas:</p>
                  {issues.map((issue, index) => (
                    <div key={index} className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-gray-600">{issue}</p>
                    </div>
                  ))}
                </div>
              )}

              {score === 100 && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <p className="text-sm font-medium">SEO otimizado!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/seo">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Configurar SEO
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar Site
              </Button>
            </Link>
            <Button
              className="w-full justify-start bg-transparent"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <Settings className="w-4 h-4 mr-2" />
              Recarregar Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Google Analytics</p>
                <p className="text-sm text-gray-600">{siteConfig.googleAnalytics || "Não configurado"}</p>
              </div>
              <Badge variant={siteConfig.googleAnalytics ? "default" : "secondary"}>
                {siteConfig.googleAnalytics ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Google Tag Manager</p>
                <p className="text-sm text-gray-600">{siteConfig.googleTagManager || "Não configurado"}</p>
              </div>
              <Badge variant={siteConfig.googleTagManager ? "default" : "secondary"}>
                {siteConfig.googleTagManager ? "Ativo" : "Inativo"}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Facebook Pixel</p>
                <p className="text-sm text-gray-600">{siteConfig.facebookPixel || "Não configurado"}</p>
              </div>
              <Badge variant={siteConfig.facebookPixel ? "default" : "secondary"}>
                {siteConfig.facebookPixel ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
