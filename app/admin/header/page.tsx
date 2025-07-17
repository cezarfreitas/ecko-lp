"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Eye, RotateCcw } from "lucide-react"

interface HeaderData {
  logo: string
  title: string
  subtitle: string
  description: string
  backgroundImage: string
  ctaText: string
  ctaLink: string
  showCta: boolean
  showScrollIndicator: boolean
  textColor: string
  overlayOpacity: number
}

const DEFAULT_HEADER_DATA: HeaderData = {
  logo: "/placeholder.svg?height=80&width=200&text=Logo",
  title: "Bem-vindos à Nossa Empresa",
  subtitle: "Soluções Inovadoras",
  description:
    "Oferecemos produtos e serviços de alta qualidade para transformar seu negócio e alcançar resultados extraordinários.",
  backgroundImage: "/placeholder.svg?height=600&width=1200&text=Header+Background",
  ctaText: "Conheça Nossos Produtos",
  ctaLink: "#produtos",
  showCta: true,
  showScrollIndicator: true,
  textColor: "#ffffff",
  overlayOpacity: 0.5,
}

export default function AdminHeader() {
  const [headerData, setHeaderData] = useState<HeaderData>(DEFAULT_HEADER_DATA)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    loadHeaderData()
  }, [])

  const loadHeaderData = () => {
    try {
      const savedData = localStorage.getItem("header-data")
      if (savedData) {
        const parsed = JSON.parse(savedData)
        setHeaderData({ ...DEFAULT_HEADER_DATA, ...parsed })
      }
    } catch (error) {
      console.error("Erro ao carregar dados do header:", error)
    }
  }

  const saveHeaderData = (newData: HeaderData) => {
    setSaveStatus("saving")
    try {
      localStorage.setItem("header-data", JSON.stringify(newData))
      setHeaderData(newData)

      // Notificar outros componentes
      window.dispatchEvent(new CustomEvent("header-updated", { detail: newData }))

      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Erro ao salvar dados do header:", error)
      setSaveStatus("idle")
    }
  }

  const updateField = (field: keyof HeaderData, value: string | boolean | number) => {
    const newData = { ...headerData, [field]: value }
    saveHeaderData(newData)
  }

  const handleImageUpload = (field: "logo" | "backgroundImage") => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          updateField(field, result)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const restoreDefaults = () => {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão do header?")) {
      saveHeaderData(DEFAULT_HEADER_DATA)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuração do Header</h1>
          <p className="text-gray-600">Personalize o cabeçalho da sua landing page</p>
        </div>
        <div className="flex items-center gap-4">
          {saveStatus === "saving" && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Salvando...</span>
            </div>
          )}
          {saveStatus === "saved" && (
            <div className="flex items-center gap-2 text-green-600">
              <span className="text-sm">✅ Salvo</span>
            </div>
          )}
          <Button onClick={() => window.open("/", "_blank")} variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Ver Site
          </Button>
          <Button onClick={restoreDefaults} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restaurar Padrão
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">📝 Conteúdo</TabsTrigger>
          <TabsTrigger value="design">🎨 Design</TabsTrigger>
          <TabsTrigger value="preview">👁️ Preview</TabsTrigger>
        </TabsList>

        {/* TAB CONTEÚDO */}
        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Textos do Header</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Título Principal</Label>
                <Input
                  id="title"
                  value={headerData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Bem-vindos à Nossa Empresa"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={headerData.subtitle}
                  onChange={(e) => updateField("subtitle", e.target.value)}
                  placeholder="Soluções Inovadoras"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={headerData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Oferecemos produtos e serviços de alta qualidade..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Call to Action (CTA)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showCta"
                  checked={headerData.showCta}
                  onCheckedChange={(checked) => updateField("showCta", checked)}
                />
                <Label htmlFor="showCta">Mostrar botão de ação</Label>
              </div>

              {headerData.showCta && (
                <>
                  <div>
                    <Label htmlFor="ctaText">Texto do Botão</Label>
                    <Input
                      id="ctaText"
                      value={headerData.ctaText}
                      onChange={(e) => updateField("ctaText", e.target.value)}
                      placeholder="Conheça Nossos Produtos"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ctaLink">Link do Botão</Label>
                    <Input
                      id="ctaLink"
                      value={headerData.ctaLink}
                      onChange={(e) => updateField("ctaLink", e.target.value)}
                      placeholder="#produtos ou https://exemplo.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use # para links internos (ex: #contato) ou URLs completas para links externos
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações Extras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showScrollIndicator"
                  checked={headerData.showScrollIndicator}
                  onCheckedChange={(checked) => updateField("showScrollIndicator", checked)}
                />
                <Label htmlFor="showScrollIndicator">Mostrar indicador de scroll</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB DESIGN */}
        <TabsContent value="design" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Imagens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Logo</Label>
                <div className="flex items-center gap-4 mt-2">
                  <img
                    src={headerData.logo || "/placeholder.svg"}
                    alt="Logo"
                    className="h-16 w-auto object-contain border rounded"
                  />
                  <Button onClick={() => handleImageUpload("logo")} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar Logo
                  </Button>
                </div>
              </div>

              <div>
                <Label>Imagem de Fundo</Label>
                <div className="mt-2">
                  <div
                    className="h-32 bg-cover bg-center rounded border mb-4"
                    style={{ backgroundImage: `url(${headerData.backgroundImage})` }}
                  />
                  <Button onClick={() => handleImageUpload("backgroundImage")} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Alterar Fundo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cores e Estilo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="textColor">Cor do Texto</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={headerData.textColor}
                    onChange={(e) => updateField("textColor", e.target.value)}
                    className="w-16 h-10 p-1 border rounded"
                  />
                  <Input
                    value={headerData.textColor}
                    onChange={(e) => updateField("textColor", e.target.value)}
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="overlayOpacity">
                  Opacidade do Overlay ({Math.round(headerData.overlayOpacity * 100)}%)
                </Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={headerData.overlayOpacity}
                  onChange={(e) => updateField("overlayOpacity", Number.parseFloat(e.target.value))}
                  className="w-full mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Controla a transparência da camada escura sobre a imagem de fundo
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB PREVIEW */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview do Header</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div
                  className="relative h-96 flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${headerData.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black" style={{ opacity: headerData.overlayOpacity }} />

                  {/* Content */}
                  <div className="relative z-10 text-center px-4 max-w-2xl">
                    {/* Logo */}
                    {headerData.logo && (
                      <div className="mb-4">
                        <img
                          src={headerData.logo || "/placeholder.svg"}
                          alt="Logo"
                          className="h-12 mx-auto object-contain"
                        />
                      </div>
                    )}

                    {/* Subtitle */}
                    {headerData.subtitle && (
                      <p className="text-lg font-medium mb-2 opacity-90" style={{ color: headerData.textColor }}>
                        {headerData.subtitle}
                      </p>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-4 leading-tight" style={{ color: headerData.textColor }}>
                      {headerData.title}
                    </h1>

                    {/* Description */}
                    {headerData.description && (
                      <p className="text-lg mb-6 opacity-90" style={{ color: headerData.textColor }}>
                        {headerData.description}
                      </p>
                    )}

                    {/* CTA Button */}
                    {headerData.showCta && headerData.ctaText && (
                      <Button className="bg-red-600 hover:bg-red-700 text-white">{headerData.ctaText}</Button>
                    )}
                  </div>

                  {/* Scroll Indicator */}
                  {headerData.showScrollIndicator && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="text-center" style={{ color: headerData.textColor }}>
                        <p className="text-sm mb-1">Role para baixo</p>
                        <div className="w-6 h-6 border-2 border-current rounded-full mx-auto animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Dicas de Otimização:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use imagens de alta qualidade (mínimo 1920x1080px)</li>
                  <li>• Mantenha o texto conciso e impactante</li>
                  <li>• Teste diferentes opacidades de overlay para melhor legibilidade</li>
                  <li>• Certifique-se de que o CTA seja claro e atrativo</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
