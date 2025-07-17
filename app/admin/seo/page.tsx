"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Save, Eye, CheckCircle, AlertCircle, XCircle, Search, BarChart3, Globe } from "lucide-react"
import { toast } from "sonner"

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

export default function SeoConfigPage() {
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
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setIsClient(true)

    const savedConfig = localStorage.getItem("seo-config")
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      localStorage.setItem("seo-config", JSON.stringify(config))

      // Disparar evento para atualizar outros componentes
      window.dispatchEvent(new CustomEvent("seo-config-updated"))

      toast.success("Configurações salvas com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar configurações")
    } finally {
      setIsSaving(false)
    }
  }

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

  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações de SEO</h1>
          <p className="text-gray-600">Configure título, descrição e outras informações importantes</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Score SEO</div>
            <div className="text-lg font-bold">
              <span className={seoScore >= 80 ? "text-green-600" : seoScore >= 60 ? "text-yellow-600" : "text-red-600"}>
                {seoScore}/100
              </span>
            </div>
          </div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>Configure título, descrição e palavras-chave do seu site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Página</Label>
                <Input
                  id="title"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Ex: Moda Feminina Premium - Roupas de Qualidade"
                />
                <div className="flex justify-between text-xs">
                  <span
                    className={
                      config.title.length >= 30 && config.title.length <= 60 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {config.title.length >= 30 && config.title.length <= 60
                      ? "Tamanho ideal"
                      : "Recomendado: 30-60 caracteres"}
                  </span>
                  <span className="text-gray-500">{config.title.length}/60</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">Nome da Empresa/Autor</Label>
                <Input
                  id="author"
                  value={config.author}
                  onChange={(e) => setConfig({ ...config, author: e.target.value })}
                  placeholder="Ex: Moda Premium Ltda"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição SEO</Label>
                <Textarea
                  id="description"
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  placeholder="Descreva seu site de forma atrativa para aparecer nos resultados de busca"
                  rows={3}
                />
                <div className="flex justify-between text-xs">
                  <span
                    className={
                      config.description.length >= 120 && config.description.length <= 160
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {config.description.length >= 120 && config.description.length <= 160
                      ? "Tamanho ideal"
                      : "Recomendado: 120-160 caracteres"}
                  </span>
                  <span className="text-gray-500">{config.description.length}/160</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Palavras-chave</Label>
                <Input
                  id="keywords"
                  value={config.keywords}
                  onChange={(e) => setConfig({ ...config, keywords: e.target.value })}
                  placeholder="moda feminina, roupas, vestidos, blusas"
                />
                <p className="text-xs text-gray-500">
                  Separe as palavras-chave com vírgulas. Atual:{" "}
                  {config.keywords.split(",").filter((k) => k.trim()).length} palavras
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Configurações Técnicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Configurações Técnicas
              </CardTitle>
              <CardDescription>URL do site e configurações de idioma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL do Site</Label>
                <Input
                  id="url"
                  value={config.url}
                  onChange={(e) => setConfig({ ...config, url: e.target.value })}
                  placeholder="https://seusite.com.br"
                />
              </div>

              <div className="space-y-2">
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

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Analytics e Tracking
              </CardTitle>
              <CardDescription>Configure ferramentas de análise e monitoramento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                <Input
                  id="googleAnalytics"
                  value={config.googleAnalytics}
                  onChange={(e) => setConfig({ ...config, googleAnalytics: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="googleTagManager">Google Tag Manager ID</Label>
                <Input
                  id="googleTagManager"
                  value={config.googleTagManager}
                  onChange={(e) => setConfig({ ...config, googleTagManager: e.target.value })}
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div className="space-y-2">
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

        {/* Sidebar com preview e checklist */}
        <div className="space-y-6">
          {/* Score SEO */}
          <Card>
            <CardHeader>
              <CardTitle>Score SEO</CardTitle>
              <CardDescription>Pontuação baseada nas melhores práticas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold">
                  <span
                    className={seoScore >= 80 ? "text-green-600" : seoScore >= 60 ? "text-yellow-600" : "text-red-600"}
                  >
                    {seoScore}
                  </span>
                  <span className="text-gray-400">/100</span>
                </div>
                <p className="text-sm text-gray-600">
                  {seoScore >= 80 ? "Excelente!" : seoScore >= 60 ? "Bom" : "Precisa melhorar"}
                </p>
              </div>
              <Progress value={seoScore} className="mb-4" />
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Título otimizado</span>
                  {config.title.length >= 30 && config.title.length <= 60 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Descrição otimizada</span>
                  {config.description.length >= 120 && config.description.length <= 160 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Palavras-chave</span>
                  {config.keywords.split(",").length >= 3 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Google Analytics</span>
                  {config.googleAnalytics ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview do Google */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                Preview do Google
              </CardTitle>
              <CardDescription>Como seu site aparecerá nos resultados de busca</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-white">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                  {config.title || "Título da página"}
                </div>
                <div className="text-green-700 text-sm">{config.url || "https://seusite.com.br"}</div>
                <div className="text-gray-600 text-sm mt-1">
                  {config.description || "Descrição da página aparecerá aqui..."}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Checklist SEO</CardTitle>
              <CardDescription>Itens importantes para otimização</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                {config.title.length >= 30 && config.title.length <= 60 ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="text-sm">
                  <div className="font-medium">Título otimizado</div>
                  <div className="text-gray-500">30-60 caracteres</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                {config.description.length >= 120 && config.description.length <= 160 ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="text-sm">
                  <div className="font-medium">Descrição otimizada</div>
                  <div className="text-gray-500">120-160 caracteres</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                {config.keywords.split(",").filter((k) => k.trim()).length >= 3 ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="text-sm">
                  <div className="font-medium">Palavras-chave</div>
                  <div className="text-gray-500">Mínimo 3 palavras</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                {config.author ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="text-sm">
                  <div className="font-medium">Autor/Empresa</div>
                  <div className="text-gray-500">Nome definido</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                {config.googleAnalytics ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                )}
                <div className="text-sm">
                  <div className="font-medium">Google Analytics</div>
                  <div className="text-gray-500">Tracking configurado</div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                {config.googleTagManager ? (
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                )}
                <div className="text-sm">
                  <div className="font-medium">Tag Manager</div>
                  <div className="text-gray-500">Opcional</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
