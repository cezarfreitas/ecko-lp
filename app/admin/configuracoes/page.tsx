"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { GripVertical, Eye, EyeOff } from "lucide-react"

interface GlobalConfig {
  fonts: {
    primary: string
    secondary: string
    size: {
      small: string
      base: string
      large: string
      xlarge: string
    }
  }
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    backgroundSection: string
    backgroundCard: string
    text: {
      primary: string
      secondary: string
      muted: string
    }
    success: string
    warning: string
    error: string
  }
  spacing: {
    section: string
    container: string
  }
  footer: {
    text: string
    company: string
    showHeart: boolean
  }
}

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
  schema: {
    type: string
    name: string
    description: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    phone: string
    email: string
    socialMedia: {
      facebook: string
      instagram: string
      twitter: string
      linkedin: string
      youtube: string
    }
  }
}

interface SectionConfig {
  id: string
  name: string
  component: string
  enabled: boolean
  order: number
  description: string
}

const DEFAULT_CONFIG: GlobalConfig = {
  fonts: {
    primary: "Inter, system-ui, sans-serif",
    secondary: "Georgia, serif",
    size: {
      small: "0.875rem",
      base: "1rem",
      large: "1.25rem",
      xlarge: "2rem",
    },
  },
  colors: {
    primary: "#dc2626", // red-600
    secondary: "#1f2937", // gray-800
    accent: "#f59e0b", // amber-500
    background: "#ffffff",
    backgroundSection: "#f9fafb", // gray-50
    backgroundCard: "#ffffff",
    text: {
      primary: "#111827", // gray-900
      secondary: "#6b7280", // gray-500
      muted: "#9ca3af", // gray-400
    },
    success: "#10b981", // emerald-500
    warning: "#f59e0b", // amber-500
    error: "#ef4444", // red-500
  },
  spacing: {
    section: "5rem",
    container: "1200px",
  },
  footer: {
    text: "Desenvolvido com ❤️ por",
    company: "Sua Empresa",
    showHeart: true,
  },
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  title: "Landing Page CMS - Sistema de Gerenciamento",
  description:
    "Sistema completo de gerenciamento de conteúdo para landing pages com FAQ, depoimentos, galeria e analytics avançados.",
  keywords: "landing page, cms, gerenciamento, faq, depoimentos, galeria, analytics, leads",
  author: "Sua Empresa",
  url: "https://seusite.com.br",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  language: "pt-BR",
  ogImage: "/og-image.jpg",
  twitterCard: "summary_large_image",
  googleAnalytics: "",
  googleTagManager: "",
  facebookPixel: "",
  schema: {
    type: "Organization",
    name: "Sua Empresa",
    description: "Empresa especializada em soluções digitais inovadoras",
    address: {
      street: "Rua Exemplo, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      country: "Brasil",
    },
    phone: "+55 11 99999-9999",
    email: "contato@seusite.com.br",
    socialMedia: {
      facebook: "https://facebook.com/suaempresa",
      instagram: "https://instagram.com/suaempresa",
      twitter: "https://twitter.com/suaempresa",
      linkedin: "https://linkedin.com/company/suaempresa",
      youtube: "https://youtube.com/@suaempresa",
    },
  },
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  {
    id: "header",
    name: "Header/Cabeçalho",
    component: "HeaderSection",
    enabled: true,
    order: 0,
    description: "Cabeçalho com logo, frase e imagem de fundo",
  },
  {
    id: "empresa",
    name: "Sobre a Empresa",
    component: "EmpresaSection",
    enabled: true,
    order: 1,
    description: "Seção com informações sobre a empresa e história",
  },
  {
    id: "showroom",
    name: "Showroom",
    component: "ShowroomSection",
    enabled: true,
    order: 2,
    description: "Galeria de produtos em destaque",
  },
  {
    id: "galeria",
    name: "Galeria",
    component: "GaleriaSection",
    enabled: true,
    order: 3,
    description: "Galeria completa de imagens dos produtos",
  },
  {
    id: "depoimentos",
    name: "Depoimentos",
    component: "DepoimentosSection",
    enabled: true,
    order: 4,
    description: "Avaliações e depoimentos de clientes",
  },
  {
    id: "revenda",
    name: "Seja Revendedor",
    component: "RevendaSection",
    enabled: true,
    order: 5,
    description: "Informações sobre programa de revenda",
  },
  {
    id: "faq",
    name: "Perguntas Frequentes",
    component: "FAQSection",
    enabled: true,
    order: 6,
    description: "Dúvidas mais comuns dos clientes",
  },
  {
    id: "contato",
    name: "Contato",
    component: "ContatoSection",
    enabled: true,
    order: 7,
    description: "Formulário de contato e informações",
  },
]

const FONT_OPTIONS = [
  { value: "Inter, system-ui, sans-serif", label: "Inter (Moderno)" },
  { value: "Roboto, sans-serif", label: "Roboto (Clean)" },
  { value: "Poppins, sans-serif", label: "Poppins (Friendly)" },
  { value: "Montserrat, sans-serif", label: "Montserrat (Elegante)" },
  { value: "Open Sans, sans-serif", label: "Open Sans (Legível)" },
  { value: "Lato, sans-serif", label: "Lato (Profissional)" },
  { value: "Source Sans Pro, sans-serif", label: "Source Sans Pro" },
  { value: "Nunito, sans-serif", label: "Nunito (Amigável)" },
  { value: "Georgia, serif", label: "Georgia (Serif)" },
  { value: "Playfair Display, serif", label: "Playfair Display (Elegante)" },
  { value: "system-ui, sans-serif", label: "Sistema Padrão" },
]

const COLOR_PRESETS = [
  {
    name: "Vermelho Clássico",
    colors: {
      primary: "#dc2626",
      secondary: "#1f2937",
      accent: "#f59e0b",
      background: "#ffffff",
      backgroundSection: "#fef2f2",
      backgroundCard: "#ffffff",
    },
  },
  {
    name: "Azul Corporativo",
    colors: {
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#06b6d4",
      background: "#ffffff",
      backgroundSection: "#eff6ff",
      backgroundCard: "#ffffff",
    },
  },
  {
    name: "Verde Moderno",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#10b981",
      background: "#ffffff",
      backgroundSection: "#ecfdf5",
      backgroundCard: "#ffffff",
    },
  },
  {
    name: "Roxo Criativo",
    colors: {
      primary: "#7c3aed",
      secondary: "#5b21b6",
      accent: "#a855f7",
      background: "#ffffff",
      backgroundSection: "#f5f3ff",
      backgroundCard: "#ffffff",
    },
  },
  {
    name: "Rosa Elegante",
    colors: {
      primary: "#e11d48",
      secondary: "#be185d",
      accent: "#f43f5e",
      background: "#ffffff",
      backgroundSection: "#fdf2f8",
      backgroundCard: "#ffffff",
    },
  },
  {
    name: "Tema Escuro",
    colors: {
      primary: "#f59e0b",
      secondary: "#d97706",
      accent: "#fbbf24",
      background: "#111827",
      backgroundSection: "#1f2937",
      backgroundCard: "#374151",
    },
  },
]

export default function AdminConfiguracoes() {
  const [config, setConfig] = useState<GlobalConfig>(DEFAULT_CONFIG)
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG)
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    loadGlobalConfig()

    // Carregar Site Config
    const savedSiteConfig = localStorage.getItem("site-config")
    if (savedSiteConfig) {
      setSiteConfig({ ...DEFAULT_SITE_CONFIG, ...JSON.parse(savedSiteConfig) })
    }

    // Carregar Sections Config
    const savedSections = localStorage.getItem("sections-config")
    if (savedSections) {
      setSections(JSON.parse(savedSections))
    }
  }, [])

  const loadGlobalConfig = () => {
    try {
      const savedConfig = localStorage.getItem("global-config")
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig)
        setConfig({ ...DEFAULT_CONFIG, ...parsed })
      }
    } catch (error) {
      console.error("Erro ao carregar configuração global:", error)
    }
  }

  const saveGlobalConfig = (newConfig: GlobalConfig) => {
    setSaveStatus("saving")
    try {
      localStorage.setItem("global-config", JSON.stringify(newConfig))
      setConfig(newConfig)

      // Aplicar configurações no CSS
      applyGlobalStyles(newConfig)

      // Notificar outros componentes
      window.dispatchEvent(new CustomEvent("global-config-updated", { detail: newConfig }))

      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Erro ao salvar configuração global:", error)
      setSaveStatus("idle")
    }
  }

  const saveSiteConfig = (newConfig: SiteConfig) => {
    setSaveStatus("saving")
    try {
      localStorage.setItem("site-config", JSON.stringify(newConfig))
      setSiteConfig(newConfig)

      // Aplicar configurações de SEO
      applySEOConfig(newConfig)

      // Notificar outros componentes
      window.dispatchEvent(new CustomEvent("site-config-updated", { detail: newConfig }))

      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Erro ao salvar configuração do site:", error)
      setSaveStatus("idle")
    }
  }

  const saveSectionsConfig = (newSections: SectionConfig[]) => {
    setSaveStatus("saving")
    try {
      localStorage.setItem("sections-config", JSON.stringify(newSections))
      setSections(newSections)

      // Notificar outros componentes
      window.dispatchEvent(new CustomEvent("sections-config-updated", { detail: newSections }))

      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Erro ao salvar configuração das seções:", error)
      setSaveStatus("idle")
    }
  }

  const applyGlobalStyles = (config: GlobalConfig) => {
    const root = document.documentElement

    // Aplicar cores CSS custom properties
    root.style.setProperty("--color-primary", config.colors.primary)
    root.style.setProperty("--color-secondary", config.colors.secondary)
    root.style.setProperty("--color-accent", config.colors.accent)
    root.style.setProperty("--color-background", config.colors.background)
    root.style.setProperty("--color-background-section", config.colors.backgroundSection || "#f9fafb")
    root.style.setProperty("--color-background-card", config.colors.backgroundCard || "#ffffff")
    root.style.setProperty("--color-text-primary", config.colors.text.primary)
    root.style.setProperty("--color-text-secondary", config.colors.text.secondary)
    root.style.setProperty("--color-text-muted", config.colors.text.muted)
    root.style.setProperty("--color-success", config.colors.success)
    root.style.setProperty("--color-warning", config.colors.warning)
    root.style.setProperty("--color-error", config.colors.error)

    // Aplicar fontes
    root.style.setProperty("--font-primary", config.fonts.primary)
    root.style.setProperty("--font-secondary", config.fonts.secondary)
    root.style.setProperty("--font-size-small", config.fonts.size.small)
    root.style.setProperty("--font-size-base", config.fonts.size.base)
    root.style.setProperty("--font-size-large", config.fonts.size.large)
    root.style.setProperty("--font-size-xlarge", config.fonts.size.xlarge)

    // Aplicar espaçamentos
    root.style.setProperty("--spacing-section", config.spacing.section)
    root.style.setProperty("--spacing-container", config.spacing.container)
  }

  const applySEOConfig = (config: SiteConfig) => {
    if (typeof document === "undefined") return

    // Atualizar title
    document.title = config.title

    // Atualizar meta tags
    updateMetaTag("description", config.description)
    updateMetaTag("keywords", config.keywords)
    updateMetaTag("author", config.author)
    updateMetaTag("og:title", config.title)
    updateMetaTag("og:description", config.description)
    updateMetaTag("og:image", config.ogImage)
    updateMetaTag("og:url", config.url)
    updateMetaTag("twitter:card", config.twitterCard)
    updateMetaTag("twitter:title", config.title)
    updateMetaTag("twitter:description", config.description)
    updateMetaTag("twitter:image", config.ogImage)

    // Atualizar favicon
    updateFavicon(config.favicon)
  }

  const updateMetaTag = (name: string, content: string) => {
    if (typeof document === "undefined") return

    let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement
    if (meta) {
      meta.setAttribute("content", content)
    } else {
      meta = document.createElement("meta")
      if (name.startsWith("og:") || name.startsWith("twitter:")) {
        meta.setAttribute("property", name)
      } else {
        meta.setAttribute("name", name)
      }
      meta.setAttribute("content", content)
      document.head.appendChild(meta)
    }
  }

  const updateFavicon = (href: string) => {
    if (typeof document === "undefined") return

    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement
    if (favicon) {
      favicon.setAttribute("href", href)
    } else {
      favicon = document.createElement("link")
      favicon.setAttribute("rel", "icon")
      favicon.setAttribute("href", href)
      document.head.appendChild(favicon)
    }
  }

  const updateConfig = (path: string, value: string | boolean) => {
    const newConfig = { ...config }
    const keys = path.split(".")
    let current: any = newConfig

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    saveGlobalConfig(newConfig)
  }

  const updateSiteConfig = (path: string, value: string) => {
    const newConfig = { ...siteConfig }
    const keys = path.split(".")
    let current: any = newConfig

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }

    current[keys[keys.length - 1]] = value
    saveSiteConfig(newConfig)
  }

  const applyColorPreset = (preset: (typeof COLOR_PRESETS)[0]) => {
    const newConfig = {
      ...config,
      colors: {
        ...config.colors,
        ...preset.colors,
      },
    }
    saveGlobalConfig(newConfig)
  }

  const resetToDefault = () => {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão?")) {
      saveGlobalConfig(DEFAULT_CONFIG)
    }
  }

  // Funções para gerenciar seções
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Atualizar ordem
    const updatedSections = items.map((item, index) => ({
      ...item,
      order: index,
    }))

    saveSectionsConfig(updatedSections)
  }

  const toggleSectionEnabled = (sectionId: string) => {
    const updatedSections = sections.map((section) =>
      section.id === sectionId ? { ...section, enabled: !section.enabled } : section,
    )
    saveSectionsConfig(updatedSections)
  }

  const resetSectionsOrder = () => {
    if (confirm("Tem certeza que deseja restaurar a ordem padrão das seções?")) {
      saveSectionsConfig(DEFAULT_SECTIONS)
    }
  }

  const exportData = () => {
    setIsExporting(true)
    try {
      const faqData = localStorage.getItem("faq-data")
      const depoimentosData = localStorage.getItem("depoimentos-data")
      const galeriaData = localStorage.getItem("galeria-data")
      const headerData = localStorage.getItem("header-data")
      const globalConfigData = localStorage.getItem("global-config")
      const siteConfigData = localStorage.getItem("site-config")
      const sectionsConfigData = localStorage.getItem("sections-config")

      const exportData = {
        faq: faqData ? JSON.parse(faqData) : null,
        depoimentos: depoimentosData ? JSON.parse(depoimentosData) : null,
        galeria: galeriaData ? JSON.parse(galeriaData) : null,
        header: headerData ? JSON.parse(headerData) : null,
        globalConfig: globalConfigData ? JSON.parse(globalConfigData) : null,
        siteConfig: siteConfigData ? JSON.parse(siteConfigData) : null,
        sectionsConfig: sectionsConfigData ? JSON.parse(sectionsConfigData) : null,
        exportDate: new Date().toISOString(),
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `landing-cms-backup-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Erro ao exportar dados:", error)
      alert("Erro ao exportar dados")
    } finally {
      setIsExporting(false)
    }
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)

        if (importedData.faq) {
          localStorage.setItem("faq-data", JSON.stringify(importedData.faq))
          window.dispatchEvent(new CustomEvent("faq-updated", { detail: importedData.faq }))
        }

        if (importedData.depoimentos) {
          localStorage.setItem("depoimentos-data", JSON.stringify(importedData.depoimentos))
          window.dispatchEvent(new CustomEvent("depoimentos-updated", { detail: importedData.depoimentos }))
        }

        if (importedData.galeria) {
          localStorage.setItem("galeria-data", JSON.stringify(importedData.galeria))
          window.dispatchEvent(new CustomEvent("galeria-updated", { detail: importedData.galeria }))
        }

        if (importedData.header) {
          localStorage.setItem("header-data", JSON.stringify(importedData.header))
          window.dispatchEvent(new CustomEvent("header-updated", { detail: importedData.header }))
        }

        if (importedData.globalConfig) {
          saveGlobalConfig(importedData.globalConfig)
        }

        if (importedData.siteConfig) {
          saveSiteConfig(importedData.siteConfig)
        }

        if (importedData.sectionsConfig) {
          saveSectionsConfig(importedData.sectionsConfig)
        }

        alert("Dados importados com sucesso!")
        window.location.reload()
      } catch (error) {
        console.error("Erro ao importar dados:", error)
        alert("Erro ao importar dados. Verifique se o arquivo está correto.")
      } finally {
        setIsImporting(false)
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    if (confirm("Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita.")) {
      localStorage.removeItem("faq-data")
      localStorage.removeItem("depoimentos-data")
      localStorage.removeItem("galeria-data")
      localStorage.removeItem("header-data")
      localStorage.removeItem("global-config")
      localStorage.removeItem("site-config")
      localStorage.removeItem("sections-config")
      alert("Todos os dados foram limpos!")
      window.location.reload()
    }
  }

  // Aplicar estilos na inicialização
  useEffect(() => {
    applyGlobalStyles(config)
  }, [config])

  // Aplicar configurações de SEO na inicialização
  useEffect(() => {
    applySEOConfig(siteConfig)
  }, [siteConfig])

  return (
    <div className="space-y-6">
      {/* Header com Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações Globais</h1>
          <p className="text-gray-600">Personalize fontes, cores e espaçamentos do site</p>
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>

      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="design">🎨 Design</TabsTrigger>
          <TabsTrigger value="sections">📋 Seções</TabsTrigger>
          <TabsTrigger value="seo">🔍 SEO</TabsTrigger>
          <TabsTrigger value="backup">💾 Backup</TabsTrigger>
          <TabsTrigger value="sistema">⚙️ Sistema</TabsTrigger>
        </TabsList>

        {/* TAB DESIGN */}
        <TabsContent value="design" className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview das Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="p-6 rounded-lg border-2 border-dashed border-gray-300"
                style={{
                  fontFamily: config.fonts.primary,
                  backgroundColor: config.colors.background,
                  color: config.colors.text.primary,
                }}
              >
                <h2 className="text-2xl font-bold mb-4" style={{ color: config.colors.primary }}>
                  Título Principal
                </h2>
                <p className="mb-4" style={{ color: config.colors.text.secondary }}>
                  Este é um exemplo de como o texto secundário aparecerá no site com as configurações atuais.
                </p>
                <button
                  className="px-6 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: config.colors.primary }}
                >
                  Botão de Ação
                </button>
                <div className="mt-4 flex gap-2">
                  <span
                    className="px-3 py-1 rounded text-sm"
                    style={{ backgroundColor: config.colors.success, color: "white" }}
                  >
                    Sucesso
                  </span>
                  <span
                    className="px-3 py-1 rounded text-sm"
                    style={{ backgroundColor: config.colors.warning, color: "white" }}
                  >
                    Aviso
                  </span>
                  <span
                    className="px-3 py-1 rounded text-sm"
                    style={{ backgroundColor: config.colors.error, color: "white" }}
                  >
                    Erro
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Fonte */}
          <Card>
            <CardHeader>
              <CardTitle>Tipografia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fonte Principal</label>
                  <Select value={config.fonts.primary} onValueChange={(value) => updateConfig("fonts.primary", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fonte Secundária</label>
                  <Select
                    value={config.fonts.secondary}
                    onValueChange={(value) => updateConfig("fonts.secondary", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.value }}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Texto Pequeno</label>
                  <Input
                    value={config.fonts.size.small}
                    onChange={(e) => updateConfig("fonts.size.small", e.target.value)}
                    placeholder="0.875rem"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Texto Base</label>
                  <Input
                    value={config.fonts.size.base}
                    onChange={(e) => updateConfig("fonts.size.base", e.target.value)}
                    placeholder="1rem"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Texto Grande</label>
                  <Input
                    value={config.fonts.size.large}
                    onChange={(e) => updateConfig("fonts.size.large", e.target.value)}
                    placeholder="1.25rem"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Título</label>
                  <Input
                    value={config.fonts.size.xlarge}
                    onChange={(e) => updateConfig("fonts.size.xlarge", e.target.value)}
                    placeholder="2rem"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Presets de Cores */}
          <Card>
            <CardHeader>
              <CardTitle>Presets de Cores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyColorPreset(preset)}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all text-left"
                  >
                    <div className="flex gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.primary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.secondary }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.colors.accent }} />
                    </div>
                    <p className="text-sm font-medium">{preset.name}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Cores Personalizadas */}
          <Card>
            <CardHeader>
              <CardTitle>Cores Personalizadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cor Primária</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.colors.primary}
                      onChange={(e) => updateConfig("colors.primary", e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.colors.primary}
                      onChange={(e) => updateConfig("colors.primary", e.target.value)}
                      placeholder="#dc2626"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cor Secundária</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.colors.secondary}
                      onChange={(e) => updateConfig("colors.secondary", e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.colors.secondary}
                      onChange={(e) => updateConfig("colors.secondary", e.target.value)}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cor de Destaque</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.colors.accent}
                      onChange={(e) => updateConfig("colors.accent", e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.colors.accent}
                      onChange={(e) => updateConfig("colors.accent", e.target.value)}
                      placeholder="#f59e0b"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Texto Principal</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.colors.text.primary}
                      onChange={(e) => updateConfig("colors.text.primary", e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.colors.text.primary}
                      onChange={(e) => updateConfig("colors.text.primary", e.target.value)}
                      placeholder="#111827"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Texto Secundário</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.colors.text.secondary}
                      onChange={(e) => updateConfig("colors.text.secondary", e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.colors.text.secondary}
                      onChange={(e) => updateConfig("colors.text.secondary", e.target.value)}
                      placeholder="#6b7280"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Texto Esmaecido</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.colors.text.muted}
                      onChange={(e) => updateConfig("colors.text.muted", e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.colors.text.muted}
                      onChange={(e) => updateConfig("colors.text.muted", e.target.value)}
                      placeholder="#9ca3af"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cor de Fundo</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.colors.background}
                      onChange={(e) => updateConfig("colors.background", e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.colors.background}
                      onChange={(e) => updateConfig("colors.background", e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cor de Fundo Seção</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.colors.backgroundSection || "#f9fafb"}
                      onChange={(e) => updateConfig("colors.backgroundSection", e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.colors.backgroundSection || "#f9fafb"}
                      onChange={(e) => updateConfig("colors.backgroundSection", e.target.value)}
                      placeholder="#f9fafb"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Cor de Fundo Card</label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.colors.backgroundCard || "#ffffff"}
                      onChange={(e) => updateConfig("colors.backgroundCard", e.target.value)}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={config.colors.backgroundCard || "#ffffff"}
                      onChange={(e) => updateConfig("colors.backgroundCard", e.target.value)}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações do Rodapé */}
          <Card>
            <CardHeader>
              <CardTitle>🦶 Configurações do Rodapé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Texto do Rodapé</label>
                  <Input
                    value={config.footer.text}
                    onChange={(e) => updateConfig("footer.text", e.target.value)}
                    placeholder="Desenvolvido com ❤️ por"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Empresa</label>
                  <Input
                    value={config.footer.company}
                    onChange={(e) => updateConfig("footer.company", e.target.value)}
                    placeholder="Sua Empresa"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showHeart"
                  checked={config.footer.showHeart}
                  onChange={(e) => updateConfig("footer.showHeart", e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showHeart" className="text-sm font-medium">
                  Mostrar coração (❤️) no rodapé
                </label>
              </div>

              {/* Preview do Rodapé */}
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <p className="text-center text-gray-500 text-sm">
                  {config.footer.text} {config.footer.showHeart && "❤️"}{" "}
                  <span className="text-red-600 font-medium">{config.footer.company}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4">
            <Button onClick={resetToDefault} variant="outline">
              🔄 Restaurar Padrão
            </Button>
            <Button onClick={() => window.open("/", "_blank")} variant="outline">
              👁️ Ver Site
            </Button>
          </div>
        </TabsContent>

        {/* TAB SEÇÕES */}
        <TabsContent value="sections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                📋 Ordenação das Seções
                <Button onClick={resetSectionsOrder} variant="outline" size="sm">
                  🔄 Restaurar Ordem Padrão
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Arraste e solte as seções para reorganizar a ordem de exibição no site. Use o botão de visibilidade para
                mostrar/ocultar seções.
              </p>

              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                      {sections
                        .sort((a, b) => a.order - b.order)
                        .map((section, index) => (
                          <Draggable key={section.id} draggableId={section.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`p-4 border rounded-lg bg-white transition-all ${
                                  snapshot.isDragging ? "shadow-lg border-blue-300" : "border-gray-200"
                                } ${!section.enabled ? "opacity-50" : ""}`}
                              >
                                <div className="flex items-center gap-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
                                  >
                                    <GripVertical size={20} />
                                  </div>

                                  <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        #{section.order + 1}
                                      </span>
                                      <h3 className="font-medium text-gray-900">{section.name}</h3>
                                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                        {section.component}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                                  </div>

                                  <button
                                    onClick={() => toggleSectionEnabled(section.id)}
                                    className={`p-2 rounded-lg transition-colors ${
                                      section.enabled
                                        ? "text-green-600 hover:bg-green-50"
                                        : "text-gray-400 hover:bg-gray-50"
                                    }`}
                                    title={section.enabled ? "Ocultar seção" : "Mostrar seção"}
                                  >
                                    {section.enabled ? <Eye size={20} /> : <EyeOff size={20} />}
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">💡 Dicas de Uso:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Arraste as seções para reorganizar a ordem de exibição</li>
                  <li>• Use o ícone de olho para mostrar/ocultar seções sem removê-las</li>
                  <li>• A numeração é atualizada automaticamente conforme a ordem</li>
                  <li>• Seções ocultas não aparecem no site, mas ficam salvas no sistema</li>
                </ul>
              </div>

              <div className="mt-4 flex gap-2">
                <Button onClick={() => window.open("/", "_blank")} variant="outline">
                  👁️ Visualizar Site
                </Button>
                <Button
                  onClick={() => {
                    const enabledCount = sections.filter((s) => s.enabled).length
                    const totalCount = sections.length
                    alert(`Seções ativas: ${enabledCount}/${totalCount}`)
                  }}
                  variant="outline"
                >
                  📊 Status das Seções
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB SEO */}
        <TabsContent value="seo" className="space-y-6">
          {/* Configurações Básicas do Site */}
          <Card>
            <CardHeader>
              <CardTitle>🌐 Configurações Básicas do Site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Título do Site</label>
                  <Input
                    value={siteConfig.title}
                    onChange={(e) => updateSiteConfig("title", e.target.value)}
                    placeholder="Meu Site Incrível"
                  />
                  <p className="text-xs text-gray-500 mt-1">Aparece na aba do navegador e resultados de busca</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">URL do Site</label>
                  <Input
                    value={siteConfig.url}
                    onChange={(e) => updateSiteConfig("url", e.target.value)}
                    placeholder="https://meusite.com.br"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição do Site</label>
                <Textarea
                  value={siteConfig.description}
                  onChange={(e) => updateSiteConfig("description", e.target.value)}
                  placeholder="Descrição clara e atrativa do seu site..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Máximo 160 caracteres - aparece nos resultados de busca</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Palavras-chave</label>
                <Input
                  value={siteConfig.keywords}
                  onChange={(e) => updateSiteConfig("keywords", e.target.value)}
                  placeholder="palavra1, palavra2, palavra3"
                />
                <p className="text-xs text-gray-500 mt-1">Separe as palavras-chave por vírgula</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Autor/Empresa</label>
                  <Input
                    value={siteConfig.author}
                    onChange={(e) => updateSiteConfig("author", e.target.value)}
                    placeholder="Sua Empresa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Idioma</label>
                  <select
                    value={siteConfig.language}
                    onChange={(e) => updateSiteConfig("language", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es-ES">Español</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Meta Tags e Open Graph */}
          <Card>
            <CardHeader>
              <CardTitle>📱 Redes Sociais (Open Graph)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Imagem de Compartilhamento</label>
                <Input
                  value={siteConfig.ogImage}
                  onChange={(e) => updateSiteConfig("ogImage", e.target.value)}
                  placeholder="/og-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Imagem que aparece ao compartilhar no Facebook, WhatsApp, etc. (1200x630px)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Card do Twitter</label>
                <select
                  value={siteConfig.twitterCard}
                  onChange={(e) => updateSiteConfig("twitterCard", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="summary">Resumo</option>
                  <option value="summary_large_image">Resumo com Imagem Grande</option>
                  <option value="app">App</option>
                  <option value="player">Player</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Logo do Site</label>
                  <Input
                    value={siteConfig.logo}
                    onChange={(e) => updateSiteConfig("logo", e.target.value)}
                    placeholder="/logo.png"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Favicon</label>
                  <Input
                    value={siteConfig.favicon}
                    onChange={(e) => updateSiteConfig("favicon", e.target.value)}
                    placeholder="/favicon.ico"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics e Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Analytics e Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
                <Input
                  value={siteConfig.googleAnalytics}
                  onChange={(e) => updateSiteConfig("googleAnalytics", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-gray-500 mt-1">ID do Google Analytics 4</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Google Tag Manager ID</label>
                <Input
                  value={siteConfig.googleTagManager}
                  onChange={(e) => updateSiteConfig("googleTagManager", e.target.value)}
                  placeholder="GTM-XXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Facebook Pixel ID</label>
                <Input
                  value={siteConfig.facebookPixel}
                  onChange={(e) => updateSiteConfig("facebookPixel", e.target.value)}
                  placeholder="123456789012345"
                />
              </div>
            </CardContent>
          </Card>

          {/* Schema.org / Dados Estruturados */}
          <Card>
            <CardHeader>
              <CardTitle>🏢 Dados da Empresa (Schema.org)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome da Empresa</label>
                  <Input
                    value={siteConfig.schema.name}
                    onChange={(e) => updateSiteConfig("schema.name", e.target.value)}
                    placeholder="Sua Empresa Ltda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Organização</label>
                  <select
                    value={siteConfig.schema.type}
                    onChange={(e) => updateSiteConfig("schema.type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Organization">Organização</option>
                    <option value="LocalBusiness">Negócio Local</option>
                    <option value="Corporation">Corporação</option>
                    <option value="Store">Loja</option>
                    <option value="Restaurant">Restaurante</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrição da Empresa</label>
                <Textarea
                  value={siteConfig.schema.description}
                  onChange={(e) => updateSiteConfig("schema.description", e.target.value)}
                  placeholder="Breve descrição da sua empresa..."
                  rows={2}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Telefone</label>
                  <Input
                    value={siteConfig.schema.phone}
                    onChange={(e) => updateSiteConfig("schema.phone", e.target.value)}
                    placeholder="+55 11 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    value={siteConfig.schema.email}
                    onChange={(e) => updateSiteConfig("schema.email", e.target.value)}
                    placeholder="contato@suaempresa.com"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <h4 className="font-medium mb-3">📍 Endereço</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rua</label>
                    <Input
                      value={siteConfig.schema.address.street}
                      onChange={(e) => updateSiteConfig("schema.address.street", e.target.value)}
                      placeholder="Rua Exemplo, 123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Cidade</label>
                    <Input
                      value={siteConfig.schema.address.city}
                      onChange={(e) => updateSiteConfig("schema.address.city", e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Estado</label>
                    <Input
                      value={siteConfig.schema.address.state}
                      onChange={(e) => updateSiteConfig("schema.address.state", e.target.value)}
                      placeholder="SP"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CEP</label>
                    <Input
                      value={siteConfig.schema.address.zipCode}
                      onChange={(e) => updateSiteConfig("schema.address.zipCode", e.target.value)}
                      placeholder="01234-567"
                    />
                  </div>
                </div>
              </div>

              {/* Redes Sociais */}
              <div>
                <h4 className="font-medium mb-3">📱 Redes Sociais</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Facebook</label>
                    <Input
                      value={siteConfig.schema.socialMedia.facebook}
                      onChange={(e) => updateSiteConfig("schema.socialMedia.facebook", e.target.value)}
                      placeholder="https://facebook.com/suaempresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instagram</label>
                    <Input
                      value={siteConfig.schema.socialMedia.instagram}
                      onChange={(e) => updateSiteConfig("schema.socialMedia.instagram", e.target.value)}
                      placeholder="https://instagram.com/suaempresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">LinkedIn</label>
                    <Input
                      value={siteConfig.schema.socialMedia.linkedin}
                      onChange={(e) => updateSiteConfig("schema.socialMedia.linkedin", e.target.value)}
                      placeholder="https://linkedin.com/company/suaempresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">YouTube</label>
                    <Input
                      value={siteConfig.schema.socialMedia.youtube}
                      onChange={(e) => updateSiteConfig("schema.socialMedia.youtube", e.target.value)}
                      placeholder="https://youtube.com/@suaempresa"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview de SEO */}
          <Card>
            <CardHeader>
              <CardTitle>👁️ Preview nos Resultados de Busca</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="text-blue-600 text-lg hover:underline cursor-pointer mb-1">{siteConfig.title}</div>
                <div className="text-green-700 text-sm mb-2">{siteConfig.url}</div>
                <div className="text-gray-700 text-sm">{siteConfig.description}</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Assim seu site aparecerá no Google</p>
            </CardContent>
          </Card>

          {/* Dicas de SEO */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Dicas de SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✅</span>
                  <div>
                    <p className="font-medium">Título otimizado</p>
                    <p className="text-sm text-gray-600">Use 50-60 caracteres, inclua palavra-chave principal</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✅</span>
                  <div>
                    <p className="font-medium">Descrição atrativa</p>
                    <p className="text-sm text-gray-600">150-160 caracteres, inclua call-to-action</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✅</span>
                  <div>
                    <p className="font-medium">Palavras-chave relevantes</p>
                    <p className="text-sm text-gray-600">5-10 palavras relacionadas ao seu negócio</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">✅</span>
                  <div>
                    <p className="font-medium">Imagem de compartilhamento</p>
                    <p className="text-sm text-gray-600">1200x630px, formato JPG ou PNG</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB BACKUP */}
        <TabsContent value="backup" className="space-y-6">
          {/* Backup e Restauração */}
          <Card>
            <CardHeader>
              <CardTitle>Backup e Restauração</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Exportar Dados</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Faça backup de todos os dados do CMS incluindo configurações
                  </p>
                  <Button onClick={exportData} disabled={isExporting} className="w-full">
                    {isExporting ? "Exportando..." : "📥 Exportar Backup"}
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Importar Dados</h3>
                  <p className="text-sm text-gray-600 mb-4">Restaurar dados de um backup</p>
                  <div>
                    <input type="file" accept=".json" onChange={importData} className="hidden" id="import-file" />
                    <label
                      htmlFor="import-file"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer text-center block transition-colors"
                    >
                      {isImporting ? "Importando..." : "📤 Importar Backup"}
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB SISTEMA */}
        <TabsContent value="sistema" className="space-y-6">
          {/* Configurações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Informações do Sistema</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Versão do CMS:</span>
                      <span className="font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última atualização:</span>
                      <span className="font-medium">{new Date().toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Armazenamento:</span>
                      <span className="font-medium">Local Storage</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Estatísticas</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">FAQs cadastradas:</span>
                      <span className="font-medium">
                        {localStorage.getItem("faq-data")
                          ? JSON.parse(localStorage.getItem("faq-data") || "{}").faqs?.length || 0
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Depoimentos:</span>
                      <span className="font-medium">
                        {localStorage.getItem("depoimentos-data")
                          ? JSON.parse(localStorage.getItem("depoimentos-data") || "{}").depoimentos?.length || 0
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Imagens na galeria:</span>
                      <span className="font-medium">
                        {localStorage.getItem("galeria-data")
                          ? JSON.parse(localStorage.getItem("galeria-data") || "{}").galeria?.length || 0
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seções configuradas:</span>
                      <span className="font-medium">{sections.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seções ativas:</span>
                      <span className="font-medium">{sections.filter((s) => s.enabled).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zona de Perigo */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">Zona de Perigo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-800 mb-2">Limpar Todos os Dados</h3>
                <p className="text-sm text-red-600 mb-4">
                  Esta ação irá remover permanentemente todos os dados do CMS incluindo configurações. Esta ação não
                  pode ser desfeita.
                </p>
                <Button onClick={clearAllData} variant="destructive">
                  🗑️ Limpar Todos os Dados
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
