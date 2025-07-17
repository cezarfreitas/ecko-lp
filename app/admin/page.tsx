"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FaqItem {
  id: string
  question: string
  answer: string
}

interface FaqConfig {
  title: string
  subtitle: string
  active: boolean
}

interface DepoimentoItem {
  id: string
  nome: string
  cargo: string
  empresa: string
  depoimento: string
  avatar: string
}

interface DepoimentosConfig {
  title: string
  subtitle: string
  active: boolean
}

interface GaleriaItem {
  id: string
  imagem: string
  titulo?: string
  descricao?: string
}

interface GaleriaConfig {
  title: string
  subtitle: string
  active: boolean
}

interface Stats {
  faqs: number
  depoimentos: number
  galeria: number
  leads: number
  lastUpdate: string
}

// Dados padrão do FAQ
const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "1",
    question: "Como funciona o processo de contratação?",
    answer:
      "Nosso processo é simples e transparente. Após o primeiro contato, realizamos uma consulta gratuita para entender suas necessidades, apresentamos uma proposta personalizada e, após aprovação, iniciamos o projeto com acompanhamento constante.",
  },
  {
    id: "2",
    question: "Qual é o prazo médio de entrega dos projetos?",
    answer:
      "O prazo varia conforme a complexidade do projeto. Projetos simples podem ser entregues em 1-2 semanas, enquanto projetos mais complexos podem levar de 4-8 semanas.",
  },
  {
    id: "3",
    question: "Vocês oferecem suporte após a entrega?",
    answer:
      "Sim! Oferecemos 30 dias de suporte gratuito após a entrega para ajustes e correções. Também temos planos de manutenção mensal para atualizações contínuas.",
  },
  {
    id: "4",
    question: "É possível fazer alterações durante o desenvolvimento?",
    answer:
      "Claro! Trabalhamos de forma colaborativa e flexível. Pequenos ajustes são inclusos no projeto. Para mudanças significativas, avaliamos o impacto no prazo e orçamento.",
  },
  {
    id: "5",
    question: "Quais formas de pagamento vocês aceitam?",
    answer:
      "Aceitamos PIX, transferência bancária, cartão de crédito (até 12x) e boleto bancário. Para projetos maiores, oferecemos parcelamento personalizado.",
  },
  {
    id: "6",
    question: "Vocês trabalham com empresas de todos os tamanhos?",
    answer:
      "Sim! Atendemos desde pequenos empreendedores até grandes corporações. Nossos serviços são escaláveis e adaptamos nossa abordagem conforme cada cliente.",
  },
]

// Dados padrão dos Depoimentos
const DEFAULT_DEPOIMENTOS: DepoimentoItem[] = [
  {
    id: "1",
    nome: "Maria Silva",
    cargo: "CEO",
    empresa: "TechStart Solutions",
    depoimento:
      "Trabalhar com esta equipe foi uma experiência incrível. Eles entenderam perfeitamente nossa visão e entregaram um produto que superou nossas expectativas. Recomendo sem hesitação!",
    avatar: "/professional-woman-avatar.png",
  },
  {
    id: "2",
    nome: "João Santos",
    cargo: "Diretor de Marketing",
    empresa: "Inovação Digital",
    depoimento:
      "O profissionalismo e a qualidade do trabalho são excepcionais. Nosso projeto foi entregue no prazo e com uma qualidade impressionante. Já estamos planejando novos projetos juntos.",
    avatar: "/professional-man-avatar.png",
  },
  {
    id: "3",
    nome: "Ana Costa",
    cargo: "Fundadora",
    empresa: "Creative Agency",
    depoimento:
      "A atenção aos detalhes e o suporte contínuo fazem toda a diferença. Nossa empresa cresceu significativamente após implementarmos as soluções desenvolvidas por eles.",
    avatar: "/professional-woman-avatar.png",
  },
  {
    id: "4",
    nome: "Carlos Oliveira",
    cargo: "CTO",
    empresa: "DataFlow Systems",
    depoimento:
      "Equipe técnica de alto nível! Conseguiram resolver problemas complexos de forma elegante e eficiente. O resultado final foi exatamente o que precisávamos para escalar nosso negócio.",
    avatar: "/professional-man-avatar.png",
  },
]

// Dados padrão da Galeria
const DEFAULT_GALERIA: GaleriaItem[] = [
  {
    id: "1",
    imagem: "/elegant-modern-fashion.png",
    titulo: "Elegância Moderna",
    descricao: "Peças sofisticadas para o dia a dia",
  },
  {
    id: "2",
    imagem: "/urban-street-style.png",
    titulo: "Street Style",
    descricao: "Estilo urbano e despojado",
  },
  {
    id: "3",
    imagem: "/vibrant-summer-fashion.png",
    titulo: "Verão Vibrante",
    descricao: "Cores e estampas para o verão",
  },
  {
    id: "4",
    imagem: "/minimalist-fashion.png",
    titulo: "Minimalismo",
    descricao: "Simplicidade e elegância",
  },
  {
    id: "5",
    imagem: "/elegant-formal-dress.png",
    titulo: "Formal Elegante",
    descricao: "Para ocasiões especiais",
  },
  {
    id: "6",
    imagem: "/comfortable-chic-fashion.png",
    titulo: "Conforto Chique",
    descricao: "Estilo e conforto unidos",
  },
]

export default function AdminPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS)
  const [faqConfig, setFaqConfig] = useState<FaqConfig>({
    title: "FAQ",
    subtitle: "Respostas para suas principais dúvidas",
    active: true,
  })

  const [depoimentos, setDepoimentos] = useState<DepoimentoItem[]>(DEFAULT_DEPOIMENTOS)
  const [depoimentosConfig, setDepoimentosConfig] = useState<DepoimentosConfig>({
    title: "Depoimentos",
    subtitle: "O que nossos clientes dizem sobre nós",
    active: true,
  })

  const [galeria, setGaleria] = useState<GaleriaItem[]>(DEFAULT_GALERIA)
  const [galeriaConfig, setGaleriaConfig] = useState<GaleriaConfig>({
    title: "Nova Coleção",
    subtitle: "Descubra as últimas tendências da moda",
    active: true,
  })

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [stats, setStats] = useState<Stats>({
    faqs: 0,
    depoimentos: 0,
    galeria: 0,
    leads: 0,
    lastUpdate: "Nunca",
  })

  const quickActions = [
    {
      title: "Nova Pergunta FAQ",
      description: "Adicionar pergunta frequente",
      icon: "❓",
      href: "/admin/faq",
      color: "bg-blue-500",
    },
    {
      title: "Novo Depoimento",
      description: "Adicionar avaliação de cliente",
      icon: "💬",
      href: "/admin/depoimentos",
      color: "bg-green-500",
    },
    {
      title: "Upload de Imagens",
      description: "Adicionar fotos à galeria",
      icon: "🖼️",
      href: "/admin/galeria",
      color: "bg-purple-500",
    },
    {
      title: "Configurações",
      description: "Ajustar configurações gerais",
      icon: "⚙️",
      href: "/admin/configuracoes",
      color: "bg-gray-500",
    },
    {
      title: "Gerenciar Leads",
      description: "Ver cadastros e webhook",
      icon: "👥",
      href: "/admin/leads",
      color: "bg-orange-500",
    },
  ]

  // Carregar dados do localStorage
  useEffect(() => {
    try {
      // Carregar FAQ
      const savedFaqData = localStorage.getItem("faq-data")
      if (savedFaqData) {
        const parsed = JSON.parse(savedFaqData)
        if (parsed.faqs && Array.isArray(parsed.faqs)) {
          setFaqs(parsed.faqs)
        }
        if (parsed.config) {
          setFaqConfig(parsed.config)
        }
      }

      // Carregar Depoimentos
      const savedDepoimentosData = localStorage.getItem("depoimentos-data")
      if (savedDepoimentosData) {
        const parsed = JSON.parse(savedDepoimentosData)
        if (parsed.depoimentos && Array.isArray(parsed.depoimentos)) {
          setDepoimentos(parsed.depoimentos)
        }
        if (parsed.config) {
          setDepoimentosConfig(parsed.config)
        }
      }

      // Carregar Galeria
      const savedGaleriaData = localStorage.getItem("galeria-data")
      if (savedGaleriaData) {
        const parsed = JSON.parse(savedGaleriaData)
        console.log("🔧 Admin - Carregando galeria:", parsed)
        if (parsed.galeria && Array.isArray(parsed.galeria)) {
          setGaleria(parsed.galeria)
        }
        if (parsed.config) {
          setGaleriaConfig(parsed.config)
        }
      } else {
        // Se não há dados salvos, salvar os dados padrão
        console.log("🔧 Admin - Salvando dados padrão da galeria")
        saveGaleriaData(DEFAULT_GALERIA, galeriaConfig)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }, [])

  // Carregar estatísticas
  useEffect(() => {
    const loadStats = () => {
      try {
        const faqData = localStorage.getItem("faq-data")
        const depoimentosData = localStorage.getItem("depoimentos-data")
        const galeriaData = localStorage.getItem("galeria-data")
        const leadsData = localStorage.getItem("leads-data")
        const leadsCount = leadsData ? JSON.parse(leadsData).length || 0 : 0

        const faqCount = faqData ? JSON.parse(faqData).faqs?.length || 0 : 0
        const depoimentosCount = depoimentosData ? JSON.parse(depoimentosData).depoimentos?.length || 0 : 0
        const galeriaCount = galeriaData ? JSON.parse(galeriaData).galeria?.length || 0 : 0

        setStats({
          faqs: faqCount,
          depoimentos: depoimentosCount,
          galeria: galeriaCount,
          leads: leadsCount,
          lastUpdate: new Date().toLocaleString("pt-BR"),
        })
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error)
      }
    }

    loadStats()

    // Atualizar a cada 30 segundos
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Salvar dados FAQ
  const saveFaqData = (newFaqs: FaqItem[], newConfig: FaqConfig) => {
    setSaveStatus("saving")
    try {
      const dataToSave = { faqs: newFaqs, config: newConfig }
      localStorage.setItem("faq-data", JSON.stringify(dataToSave))
      window.dispatchEvent(new CustomEvent("faq-updated", { detail: dataToSave }))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Erro ao salvar FAQ:", error)
      setSaveStatus("idle")
    }
  }

  // Salvar dados Depoimentos
  const saveDepoimentosData = (newDepoimentos: DepoimentoItem[], newConfig: DepoimentosConfig) => {
    setSaveStatus("saving")
    try {
      const dataToSave = { depoimentos: newDepoimentos, config: newConfig }
      localStorage.setItem("depoimentos-data", JSON.stringify(dataToSave))
      window.dispatchEvent(new CustomEvent("depoimentos-updated", { detail: dataToSave }))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Erro ao salvar depoimentos:", error)
      setSaveStatus("idle")
    }
  }

  // Salvar dados Galeria
  const saveGaleriaData = (newGaleria: GaleriaItem[], newConfig: GaleriaConfig) => {
    setSaveStatus("saving")
    try {
      const dataToSave = { galeria: newGaleria, config: newConfig }
      console.log("🔧 Admin - Salvando galeria:", dataToSave)
      localStorage.setItem("galeria-data", JSON.stringify(dataToSave))
      window.dispatchEvent(new CustomEvent("galeria-updated", { detail: dataToSave }))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Erro ao salvar galeria:", error)
      setSaveStatus("idle")
    }
  }

  // Funções FAQ
  const addFaq = () => {
    const newFaq: FaqItem = {
      id: Date.now().toString(),
      question: "Nova pergunta",
      answer: "Nova resposta",
    }
    const newFaqs = [...faqs, newFaq]
    setFaqs(newFaqs)
    saveFaqData(newFaqs, faqConfig)
  }

  const updateFaq = (faqId: string, field: keyof FaqItem, value: string) => {
    const newFaqs = faqs.map((faq) => (faq.id === faqId ? { ...faq, [field]: value } : faq))
    setFaqs(newFaqs)
    saveFaqData(newFaqs, faqConfig)
  }

  const deleteFaq = (faqId: string) => {
    if (confirm("Tem certeza que deseja excluir esta pergunta?")) {
      const newFaqs = faqs.filter((faq) => faq.id !== faqId)
      setFaqs(newFaqs)
      saveFaqData(newFaqs, faqConfig)
    }
  }

  const updateFaqConfig = (field: keyof FaqConfig, value: string | boolean) => {
    const newConfig = { ...faqConfig, [field]: value }
    setFaqConfig(newConfig)
    saveFaqData(faqs, newConfig)
  }

  // Funções Depoimentos
  const addDepoimento = () => {
    const newDepoimento: DepoimentoItem = {
      id: Date.now().toString(),
      nome: "Nome do Cliente",
      cargo: "Cargo",
      empresa: "Empresa",
      depoimento: "Depoimento do cliente...",
      avatar: "/diverse-avatars.png",
    }
    const newDepoimentos = [...depoimentos, newDepoimento]
    setDepoimentos(newDepoimentos)
    saveDepoimentosData(newDepoimentos, depoimentosConfig)
  }

  const updateDepoimento = (depoimentoId: string, field: keyof DepoimentoItem, value: string) => {
    const newDepoimentos = depoimentos.map((depoimento) =>
      depoimento.id === depoimentoId ? { ...depoimento, [field]: value } : depoimento,
    )
    setDepoimentos(newDepoimentos)
    saveDepoimentosData(newDepoimentos, depoimentosConfig)
  }

  const deleteDepoimento = (depoimentoId: string) => {
    if (confirm("Tem certeza que deseja excluir este depoimento?")) {
      const newDepoimentos = depoimentos.filter((depoimento) => depoimento.id !== depoimentoId)
      setDepoimentos(newDepoimentos)
      saveDepoimentosData(newDepoimentos, depoimentosConfig)
    }
  }

  const updateDepoimentosConfig = (field: keyof DepoimentosConfig, value: string | boolean) => {
    const newConfig = { ...depoimentosConfig, [field]: value }
    setDepoimentosConfig(newConfig)
    saveDepoimentosData(depoimentos, newConfig)
  }

  // Upload de imagem para depoimentos
  const handleImageUpload = (depoimentoId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        updateDepoimento(depoimentoId, "avatar", imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  // Funções Galeria
  const addGaleriaItem = () => {
    const newItem: GaleriaItem = {
      id: Date.now().toString(),
      imagem: "/placeholder.svg?height=400&width=300",
      titulo: "Nova Imagem",
      descricao: "Descrição da imagem",
    }
    const newGaleria = [...galeria, newItem]
    setGaleria(newGaleria)
    saveGaleriaData(newGaleria, galeriaConfig)
  }

  const updateGaleriaItem = (itemId: string, field: keyof GaleriaItem, value: string) => {
    const newGaleria = galeria.map((item) => (item.id === itemId ? { ...item, [field]: value } : item))
    setGaleria(newGaleria)
    saveGaleriaData(newGaleria, galeriaConfig)
  }

  const deleteGaleriaItem = (itemId: string) => {
    if (confirm("Tem certeza que deseja excluir esta imagem?")) {
      const newGaleria = galeria.filter((item) => item.id !== itemId)
      setGaleria(newGaleria)
      saveGaleriaData(newGaleria, galeriaConfig)
    }
  }

  const updateGaleriaConfig = (field: keyof GaleriaConfig, value: string | boolean) => {
    const newConfig = { ...galeriaConfig, [field]: value }
    setGaleriaConfig(newConfig)
    saveGaleriaData(galeria, newConfig)
  }

  // Upload de imagem para galeria
  const handleGaleriaImageUpload = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        updateGaleriaItem(itemId, "imagem", imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload múltiplo de imagens
  const handleMultipleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          const newItem: GaleriaItem = {
            id: (Date.now() + index).toString(),
            imagem: imageUrl,
            titulo: file.name.split(".")[0],
            descricao: "Nova imagem adicionada",
          }
          setGaleria((prev) => {
            const newGaleria = [...prev, newItem]
            saveGaleriaData(newGaleria, galeriaConfig)
            return newGaleria
          })
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Drag and Drop para reordenar galeria
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedItem === null) return

    const newGaleria = [...galeria]
    const draggedItemData = newGaleria[draggedItem]
    newGaleria.splice(draggedItem, 1)
    newGaleria.splice(dropIndex, 0, draggedItemData)

    setGaleria(newGaleria)
    setDraggedItem(null)
    saveGaleriaData(newGaleria, galeriaConfig)
  }

  // Função para resetar galeria para dados padrão
  const resetGaleria = () => {
    if (confirm("Tem certeza que deseja restaurar as imagens padrão da galeria?")) {
      setGaleria(DEFAULT_GALERIA)
      saveGaleriaData(DEFAULT_GALERIA, galeriaConfig)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin - Conteúdo</h1>
            <p className="text-gray-600">Gerencie FAQ, Depoimentos e Galeria da landing page</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Status de salvamento */}
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
            <Button variant="outline" onClick={() => window.open("/", "_blank")}>
              👁️ Ver Site
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Bem-vindo ao CMS</h1>
          <p className="opacity-90">Gerencie todo o conteúdo da sua landing page de forma simples e eficiente.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">FAQ</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.faqs}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">❓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Depoimentos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.depoimentos}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Galeria</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.galeria}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🖼️</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Leads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.leads}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Última Atualização</p>
                  <p className="text-sm font-medium text-gray-900">{stats.lastUpdate}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🕒</span>
                </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 hover:shadow-md transition-all bg-transparent"
                  onClick={() => (window.location.href = action.href)}
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                    <span className="text-2xl">{action.icon}</span>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Sistema Online</span>
                </div>
                <span className="text-xs text-gray-500">Funcionando normalmente</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Dados Sincronizados</span>
                </div>
                <span className="text-xs text-gray-500">Última sincronização: agora</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium">Backup Automático</span>
                </div>
                <span className="text-xs text-gray-500">Dados salvos localmente</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="galeria" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ ({faqs.length})</TabsTrigger>
            <TabsTrigger value="depoimentos">Depoimentos ({depoimentos.length})</TabsTrigger>
            <TabsTrigger value="galeria">Galeria ({galeria.length})</TabsTrigger>
          </TabsList>

          {/* TAB GALERIA - Colocando primeiro para debug */}
          <TabsContent value="galeria" className="space-y-6">
            {/* Debug Info */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-blue-900 mb-2">🔧 Debug Galeria:</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>Imagens carregadas: {galeria.length}</p>
                  <p>Dados no localStorage: {localStorage.getItem("galeria-data") ? "Sim" : "Não"}</p>
                  <p>Seção ativa: {galeriaConfig.active ? "Sim" : "Não"}</p>
                  <Button onClick={resetGaleria} size="sm" className="mt-2">
                    🔄 Restaurar Imagens Padrão
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Configurações Galeria */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Galeria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título Principal</label>
                    <Input
                      value={galeriaConfig.title}
                      onChange={(e) => updateGaleriaConfig("title", e.target.value)}
                      placeholder="Nova Coleção"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtítulo</label>
                    <Input
                      value={galeriaConfig.subtitle}
                      onChange={(e) => updateGaleriaConfig("subtitle", e.target.value)}
                      placeholder="Descubra as últimas tendências da moda"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium">Seção Ativa</label>
                    <p className="text-xs text-gray-600">Controla se a galeria aparece no site</p>
                  </div>
                  <Switch
                    checked={galeriaConfig.active}
                    onCheckedChange={(checked) => updateGaleriaConfig("active", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload e Controles da Galeria */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Galeria de Imagens</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {galeria.length} imagem{galeria.length !== 1 ? "ns" : ""} na galeria • Arraste para reordenar
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMultipleImageUpload}
                        className="hidden"
                        id="multiple-upload"
                      />
                      <label
                        htmlFor="multiple-upload"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer text-sm transition-colors"
                      >
                        📁 Upload Múltiplo
                      </label>
                    </div>
                    <Button onClick={addGaleriaItem} className="bg-green-600 hover:bg-green-700">
                      + Nova Imagem
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {galeria.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">🖼️</div>
                    <p className="mb-4">Nenhuma imagem na galeria</p>
                    <div className="flex gap-2 justify-center">
                      <label
                        htmlFor="multiple-upload"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer text-sm transition-colors"
                      >
                        📁 Upload Múltiplo
                      </label>
                      <Button onClick={addGaleriaItem} className="bg-green-600 hover:bg-green-700">
                        + Adicionar Imagem
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galeria.map((item, index) => (
                      <Card
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`cursor-move transition-all hover:shadow-lg ${
                          draggedItem === index ? "opacity-50" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                              <span className="text-gray-400">⋮⋮</span>
                              Imagem #{index + 1}
                            </span>
                            <Button
                              onClick={() => deleteGaleriaItem(item.id)}
                              size="sm"
                              variant="destructive"
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </div>

                          {/* Preview da Imagem */}
                          <div className="mb-4">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 border-2 border-gray-200">
                              <img
                                src={item.imagem || "/placeholder.svg?height=400&width=300"}
                                alt={item.titulo}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="mt-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleGaleriaImageUpload(item.id, e)}
                                className="hidden"
                                id={`galeria-upload-${item.id}`}
                              />
                              <label
                                htmlFor={`galeria-upload-${item.id}`}
                                className="w-full bg-gray-600 hover:bg-gray-700 text-white text-xs py-2 px-3 rounded cursor-pointer text-center block transition-colors"
                              >
                                📷 Alterar Imagem
                              </label>
                            </div>
                          </div>

                          {/* Campos de Edição */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Título</label>
                              <Input
                                value={item.titulo || ""}
                                onChange={(e) => updateGaleriaItem(item.id, "titulo", e.target.value)}
                                placeholder="Título da imagem"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Descrição</label>
                              <Textarea
                                value={item.descricao || ""}
                                onChange={(e) => updateGaleriaItem(item.id, "descricao", e.target.value)}
                                placeholder="Descrição da imagem"
                                rows={2}
                                className="text-sm resize-none"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB FAQ */}
          <TabsContent value="faq" className="space-y-6">
            {/* Configurações FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Seção FAQ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título Principal</label>
                    <Input
                      value={faqConfig.title}
                      onChange={(e) => updateFaqConfig("title", e.target.value)}
                      placeholder="FAQ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtítulo</label>
                    <Input
                      value={faqConfig.subtitle}
                      onChange={(e) => updateFaqConfig("subtitle", e.target.value)}
                      placeholder="Respostas para suas principais dúvidas"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium">Seção Ativa</label>
                    <p className="text-xs text-gray-600">Controla se a seção FAQ aparece no site</p>
                  </div>
                  <Switch
                    checked={faqConfig.active}
                    onCheckedChange={(checked) => updateFaqConfig("active", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de FAQs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Perguntas Frequentes</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {faqs.length} pergunta{faqs.length !== 1 ? "s" : ""} cadastrada{faqs.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Button onClick={addFaq} className="bg-green-600 hover:bg-green-700">
                    + Nova Pergunta
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {faqs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">❓</div>
                    <p className="mb-4">Nenhuma pergunta cadastrada</p>
                    <Button onClick={addFaq} className="bg-green-600 hover:bg-green-700">
                      Criar Primeira Pergunta
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <Card key={faq.id} className="border-l-4 border-red-600">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-600">Pergunta #{index + 1}</span>
                            <Button
                              onClick={() => deleteFaq(faq.id)}
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0"
                            >
                              ×
                            </Button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Pergunta</label>
                              <Input
                                value={faq.question}
                                onChange={(e) => updateFaq(faq.id, "question", e.target.value)}
                                placeholder="Digite a pergunta..."
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">Resposta</label>
                              <Textarea
                                value={faq.answer}
                                onChange={(e) => updateFaq(faq.id, "answer", e.target.value)}
                                placeholder="Digite a resposta..."
                                rows={4}
                                className="resize-none"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB DEPOIMENTOS */}
          <TabsContent value="depoimentos" className="space-y-6">
            {/* Configurações Depoimentos */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Seção Depoimentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título Principal</label>
                    <Input
                      value={depoimentosConfig.title}
                      onChange={(e) => updateDepoimentosConfig("title", e.target.value)}
                      placeholder="Depoimentos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtítulo</label>
                    <Input
                      value={depoimentosConfig.subtitle}
                      onChange={(e) => updateDepoimentosConfig("subtitle", e.target.value)}
                      placeholder="O que nossos clientes dizem sobre nós"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="text-sm font-medium">Seção Ativa</label>
                    <p className="text-xs text-gray-600">Controla se a seção Depoimentos aparece no site</p>
                  </div>
                  <Switch
                    checked={depoimentosConfig.active}
                    onCheckedChange={(checked) => updateDepoimentosConfig("active", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lista de Depoimentos */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Depoimentos de Clientes</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {depoimentos.length} depoimento{depoimentos.length !== 1 ? "s" : ""} cadastrado
                      {depoimentos.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Button onClick={addDepoimento} className="bg-green-600 hover:bg-green-700">
                    + Novo Depoimento
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {depoimentos.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">💬</div>
                    <p className="mb-4">Nenhum depoimento cadastrado</p>
                    <Button onClick={addDepoimento} className="bg-green-600 hover:bg-green-700">
                      Criar Primeiro Depoimento
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {depoimentos.map((depoimento, index) => (
                      <Card key={depoimento.id} className="border-l-4 border-blue-600">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-600">Depoimento #{index + 1}</span>
                            <Button
                              onClick={() => deleteDepoimento(depoimento.id)}
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0"
                            >
                              ×
                            </Button>
                          </div>

                          <div className="grid md:grid-cols-3 gap-6">
                            {/* Foto do Cliente */}
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Foto do Cliente</label>
                                <div className="flex flex-col items-center gap-3">
                                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                                    <img
                                      src={depoimento.avatar || "/placeholder.svg?height=80&width=80"}
                                      alt={depoimento.nome}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="w-full">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleImageUpload(depoimento.id, e)}
                                      className="hidden"
                                      id={`upload-${depoimento.id}`}
                                    />
                                    <label
                                      htmlFor={`upload-${depoimento.id}`}
                                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded cursor-pointer text-center block transition-colors"
                                    >
                                      📷 Alterar Foto
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Dados do Cliente */}
                            <div className="md:col-span-2 space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium mb-2">Nome</label>
                                  <Input
                                    value={depoimento.nome}
                                    onChange={(e) => updateDepoimento(depoimento.id, "nome", e.target.value)}
                                    placeholder="Nome do cliente"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium mb-2">Cargo</label>
                                  <Input
                                    value={depoimento.cargo}
                                    onChange={(e) => updateDepoimento(depoimento.id, "cargo", e.target.value)}
                                    placeholder="Cargo do cliente"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Empresa</label>
                                <Input
                                  value={depoimento.empresa}
                                  onChange={(e) => updateDepoimento(depoimento.id, "empresa", e.target.value)}
                                  placeholder="Nome da empresa"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Depoimento</label>
                                <Textarea
                                  value={depoimento.depoimento}
                                  onChange={(e) => updateDepoimento(depoimento.id, "depoimento", e.target.value)}
                                  placeholder="Texto do depoimento..."
                                  rows={4}
                                  className="resize-none"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
