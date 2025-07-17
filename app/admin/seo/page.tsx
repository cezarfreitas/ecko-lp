"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, RefreshCw, Eye, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

export default function SEOConfigPage() {
  const [isClient, setIsClient] = useState(false)
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    setIsClient(true)
    loadConfig()
  }, [])

  const loadConfig = () => {
    if (typeof window !== "undefined") {
      try {
        const savedConfig = localStorage.getItem("site-config")
        if (savedConfig) {
          setConfig({ ...DEFAULT_SITE_CONFIG, ...JSON.parse(savedConfig) })
        }
      } catch (error) {
        console.error("Erro ao carregar configuração:", error)
      }
    }
  }

  const saveConfig = async () => {
    if (typeof window === "undefined") return

    setIsSaving(true)
    try {
      localStorage.setItem("site-config", JSON.stringify(config))

      // Disparar evento para atualizar outros componentes
      window.dispatchEvent(new CustomEvent("site-config-updated", { detail: config }))

      setSaveMessage("Configurações salvas com sucesso!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      console.error("Erro ao salvar:", error)
      setSaveMessage("Erro ao salvar configurações")
    } finally {
      setIsSaving(false)
    }
  }

  const resetConfig = () => {
    setConfig(DEFAULT_SITE_CONFIG)
    setSaveMessage("Configurações resetadas para o padrão")
    setTimeout(() => setSaveMessage(""), 3000)
  }

  const handleInputChange = (field: keyof SiteConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de SEO</h1>
          <p className="text-gray-600 mt-1">Configure o título, descrição e meta tags da sua landing page</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={resetConfig}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={saveConfig} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Página</Label>
              <Input
                id="title"
                value={config.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Título que aparece na aba do navegador"
              />
              <p className="text-sm text-gray-500">{config.title.length}/60 caracteres (recomendado: 50-60)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Autor/Empresa</Label>
              <Input
                id="author"
                value={config.author}
                onChange={(e) => handleInputChange("author", e.target.value)}
                placeholder="Nome da sua empresa"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição SEO</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descrição que aparece nos resultados de busca"
              rows={3}
            />
            <p className="text-sm text-gray-500">{config.description.length}/160 caracteres (recomendado: 150-160)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Palavras-chave</Label>
            <Textarea
              id="keywords"
              value={config.keywords}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              placeholder="palavra1, palavra2, palavra3"
              rows={2}
            />
            <p className="text-sm text-gray-500">Separe as palavras-chave com vírgulas</p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações Técnicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="url">URL do Site</Label>
              <Input
                id="url"
                value={config.url}
                onChange={(e) => handleInputChange("url", e.target.value)}
                placeholder="https://seusite.com.br"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Input
                id="language"
                value={config.language}
                onChange={(e) => handleInputChange("language", e.target.value)}
                placeholder="pt-BR"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="logo">Logo (caminho)</Label>
              <Input
                id="logo"
                value={config.logo}
                onChange={(e) => handleInputChange("logo", e.target.value)}
                placeholder="/logo.png"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="favicon">Favicon (caminho)</Label>
              <Input
                id="favicon"
                value={config.favicon}
                onChange={(e) => handleInputChange("favicon", e.target.value)}
                placeholder="/favicon.ico"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ogImage">Imagem Open Graph (caminho)</Label>
            <Input
              id="ogImage"
              value={config.ogImage}
              onChange={(e) => handleInputChange("ogImage", e.target.value)}
              placeholder="/og-image.jpg"
            />
            <p className="text-sm text-gray-500">Imagem que aparece quando o link é compartilhado nas redes sociais</p>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics e Tracking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
            <Input
              id="googleAnalytics"
              value={config.googleAnalytics}
              onChange={(e) => handleInputChange("googleAnalytics", e.target.value)}
              placeholder="G-XXXXXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
            <Input
              id="googleTagManager"
              value={config.googleTagManager}
              onChange={(e) => handleInputChange("googleTagManager", e.target.value)}
              placeholder="GTM-XXXXXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
            <Input
              id="facebookPixel"
              value={config.facebookPixel}
              onChange={(e) => handleInputChange("facebookPixel", e.target.value)}
              placeholder="123456789012345"
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Preview - Como aparece no Google
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">{config.title}</div>
            <div className="text-green-700 text-sm mt-1">{config.url}</div>
            <div className="text-gray-600 text-sm mt-2 leading-relaxed">{config.description}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
