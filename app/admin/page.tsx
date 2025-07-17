"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Globe, BarChart3, Eye, Search, AlertCircle, CheckCircle, Settings, Zap } from "lucide-react"

export default function AdminDashboard() {
  const [isClient, setIsClient] = useState(false)
  const [seoConfig, setSeoConfig] = useState<any>({})
  const [seoScore, setSeoScore] = useState(0)

  useEffect(() => {
    setIsClient(true)

    if (typeof window !== "undefined") {
      const config = localStorage.getItem("seo-config")
      if (config) {
        const parsedConfig = JSON.parse(config)
        setSeoConfig(parsedConfig)
        calculateSeoScore(parsedConfig)
      }
    }
  }, [])

  const calculateSeoScore = (config: any) => {
    let score = 0
    const checks = [
      { key: "title", weight: 20 },
      { key: "description", weight: 20 },
      { key: "keywords", weight: 15 },
      { key: "author", weight: 10 },
      { key: "url", weight: 10 },
      { key: "googleAnalyticsId", weight: 10 },
      { key: "ogImage", weight: 10 },
      { key: "language", weight: 5 },
    ]

    checks.forEach((check) => {
      if (config[check.key] && config[check.key].trim() !== "") {
        score += check.weight
      }
    })

    setSeoScore(score)
  }

  const stats = [
    {
      title: "SEO Score",
      value: `${seoScore}%`,
      icon: Search,
      color: seoScore >= 80 ? "text-green-600" : seoScore >= 60 ? "text-yellow-600" : "text-red-600",
      bgColor: seoScore >= 80 ? "bg-green-100" : seoScore >= 60 ? "bg-yellow-100" : "bg-red-100",
    },
    {
      title: "Analytics",
      value: seoConfig.googleAnalyticsId ? "Ativo" : "Inativo",
      icon: BarChart3,
      color: seoConfig.googleAnalyticsId ? "text-green-600" : "text-gray-600",
      bgColor: seoConfig.googleAnalyticsId ? "bg-green-100" : "bg-gray-100",
    },
    {
      title: "Meta Tags",
      value: seoConfig.keywords ? "Configurado" : "Pendente",
      icon: Globe,
      color: seoConfig.keywords ? "text-blue-600" : "text-gray-600",
      bgColor: seoConfig.keywords ? "bg-blue-100" : "bg-gray-100",
    },
    {
      title: "Performance",
      value: "95%",
      icon: Zap,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const seoChecks = [
    {
      label: "Título da página",
      status: seoConfig.title && seoConfig.title.length >= 10 && seoConfig.title.length <= 60,
      description: seoConfig.title ? `${seoConfig.title.length}/60 caracteres` : "Não configurado",
    },
    {
      label: "Meta descrição",
      status: seoConfig.description && seoConfig.description.length >= 120 && seoConfig.description.length <= 160,
      description: seoConfig.description ? `${seoConfig.description.length}/160 caracteres` : "Não configurado",
    },
    {
      label: "Palavras-chave",
      status: seoConfig.keywords && seoConfig.keywords.split(",").length >= 3,
      description: seoConfig.keywords ? `${seoConfig.keywords.split(",").length} palavras-chave` : "Não configurado",
    },
    {
      label: "Google Analytics",
      status: seoConfig.googleAnalyticsId,
      description: seoConfig.googleAnalyticsId ? "Configurado" : "Não configurado",
    },
    {
      label: "Imagem Open Graph",
      status: seoConfig.ogImage,
      description: seoConfig.ogImage ? "Configurada" : "Não configurada",
    },
  ]

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Visão geral das configurações e performance do seu site</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SEO Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Score SEO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Score Atual</span>
                <span className="text-2xl font-bold">{seoScore}%</span>
              </div>

              <Progress value={seoScore} className="h-2" />

              <div className="text-sm text-gray-600">
                {seoScore >= 80 ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Excelente otimização SEO
                  </div>
                ) : seoScore >= 60 ? (
                  <div className="flex items-center text-yellow-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Boa otimização, pode melhorar
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Precisa de otimização
                  </div>
                )}
              </div>

              <Link href="/admin/seo">
                <Button className="w-full mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar SEO
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* SEO Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Checklist SEO</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seoChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {check.status ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{check.label}</p>
                      <p className="text-xs text-gray-500">{check.description}</p>
                    </div>
                  </div>
                  <Badge variant={check.status ? "default" : "secondary"}>{check.status ? "OK" : "Pendente"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuração Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Informações Básicas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Título:</span>
                  <span className="font-medium">{seoConfig.title || "Não configurado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Autor:</span>
                  <span className="font-medium">{seoConfig.author || "Não configurado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">URL:</span>
                  <span className="font-medium">{seoConfig.url || "Não configurado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Idioma:</span>
                  <span className="font-medium">{seoConfig.language || "pt-BR"}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Analytics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Google Analytics:</span>
                  <Badge variant={seoConfig.googleAnalyticsId ? "default" : "secondary"}>
                    {seoConfig.googleAnalyticsId ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tag Manager:</span>
                  <Badge variant={seoConfig.googleTagManagerId ? "default" : "secondary"}>
                    {seoConfig.googleTagManagerId ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Facebook Pixel:</span>
                  <Badge variant={seoConfig.facebookPixelId ? "default" : "secondary"}>
                    {seoConfig.facebookPixelId ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {seoConfig.description && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{seoConfig.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/seo">
              <Button variant="outline" className="w-full bg-transparent">
                <Globe className="h-4 w-4 mr-2" />
                Configurar SEO
              </Button>
            </Link>

            <Link href="/" target="_blank">
              <Button variant="outline" className="w-full bg-transparent">
                <Eye className="h-4 w-4 mr-2" />
                Visualizar Site
              </Button>
            </Link>

            <Button variant="outline" className="w-full bg-transparent" disabled>
              <BarChart3 className="h-4 w-4 mr-2" />
              Relatórios (Em breve)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
