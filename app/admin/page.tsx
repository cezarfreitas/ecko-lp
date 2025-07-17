"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Globe, TrendingUp, Eye, CheckCircle, AlertCircle, Settings, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface SEOConfig {
  title: string
  description: string
  keywords: string
  author: string
  url: string
  language: string
  logo: string
  favicon: string
  ogImage: string
  googleAnalytics: string
  googleTagManager: string
  facebookPixel: string
}

const defaultConfig: SEOConfig = {
  title: "Moda Feminina Premium - Loja Online",
  description: "Descubra as últimas tendências em moda feminina com qualidade premium e preços acessíveis.",
  keywords: "moda feminina, roupas, vestidos, blusas, calças, acessórios",
  author: "Moda Premium",
  url: "https://modapremium.com.br",
  language: "pt-BR",
  logo: "/placeholder-logo.png",
  favicon: "/favicon.ico",
  ogImage: "/og-image.jpg",
  googleAnalytics: "",
  googleTagManager: "",
  facebookPixel: "",
}

export default function AdminDashboard() {
  const [config, setConfig] = useState<SEOConfig>(defaultConfig)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("seo-config")
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    }
  }, [])

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Calcular SEO Score
  const calculateSEOScore = () => {
    let score = 0
    const checks = [
      { condition: config.title.length >= 30 && config.title.length <= 60, points: 20 },
      { condition: config.description.length >= 120 && config.description.length <= 160, points: 20 },
      { condition: config.keywords.split(",").length >= 3, points: 15 },
      { condition: config.googleAnalytics.length > 0, points: 15 },
      { condition: config.ogImage.length > 0, points: 10 },
      { condition: config.url.startsWith("https://"), points: 10 },
      { condition: config.author.length > 0, points: 10 },
    ]

    checks.forEach((check) => {
      if (check.condition) score += check.points
    })

    return score
  }

  const seoScore = calculateSEOScore()

  const stats = [
    {
      name: "SEO Score",
      value: `${seoScore}%`,
      icon: TrendingUp,
      color: seoScore >= 80 ? "text-green-600" : seoScore >= 60 ? "text-yellow-600" : "text-red-600",
      bgColor: seoScore >= 80 ? "bg-green-100" : seoScore >= 60 ? "bg-yellow-100" : "bg-red-100",
    },
    {
      name: "Analytics",
      value: config.googleAnalytics ? "Ativo" : "Inativo",
      icon: BarChart3,
      color: config.googleAnalytics ? "text-green-600" : "text-gray-600",
      bgColor: config.googleAnalytics ? "bg-green-100" : "bg-gray-100",
    },
    {
      name: "Meta Tags",
      value: config.title && config.description ? "Completo" : "Incompleto",
      icon: Globe,
      color: config.title && config.description ? "text-green-600" : "text-yellow-600",
      bgColor: config.title && config.description ? "bg-green-100" : "bg-yellow-100",
    },
    {
      name: "Performance",
      value: "Otimizado",
      icon: Eye,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  const seoChecklist = [
    {
      item: "Título SEO (30-60 caracteres)",
      status: config.title.length >= 30 && config.title.length <= 60,
      current: `${config.title.length} caracteres`,
    },
    {
      item: "Meta Description (120-160 caracteres)",
      status: config.description.length >= 120 && config.description.length <= 160,
      current: `${config.description.length} caracteres`,
    },
    {
      item: "Palavras-chave (mínimo 3)",
      status: config.keywords.split(",").length >= 3,
      current: `${config.keywords.split(",").length} palavras`,
    },
    {
      item: "Google Analytics configurado",
      status: config.googleAnalytics.length > 0,
      current: config.googleAnalytics ? "Configurado" : "Não configurado",
    },
    {
      item: "Imagem Open Graph",
      status: config.ogImage.length > 0,
      current: config.ogImage ? "Configurada" : "Não configurada",
    },
    {
      item: "URL com HTTPS",
      status: config.url.startsWith("https://"),
      current: config.url.startsWith("https://") ? "Seguro" : "Inseguro",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Score */}
        <Card>
          <CardHeader>
            <CardTitle>Score SEO</CardTitle>
            <CardDescription>Otimização atual do seu site para mecanismos de busca</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score Atual</span>
                <span
                  className={`text-2xl font-bold ${
                    seoScore >= 80 ? "text-green-600" : seoScore >= 60 ? "text-yellow-600" : "text-red-600"
                  }`}
                >
                  {seoScore}%
                </span>
              </div>
              <Progress value={seoScore} className="h-2" />
              <div className="text-sm text-gray-600">
                {seoScore >= 80
                  ? "Excelente! Seu SEO está bem otimizado."
                  : seoScore >= 60
                    ? "Bom, mas pode melhorar algumas configurações."
                    : "Precisa de melhorias significativas no SEO."}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Config */}
        <Card>
          <CardHeader>
            <CardTitle>Configuração Atual</CardTitle>
            <CardDescription>Informações principais do seu site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Título</p>
                <p className="text-sm text-gray-900 truncate">{config.title}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Empresa</p>
                <p className="text-sm text-gray-900">{config.author}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">URL</p>
                <p className="text-sm text-gray-900 truncate">{config.url}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Analytics</p>
                <Badge variant={config.googleAnalytics ? "default" : "secondary"}>
                  {config.googleAnalytics ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Checklist SEO</CardTitle>
          <CardDescription>Itens importantes para otimização do seu site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seoChecklist.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  {check.status ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{check.item}</p>
                    <p className="text-xs text-gray-600">{check.current}</p>
                  </div>
                </div>
                <Badge variant={check.status ? "default" : "secondary"}>{check.status ? "OK" : "Pendente"}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Configurações importantes para o seu site</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/seo">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Globe className="mr-2 h-4 w-4" />
                Configurar SEO
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Eye className="mr-2 h-4 w-4" />
                Visualizar Site
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
              <BarChart3 className="mr-2 h-4 w-4" />
              Relatórios (Em breve)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
