"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, Eye, CheckCircle, AlertCircle, Globe, BarChart3, ImageIcon, LinkIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

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

export default function SEOConfigPage() {
  const [config, setConfig] = useState<SEOConfig>(defaultConfig)
  const [isClient, setIsClient] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("seo-config")
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig))
      }
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("seo-config", JSON.stringify(config))

        // Disparar evento customizado para atualizar outros componentes
        window.dispatchEvent(
          new CustomEvent("seo-config-updated", {
            detail: config,
          }),
        )
      }

      toast.success("Configurações salvas com sucesso!")

      // Pequeno delay para mostrar o toast
      setTimeout(() => {
        router.push("/admin")
      }, 1000)
    } catch (error) {
      toast.error("Erro ao salvar configurações")
    } finally {
      setIsSaving(false)
    }
  }

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

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const seoScore = calculateSEOScore()

  const seoChecks = [
    {
      label: "Título SEO",
      status: config.title.length >= 30 && config.title.length <= 60,
      message: `${config.title.length}/60 caracteres`,
    },
    {
      label: "Meta Description",
      status: config.description.length >= 120 && config.description.length <= 160,
      message: `${config.description.length}/160 caracteres`,
    },
    {
      label: "Palavras-chave",
      status: config.keywords.split(",").length >= 3,
      message: `${config.keywords.split(",").length} palavras`,
    },
    {
      label: "Google Analytics",
      status: config.googleAnalytics.length > 0,
      message: config.googleAnalytics ? "Configurado" : "Não configurado",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de SEO</h1>
          <p className="text-gray-600">Configure o título, descrição e otimizações para mecanismos de busca</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => router.push("/")}>
            <Eye className="mr-2 h-4 w-4" />
            Visualizar Site
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>Configure as informações principais do seu site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Página</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Título principal do seu site"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">{config.title.length}/60 caracteres (recomendado: 30-60)</p>
              </div>

              <div>
                <Label htmlFor="author">Nome da Empresa/Autor</Label>
                <Input
                  id="author"
                  value={config.author}
                  onChange={(e) => setConfig({ ...config, author: e.target.value })}
                  placeholder="Nome da sua empresa ou marca"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição SEO</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  placeholder="Descrição que aparecerá nos resultados de busca"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {config.description.length}/160 caracteres (recomendado: 120-160)
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">Palavras-chave</Label>
                <Input
                  id="keywords"
                  value={config.keywords}
                  onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
                  placeholder="palavra1, palavra2, palavra3"
                />
                <p className="text-xs text-gray-500 mt-1">Separe as palavras-chave com vírgulas</p>
              </div>
            </CardContent>
          </Card>

          {/* Configurações Técnicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="mr-2 h-5 w-5" />
                Configurações Técnicas
              </CardTitle>
              <CardDescription>URLs, idioma e configurações avançadas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url">URL do Site</Label>
                <Input
                  id="url"
                  value={config.url}
                  onChange={(e) => setConfig({ ...config, url: e.target.value })}
                  placeholder="https://seusite.com.br"
                />
              </div>

              <div>
                <Label htmlFor="language">Idioma</Label>
                <Input
                  id="language"
                  value={config.language}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  placeholder="pt-BR"
                />
              </div>
            </CardContent>
          </Card>

          {/* Imagens e Assets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                Imagens e Assets
              </CardTitle>
              <CardDescription>Configure logo, favicon e imagem Open Graph</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo">Logo</Label>
                <Input
                  id="logo"
                  value={config.logo}
                  onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                  placeholder="/logo.png"
                />
              </div>

              <div>
                <Label htmlFor="favicon">Favicon</Label>
                <Input
                  id="favicon"
                  value={config.favicon}
                  onChange={(e) => setConfig({ ...config, favicon: e.target.value })}
                  placeholder="/favicon.ico"
                />
              </div>

              <div>
                <Label htmlFor="ogImage">Imagem Open Graph</Label>
                <Input
                  id="ogImage"
                  value={config.ogImage}
                  onChange={(e) => setConfig({ ...config, ogImage: e.target.value })}
                  placeholder="/og-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Imagem que aparece quando o site é compartilhado (1200x630px)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Analytics e Tracking
              </CardTitle>
              <CardDescription>Configure Google Analytics, Tag Manager e Facebook Pixel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                <Input
                  id="googleAnalytics"
                  value={config.googleAnalytics}
                  onChange={(e) => setConfig({ ...config, googleAnalytics: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
                <Input
                  id="googleTagManager"
                  value={config.googleTagManager}
                  onChange={(e) => setConfig({ ...config, googleTagManager: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixel"
                  value={config.facebookPixel}
                  onChange={(e) => setConfig({ ...config, facebookPixel: e.target.value })}
                  placeholder="123456789012345"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar com Preview e Score */}
        <div className="space-y-6">
          {/* SEO Score */}
          <Card>
            <CardHeader>
              <CardTitle>Score SEO</CardTitle>
              <CardDescription>Otimização atual</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Score</span>
                  <span
                    className={`text-2xl font-bold ${
                      seoScore >= 80 ? "text-green-600" : seoScore >= 60 ? "text-yellow-600" : "text-red-600"
                    }`}
                  >
                    {seoScore}%
                  </span>
                </div>
                <Progress value={seoScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist SEO</CardTitle>
              <CardDescription>Status das configurações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {seoChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {check.status ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span className="text-sm">{check.label}</span>
                    </div>
                    <Badge variant={check.status ? "default" : "secondary"} className="text-xs">
                      {check.status ? "OK" : "Pendente"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview do Google */}
          <Card>
            <CardHeader>
              <CardTitle>Preview do Google</CardTitle>
              <CardDescription>Como aparece na busca</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-3 bg-white">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer truncate">
                  {config.title || "Título da página"}
                </div>
                <div className="text-green-700 text-sm truncate">{config.url || "https://seusite.com.br"}</div>
                <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {config.description || "Descrição da página que aparecerá nos resultados de busca do Google."}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
