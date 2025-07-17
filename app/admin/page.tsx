"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Search, TrendingUp, Eye, CheckCircle, AlertCircle, XCircle, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"

interface SeoConfig {
  title: string
  description: string
  keywords: string
  author: string
  url: string
  language: string
  googleAnalytics: string
  googleTagManager: string
  facebookPixel: string
}

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [config, setConfig] = useState<SeoConfig>({
    title: "Moda Feminina Premium",
    description: "Descubra as últimas tendências em moda feminina com qualidade premium e preços acessíveis.",
    keywords: "moda feminina, roupas, vestidos, blusas, calças",
    author: "Moda Premium",
    url: "https://modapremium.com.br",
    language: "pt-BR",
    googleAnalytics: "",
    googleTagManager: "",
    facebookPixel: "",
  })

  useEffect(() => {
    setIsClient(true)

    const savedConfig = localStorage.getItem("seo-config")
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }

    const handleConfigUpdate = () => {
      const savedConfig = localStorage.getItem("seo-config")
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    }

    window.addEventListener("seo-config-updated", handleConfigUpdate)
    return () => window.removeEventListener("seo-config-updated", handleConfigUpdate)
  }, [])

  const calculateSeoScore = () => {
    let score = 0
    const checks = [
      { condition: config.title.length >= 30 && config.title.length <= 60, points: 20 },
      { condition: config.description.length >= 120 && config.description.length <= 160, points: 20 },
      { condition: config.keywords.split(",").length >= 3, points: 15 },
      { condition: config.author.length > 0, points: 10 },
      { condition: config.url.length > 0, points: 10 },
      { condition: config.googleAnalytics.length > 0, points: 15 },
      { condition: config.googleTagManager.length > 0, points: 10 },
    ]

    checks.forEach((check) => {
      if (check.condition) score += check.points
    })

    return score
  }

  const seoScore = calculateSeoScore()

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getSeoScoreStatus = (score: number) => {
    if (score >= 80) return "Excelente"
    if (score >= 60) return "Bom"
    return "Precisa Melhorar"
  }

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral das configurações do seu site</p>
        </div>
        <Link href="/admin/seo">
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Configurar SEO
          </Button>
        </Link>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score SEO</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getSeoScoreColor(seoScore)}>{seoScore}/100</span>
            </div>
            <p className="text-xs text-muted-foreground">{getSeoScoreStatus(seoScore)}</p>
            <Progress value={seoScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {config.googleAnalytics ? (
                <span className="text-green-600">Ativo</span>
              ) : (
                <span className="text-red-600">Inativo</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Google Analytics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta Tags</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {config.title && config.description ? (
                <span className="text-green-600">OK</span>
              ) : (
                <span className="text-red-600">Faltando</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Título e Descrição</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Boa</div>
            <p className="text-xs text-muted-foreground">Otimização geral</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuração atual */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Configuração Atual</CardTitle>
            <CardDescription>Informações principais do seu site</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Título</label>
              <p className="text-sm text-gray-900 mt-1">{config.title || "Não configurado"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Descrição</label>
              <p className="text-sm text-gray-900 mt-1">{config.description || "Não configurado"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Empresa</label>
              <p className="text-sm text-gray-900 mt-1">{config.author || "Não configurado"}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">URL</label>
              <p className="text-sm text-gray-900 mt-1">{config.url || "Não configurado"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist SEO</CardTitle>
            <CardDescription>Itens importantes para otimização</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2">
              {config.title.length >= 30 && config.title.length <= 60 ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Título otimizado (30-60 caracteres)</span>
            </div>
            <div className="flex items-center space-x-2">
              {config.description.length >= 120 && config.description.length <= 160 ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Descrição otimizada (120-160 caracteres)</span>
            </div>
            <div className="flex items-center space-x-2">
              {config.keywords.split(",").length >= 3 ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Palavras-chave definidas (mín. 3)</span>
            </div>
            <div className="flex items-center space-x-2">
              {config.googleAnalytics ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Google Analytics configurado</span>
            </div>
            <div className="flex items-center space-x-2">
              {config.googleTagManager ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm">Google Tag Manager (opcional)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Configure rapidamente os aspectos mais importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/seo">
              <Button variant="outline" size="sm">
                <Search className="mr-2 h-4 w-4" />
                Configurar SEO
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Visualizar Site
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
