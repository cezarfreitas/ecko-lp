"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, Globe, Search, BarChart3, CheckCircle, AlertCircle } from "lucide-react"

interface SeoConfig {
  title: string
  author: string
  description: string
  keywords: string
  url: string
  language: string
  favicon: string
  ogImage: string
  googleAnalyticsId: string
  googleTagManagerId: string
  facebookPixelId: string
}

export default function SeoConfigPage() {
  const [isClient, setIsClient] = useState(false)
  const [config, setConfig] = useState<SeoConfig>({
    title: "",
    author: "",
    description: "",
    keywords: "",
    url: "",
    language: "pt-BR",
    favicon: "/favicon.ico",
    ogImage: "",
    googleAnalyticsId: "",
    googleTagManagerId: "",
    facebookPixelId: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

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

        // Dispatch custom event to update other components
        window.dispatchEvent(
          new CustomEvent("seo-config-updated", {
            detail: config,
          }),
        )
      }

      setSaveMessage("Configurações salvas com sucesso!")
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("Erro ao salvar configurações")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof SeoConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const getSeoScore = () => {
    let score = 0
    const checks = [
      { key: "title", weight: 20, valid: config.title.length >= 10 && config.title.length <= 60 },
      { key: "description", weight: 20, valid: config.description.length >= 120 && config.description.length <= 160 },
      { key: "keywords", weight: 15, valid: config.keywords.split(",").length >= 3 },
      { key: "author", weight: 10, valid: config.author.length > 0 },
      { key: "url", weight: 10, valid: config.url.length > 0 },
      { key: "googleAnalyticsId", weight: 10, valid: config.googleAnalyticsId.length > 0 },
      { key: "ogImage", weight: 10, valid: config.ogImage.length > 0 },
      { key: "language", weight: 5, valid: config.language.length > 0 },
    ]

    checks.forEach((check) => {
      if (check.valid) {
        score += check.weight
      }
    })

    return score
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const seoScore = getSeoScore()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações SEO</h1>
          <p className="text-gray-600 mt-2">Configure o título, descrição e otimizações SEO do seu site</p>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant={seoScore >= 80 ? "default" : seoScore >= 60 ? "secondary" : "destructive"}>
            SEO Score: {seoScore}%
          </Badge>

          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

      {saveMessage && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{saveMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título da Página *</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Ex: Loja de Moda Feminina - As Melhores Tendências"
                  maxLength={60}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Ideal: 10-60 caracteres</span>
                  <span className={config.title.length > 60 ? "text-red-500" : "text-gray-500"}>
                    {config.title.length}/60
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="author">Autor/Empresa *</Label>
                <Input
                  id="author"
                  value={config.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Ex: Moda Bella Ltda"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição SEO *</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Descreva seu negócio de forma atrativa para aparecer nos resultados do Google..."
                  maxLength={160}
                  rows={3}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Ideal: 120-160 caracteres</span>
                  <span className={config.description.length > 160 ? "text-red-500" : "text-gray-500"}>
                    {config.description.length}/160
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="keywords">Palavras-chave</Label>
                <Input
                  id="keywords"
                  value={config.keywords}
                  onChange={(e) => handleInputChange("keywords", e.target.value)}
                  placeholder="moda feminina, roupas, vestidos, blusas, calças"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separe as palavras-chave por vírgula. Mínimo 3 palavras recomendado.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Technical Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url">URL do Site</Label>
                <Input
                  id="url"
                  value={config.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  placeholder="https://www.seusite.com.br"
                />
              </div>

              <div>
                <Label htmlFor="language">Idioma</Label>
                <Input
                  id="language"
                  value={config.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                  placeholder="pt-BR"
                />
              </div>

              <div>
                <Label htmlFor="favicon">Favicon</Label>
                <Input
                  id="favicon"
                  value={config.favicon}
                  onChange={(e) => handleInputChange("favicon", e.target.value)}
                  placeholder="/favicon.ico"
                />
              </div>

              <div>
                <Label htmlFor="ogImage">Imagem Open Graph</Label>
                <Input
                  id="ogImage"
                  value={config.ogImage}
                  onChange={(e) => handleInputChange("ogImage", e.target.value)}
                  placeholder="/og-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Imagem que aparece quando compartilham seu site nas redes sociais (1200x630px)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Analytics e Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={config.googleAnalyticsId}
                  onChange={(e) => handleInputChange("googleAnalyticsId", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
                <Input
                  id="googleTagManagerId"
                  value={config.googleTagManagerId}
                  onChange={(e) => handleInputChange("googleTagManagerId", e.target.value)}
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div>
                <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixelId"
                  value={config.facebookPixelId}
                  onChange={(e) => handleInputChange("facebookPixelId", e.target.value)}
                  placeholder="123456789012345"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview and Score */}
        <div className="space-y-6">
          {/* Google Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Preview Google
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {config.title || "Título da sua página"}
                </div>
                <div className="text-green-700 text-sm mt-1">{config.url || "https://www.seusite.com.br"}</div>
                <div className="text-gray-600 text-sm mt-2">
                  {config.description || "Descrição da sua página aparecerá aqui nos resultados de busca do Google..."}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Título (10-60 chars)</span>
                  {config.title.length >= 10 && config.title.length <= 60 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Descrição (120-160 chars)</span>
                  {config.description.length >= 120 && config.description.length <= 160 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Palavras-chave (min 3)</span>
                  {config.keywords.split(",").length >= 3 && config.keywords.trim() ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Google Analytics</span>
                  {config.googleAnalyticsId ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Imagem Open Graph</span>
                  {config.ogImage ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{seoScore}%</div>
                <div className="text-sm text-gray-600">Score SEO</div>
                {seoScore >= 80 && <Badge className="mt-2 bg-green-100 text-green-800">Excelente</Badge>}
                {seoScore >= 60 && seoScore < 80 && <Badge className="mt-2 bg-yellow-100 text-yellow-800">Bom</Badge>}
                {seoScore < 60 && <Badge className="mt-2 bg-red-100 text-red-800">Precisa melhorar</Badge>}
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Dicas Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Use palavras-chave no título</p>
                <p>• Descrição deve ser atrativa</p>
                <p>• Configure o Google Analytics</p>
                <p>• Adicione imagem Open Graph</p>
                <p>• Teste em dispositivos móveis</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
