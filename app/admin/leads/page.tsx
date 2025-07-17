"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Lead {
  id: string
  nome: string
  whatsapp: string
  temCnpj: string
  tipoLoja: string
  dataEnvio: string
  status: "pendente" | "enviado" | "erro" | "sucesso"
  webhookResponse?: {
    id_lead?: string
    status: number
    response: any
    error?: string
  }
  tentativas: number
  ultimaTentativa?: string
  origem?: string
  dispositivo?: string
  navegador?: string
  localizacao?: string
  tempoNaPagina?: number
  paginasVisitadas?: number
}

interface WebhookConfig {
  url: string
  ativo: boolean
  headers: { [key: string]: string }
  timeout: number
}

interface Analytics {
  totalLeads: number
  leadsPorDia: { [key: string]: number }
  leadsPorHora: { [key: string]: number }
  leadsPorDispositivo: { [key: string]: number }
  leadsPorOrigem: { [key: string]: number }
  leadsPorTipoLoja: { [key: string]: number }
  taxaConversao: number
  tempoMedioNaPagina: number
  paginasMaisVisitadas: { [key: string]: number }
  leadsPorStatus: { [key: string]: number }
  crescimentoSemanal: number
  melhorHorario: string
  melhorDia: string
}

const DEFAULT_WEBHOOK_CONFIG: WebhookConfig = {
  url: "",
  ativo: false,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [webhookConfig, setWebhookConfig] = useState<WebhookConfig>(DEFAULT_WEBHOOK_CONFIG)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("todos")
  const [filterPeriod, setFilterPeriod] = useState<string>("7")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    loadData()
    calculateAnalytics()
  }, [])

  useEffect(() => {
    calculateAnalytics()
  }, [leads, filterPeriod])

  const loadData = () => {
    try {
      // Carregar leads
      const savedLeads = localStorage.getItem("leads-data")
      if (savedLeads) {
        const leadsData = JSON.parse(savedLeads)
        // Adicionar dados simulados de analytics se não existirem
        const enrichedLeads = leadsData.map((lead: Lead) => ({
          ...lead,
          origem: lead.origem || getRandomOrigem(),
          dispositivo: lead.dispositivo || getRandomDispositivo(),
          navegador: lead.navegador || getRandomNavegador(),
          localizacao: lead.localizacao || getRandomLocalizacao(),
          tempoNaPagina: lead.tempoNaPagina || Math.floor(Math.random() * 300) + 60,
          paginasVisitadas: lead.paginasVisitadas || Math.floor(Math.random() * 5) + 1,
        }))
        setLeads(enrichedLeads)
      }

      // Carregar configuração do webhook
      const savedWebhookConfig = localStorage.getItem("webhook-config")
      if (savedWebhookConfig) {
        setWebhookConfig(JSON.parse(savedWebhookConfig))
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  const calculateAnalytics = () => {
    if (leads.length === 0) {
      setAnalytics(null)
      return
    }

    const now = new Date()
    const periodDays = Number.parseInt(filterPeriod)
    const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000)

    const filteredLeads = leads.filter((lead) => new Date(lead.dataEnvio) >= startDate)

    // Leads por dia
    const leadsPorDia: { [key: string]: number } = {}
    for (let i = 0; i < periodDays; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split("T")[0]
      leadsPorDia[dateStr] = 0
    }

    // Leads por hora
    const leadsPorHora: { [key: string]: number } = {}
    for (let i = 0; i < 24; i++) {
      leadsPorHora[i.toString().padStart(2, "0")] = 0
    }

    // Outros analytics
    const leadsPorDispositivo: { [key: string]: number } = {}
    const leadsPorOrigem: { [key: string]: number } = {}
    const leadsPorTipoLoja: { [key: string]: number } = {}
    const leadsPorStatus: { [key: string]: number } = {}
    const paginasMaisVisitadas: { [key: string]: number } = {}

    let tempoTotalNaPagina = 0
    let totalPaginasVisitadas = 0

    filteredLeads.forEach((lead) => {
      // Por dia
      const leadDate = new Date(lead.dataEnvio).toISOString().split("T")[0]
      if (leadsPorDia[leadDate] !== undefined) {
        leadsPorDia[leadDate]++
      }

      // Por hora
      const leadHour = new Date(lead.dataEnvio).getHours().toString().padStart(2, "0")
      leadsPorHora[leadHour]++

      // Por dispositivo
      leadsPorDispositivo[lead.dispositivo || "Desktop"] = (leadsPorDispositivo[lead.dispositivo || "Desktop"] || 0) + 1

      // Por origem
      leadsPorOrigem[lead.origem || "Direto"] = (leadsPorOrigem[lead.origem || "Direto"] || 0) + 1

      // Por tipo de loja
      leadsPorTipoLoja[lead.tipoLoja] = (leadsPorTipoLoja[lead.tipoLoja] || 0) + 1

      // Por status
      leadsPorStatus[lead.status] = (leadsPorStatus[lead.status] || 0) + 1

      // Tempo na página
      tempoTotalNaPagina += lead.tempoNaPagina || 0
      totalPaginasVisitadas += lead.paginasVisitadas || 0

      // Páginas visitadas (simulado)
      const paginas = ["/", "/sobre", "/servicos", "/contato", "/galeria"]
      const paginasVisitadas = Math.floor(Math.random() * 3) + 1
      for (let i = 0; i < paginasVisitadas; i++) {
        const pagina = paginas[Math.floor(Math.random() * paginas.length)]
        paginasMaisVisitadas[pagina] = (paginasMaisVisitadas[pagina] || 0) + 1
      }
    })

    // Calcular crescimento semanal
    const thisWeekLeads = leads.filter((lead) => {
      const leadDate = new Date(lead.dataEnvio)
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return leadDate >= weekAgo
    }).length

    const lastWeekLeads = leads.filter((lead) => {
      const leadDate = new Date(lead.dataEnvio)
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return leadDate >= twoWeeksAgo && leadDate < weekAgo
    }).length

    const crescimentoSemanal = lastWeekLeads > 0 ? ((thisWeekLeads - lastWeekLeads) / lastWeekLeads) * 100 : 0

    // Melhor horário e dia
    const melhorHorario = Object.entries(leadsPorHora).reduce((a, b) =>
      leadsPorHora[a[0]] > leadsPorHora[b[0]] ? a : b,
    )[0]
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    const leadsPorDiaSemana: { [key: string]: number } = {}
    diasSemana.forEach((dia) => (leadsPorDiaSemana[dia] = 0))

    filteredLeads.forEach((lead) => {
      const dia = diasSemana[new Date(lead.dataEnvio).getDay()]
      leadsPorDiaSemana[dia]++
    })

    const melhorDia = Object.entries(leadsPorDiaSemana).reduce((a, b) =>
      leadsPorDiaSemana[a[0]] > leadsPorDiaSemana[b[0]] ? a : b,
    )[0]

    setAnalytics({
      totalLeads: filteredLeads.length,
      leadsPorDia,
      leadsPorHora,
      leadsPorDispositivo,
      leadsPorOrigem,
      leadsPorTipoLoja,
      leadsPorStatus,
      taxaConversao: Math.random() * 5 + 2, // Simulado
      tempoMedioNaPagina: filteredLeads.length > 0 ? tempoTotalNaPagina / filteredLeads.length : 0,
      paginasMaisVisitadas,
      crescimentoSemanal,
      melhorHorario: `${melhorHorario}:00`,
      melhorDia,
    })
  }

  // Funções auxiliares para dados simulados
  const getRandomOrigem = () => {
    const origens = ["Google", "Facebook", "Instagram", "Direto", "WhatsApp", "Email", "LinkedIn"]
    return origens[Math.floor(Math.random() * origens.length)]
  }

  const getRandomDispositivo = () => {
    const dispositivos = ["Desktop", "Mobile", "Tablet"]
    const weights = [0.4, 0.5, 0.1] // 40% Desktop, 50% Mobile, 10% Tablet
    const random = Math.random()
    if (random < weights[0]) return dispositivos[0]
    if (random < weights[0] + weights[1]) return dispositivos[1]
    return dispositivos[2]
  }

  const getRandomNavegador = () => {
    const navegadores = ["Chrome", "Safari", "Firefox", "Edge"]
    return navegadores[Math.floor(Math.random() * navegadores.length)]
  }

  const getRandomLocalizacao = () => {
    const cidades = [
      "São Paulo",
      "Rio de Janeiro",
      "Belo Horizonte",
      "Brasília",
      "Salvador",
      "Fortaleza",
      "Curitiba",
      "Recife",
    ]
    return cidades[Math.floor(Math.random() * cidades.length)]
  }

  const saveWebhookConfig = (newConfig: WebhookConfig) => {
    try {
      localStorage.setItem("webhook-config", JSON.stringify(newConfig))
      setWebhookConfig(newConfig)
    } catch (error) {
      console.error("Erro ao salvar configuração do webhook:", error)
    }
  }

  const saveLeads = (newLeads: Lead[]) => {
    try {
      localStorage.setItem("leads-data", JSON.stringify(newLeads))
      setLeads(newLeads)
    } catch (error) {
      console.error("Erro ao salvar leads:", error)
    }
  }

  const sendToWebhook = async (lead: Lead): Promise<{ success: boolean; response?: any; error?: string }> => {
    if (!webhookConfig.url || !webhookConfig.ativo) {
      return { success: false, error: "Webhook não configurado ou inativo" }
    }

    try {
      const payload = {
        id: lead.id,
        nome: lead.nome,
        whatsapp: lead.whatsapp,
        tem_cnpj: lead.temCnpj === "sim",
        tipo_loja: lead.tipoLoja,
        data_envio: lead.dataEnvio,
        origem: lead.origem,
        dispositivo: lead.dispositivo,
        localizacao: lead.localizacao,
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), webhookConfig.timeout)

      const response = await fetch(webhookConfig.url, {
        method: "POST",
        headers: webhookConfig.headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const responseData = await response.json()

      if (response.ok) {
        return {
          success: true,
          response: {
            id_lead: responseData.id_lead || responseData.id || null,
            status: response.status,
            response: responseData,
          },
        }
      } else {
        return {
          success: false,
          error: `HTTP ${response.status}: ${responseData.message || "Erro no webhook"}`,
          response: {
            status: response.status,
            response: responseData,
          },
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.name === "AbortError" ? "Timeout na requisição" : error.message,
      }
    }
  }

  const reenviarLead = async (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead) return

    const updatedLeads = leads.map((l) =>
      l.id === leadId
        ? {
            ...l,
            status: "pendente" as const,
            tentativas: l.tentativas + 1,
            ultimaTentativa: new Date().toISOString(),
          }
        : l,
    )
    saveLeads(updatedLeads)

    const result = await sendToWebhook(lead)

    const finalLeads = updatedLeads.map((l) =>
      l.id === leadId
        ? {
            ...l,
            status: result.success ? ("sucesso" as const) : ("erro" as const),
            webhookResponse: result.response || { status: 0, response: null, error: result.error },
          }
        : l,
    )
    saveLeads(finalLeads)
  }

  const testWebhook = async () => {
    setIsTestingWebhook(true)
    try {
      const testLead: Lead = {
        id: "test-" + Date.now(),
        nome: "Teste Webhook",
        whatsapp: "(11) 99999-9999",
        temCnpj: "sim",
        tipoLoja: "fisica",
        dataEnvio: new Date().toISOString(),
        status: "pendente",
        tentativas: 1,
        origem: "Teste",
        dispositivo: "Desktop",
        navegador: "Chrome",
        localizacao: "São Paulo",
      }

      const result = await sendToWebhook(testLead)
      if (result.success) {
        alert("✅ Webhook testado com sucesso!")
      } else {
        alert(`❌ Erro no teste do webhook: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Erro no teste: ${error}`)
    } finally {
      setIsTestingWebhook(false)
    }
  }

  const deleteLead = (leadId: string) => {
    if (confirm("Tem certeza que deseja excluir este lead?")) {
      const newLeads = leads.filter((l) => l.id !== leadId)
      saveLeads(newLeads)
    }
  }

  const exportLeads = () => {
    const csvContent = [
      [
        "Nome",
        "WhatsApp",
        "CNPJ",
        "Tipo Loja",
        "Data Envio",
        "Status",
        "Origem",
        "Dispositivo",
        "Localização",
        "Tempo na Página",
        "ID Lead",
        "Tentativas",
      ].join(","),
      ...leads.map((lead) =>
        [
          lead.nome,
          lead.whatsapp,
          lead.temCnpj === "sim" ? "Sim" : "Não",
          lead.tipoLoja,
          new Date(lead.dataEnvio).toLocaleString("pt-BR"),
          lead.status,
          lead.origem || "",
          lead.dispositivo || "",
          lead.localizacao || "",
          lead.tempoNaPagina || "",
          lead.webhookResponse?.id_lead || "",
          lead.tentativas,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `leads-analytics-${new Date().toISOString().split("T")[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Filtrar leads
  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = filterStatus === "todos" || lead.status === filterStatus
    const matchesSearch =
      searchTerm === "" ||
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm) ||
      (lead.origem && lead.origem.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.localizacao && lead.localizacao.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "sucesso":
        return "bg-green-100 text-green-800"
      case "erro":
        return "bg-red-100 text-red-800"
      case "enviado":
        return "bg-blue-100 text-blue-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: Lead["status"]) => {
    switch (status) {
      case "sucesso":
        return "Sucesso"
      case "erro":
        return "Erro"
      case "enviado":
        return "Enviado"
      case "pendente":
        return "Pendente"
      default:
        return "Desconhecido"
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
          <TabsTrigger value="leads">👥 Leads</TabsTrigger>
          <TabsTrigger value="analytics">📈 Analytics</TabsTrigger>
          <TabsTrigger value="webhook">⚙️ Webhook</TabsTrigger>
        </TabsList>

        {/* TAB DASHBOARD */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Filtro de Período */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Período de Análise</h3>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="7">Últimos 7 dias</option>
                  <option value="30">Últimos 30 dias</option>
                  <option value="90">Últimos 90 dias</option>
                  <option value="365">Último ano</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* KPIs Principais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.totalLeads || 0}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {analytics?.crescimentoSemanal && analytics.crescimentoSemanal > 0 ? "+" : ""}
                      {analytics?.crescimentoSemanal?.toFixed(1) || 0}% esta semana
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics?.taxaConversao?.toFixed(1) || 0}%</p>
                    <p className="text-xs text-gray-500 mt-1">Visitantes → Leads</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tempo Médio na Página</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analytics?.tempoMedioNaPagina ? formatTime(Math.floor(analytics.tempoMedioNaPagina)) : "0m 0s"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Engajamento</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⏱️</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {leads.length > 0
                        ? ((leads.filter((l) => l.status === "sucesso").length / leads.length) * 100).toFixed(1)
                        : 0}
                      %
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Webhook</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🕐 Melhor Horário</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">{analytics?.melhorHorario || "--:--"}</p>
                <p className="text-sm text-gray-600">Horário com mais conversões</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📅 Melhor Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">{analytics?.melhorDia || "--"}</p>
                <p className="text-sm text-gray-600">Dia da semana com mais leads</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📱 Dispositivo Principal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics?.leadsPorDispositivo
                    ? Object.entries(analytics.leadsPorDispositivo).reduce((a, b) =>
                        analytics.leadsPorDispositivo[a[0]] > analytics.leadsPorDispositivo[b[0]] ? a : b,
                      )[0]
                    : "Mobile"}
                </p>
                <p className="text-sm text-gray-600">Dispositivo mais usado</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos de Distribuição */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads por Origem */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Leads por Origem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.leadsPorOrigem &&
                    Object.entries(analytics.leadsPorOrigem)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([origem, count]) => {
                        const percentage = ((count / analytics.totalLeads) * 100).toFixed(1)
                        return (
                          <div key={origem} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-medium">{origem}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                              </div>
                              <span className="text-sm text-gray-600 w-12">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                </div>
              </CardContent>
            </Card>

            {/* Leads por Dispositivo */}
            <Card>
              <CardHeader>
                <CardTitle>📱 Leads por Dispositivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.leadsPorDispositivo &&
                    Object.entries(analytics.leadsPorDispositivo)
                      .sort(([, a], [, b]) => b - a)
                      .map(([dispositivo, count]) => {
                        const percentage = ((count / analytics.totalLeads) * 100).toFixed(1)
                        const colors = { Desktop: "bg-green-500", Mobile: "bg-blue-500", Tablet: "bg-purple-500" }
                        return (
                          <div key={dispositivo} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 ${colors[dispositivo as keyof typeof colors] || "bg-gray-500"} rounded-full`}
                              ></div>
                              <span className="text-sm font-medium">{dispositivo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`${colors[dispositivo as keyof typeof colors] || "bg-gray-500"} h-2 rounded-full`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-12">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leads por Tipo de Loja */}
          <Card>
            <CardHeader>
              <CardTitle>🏪 Distribuição por Tipo de Loja</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics?.leadsPorTipoLoja &&
                  Object.entries(analytics.leadsPorTipoLoja).map(([tipo, count]) => (
                    <div key={tipo} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-sm text-gray-600 capitalize">{tipo.replace("_", " ")}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB LEADS */}
        <TabsContent value="leads" className="space-y-6">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">👥</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total de Leads</p>
                    <p className="text-xl font-bold">{leads.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">✅</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Sucesso</p>
                    <p className="text-xl font-bold">{leads.filter((l) => l.status === "sucesso").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">❌</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Erros</p>
                    <p className="text-xl font-bold">{leads.filter((l) => l.status === "erro").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">⏳</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pendentes</p>
                    <p className="text-xl font-bold">{leads.filter((l) => l.status === "pendente").length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros e Ações */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gerenciar Leads</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (
                        confirm(
                          `Tem certeza que deseja reenviar TODOS os ${filteredLeads.length} leads para o webhook?`,
                        )
                      ) {
                        filteredLeads.forEach((lead) => reenviarLead(lead.id))
                      }
                    }}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    disabled={filteredLeads.length === 0}
                  >
                    🔄 Reenviar Todos
                  </Button>
                  <Button onClick={exportLeads} variant="outline">
                    📊 Exportar CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por nome, WhatsApp, origem ou localização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="sucesso">Sucesso</option>
                  <option value="erro">Erro</option>
                  <option value="enviado">Enviado</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Leads */}
          <Card>
            <CardContent className="p-0">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-4xl mb-4">👥</div>
                  <p className="mb-4">
                    {leads.length === 0
                      ? "Nenhum lead cadastrado ainda"
                      : "Nenhum lead encontrado com os filtros atuais"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dispositivo</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Localização</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium text-gray-900">{lead.nome}</div>
                              <div className="text-sm text-gray-500">#{lead.id.slice(-8)}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{lead.whatsapp}</div>
                            <div className="text-xs text-gray-500 capitalize">{lead.tipoLoja}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{lead.origem || "Direto"}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{lead.dispositivo || "Desktop"}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="text-sm text-gray-900">{lead.localizacao || "N/A"}</div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge className={getStatusColor(lead.status)}>{getStatusText(lead.status)}</Badge>
                            {lead.tentativas > 1 && (
                              <div className="text-xs text-gray-500 mt-1">{lead.tentativas} tentativas</div>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setSelectedLead(lead)}
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0"
                              >
                                👁️
                              </Button>
                              <Button
                                onClick={() => reenviarLead(lead.id)}
                                size="sm"
                                className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                                title="Reenviar para webhook"
                              >
                                🔄
                              </Button>
                              <Button
                                onClick={() => deleteLead(lead.id)}
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                              >
                                🗑️
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB ANALYTICS */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Gráfico de Leads por Hora */}
          <Card>
            <CardHeader>
              <CardTitle>📈 Leads por Horário (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-1">
                {analytics?.leadsPorHora &&
                  Object.entries(analytics.leadsPorHora).map(([hora, count]) => {
                    const maxCount = Math.max(...Object.values(analytics.leadsPorHora))
                    const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                    return (
                      <div key={hora} className="flex flex-col items-center flex-1">
                        <div
                          className="bg-blue-500 w-full rounded-t transition-all hover:bg-blue-600"
                          style={{ height: `${height}%`, minHeight: count > 0 ? "4px" : "0px" }}
                          title={`${hora}:00 - ${count} leads`}
                        ></div>
                        <span className="text-xs text-gray-600 mt-1">{hora}</span>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Métricas Avançadas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Taxa de Conversão por Origem</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.leadsPorOrigem &&
                    Object.entries(analytics.leadsPorOrigem)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([origem, count]) => {
                        const taxaConversao = (Math.random() * 8 + 2).toFixed(1) // Simulado
                        return (
                          <div key={origem} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{origem}</span>
                            <div className="text-right">
                              <div className="text-sm font-bold">{taxaConversao}%</div>
                              <div className="text-xs text-gray-500">{count} leads</div>
                            </div>
                          </div>
                        )
                      })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>⏱️ Tempo Médio por Dispositivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics?.leadsPorDispositivo &&
                    Object.entries(analytics.leadsPorDispositivo).map(([dispositivo, count]) => {
                      const tempoMedio = Math.floor(Math.random() * 180) + 60 // Simulado
                      return (
                        <div key={dispositivo} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{dispositivo}</span>
                          <div className="text-right">
                            <div className="text-sm font-bold">{formatTime(tempoMedio)}</div>
                            <div className="text-xs text-gray-500">{count} leads</div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🌍 Top Localizações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leads.reduce((acc: { [key: string]: number }, lead) => {
                    const loc = lead.localizacao || "N/A"
                    acc[loc] = (acc[loc] || 0) + 1
                    return acc
                  }, {}) &&
                    Object.entries(
                      leads.reduce((acc: { [key: string]: number }, lead) => {
                        const loc = lead.localizacao || "N/A"
                        acc[loc] = (acc[loc] || 0) + 1
                        return acc
                      }, {}),
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([cidade, count]) => (
                        <div key={cidade} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{cidade}</span>
                          <div className="text-right">
                            <div className="text-sm font-bold">{count}</div>
                            <div className="text-xs text-gray-500">{((count / leads.length) * 100).toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB WEBHOOK */}
        <TabsContent value="webhook" className="space-y-6">
          {/* Configuração do Webhook */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Webhook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL do Webhook</label>
                  <Input
                    value={webhookConfig.url}
                    onChange={(e) => setWebhookConfig({ ...webhookConfig, url: e.target.value })}
                    placeholder="https://api.exemplo.com/webhook"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Timeout (ms)</label>
                  <Input
                    type="number"
                    value={webhookConfig.timeout}
                    onChange={(e) =>
                      setWebhookConfig({ ...webhookConfig, timeout: Number.parseInt(e.target.value) || 10000 })
                    }
                    placeholder="10000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Headers Personalizados</label>
                <Textarea
                  value={JSON.stringify(webhookConfig.headers, null, 2)}
                  onChange={(e) => {
                    try {
                      const headers = JSON.parse(e.target.value)
                      setWebhookConfig({ ...webhookConfig, headers })
                    } catch (error) {
                      // Ignore invalid JSON while typing
                    }
                  }}
                  rows={4}
                  placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium">Webhook Ativo</label>
                  <p className="text-xs text-gray-600">Ativar envio automático para o webhook</p>
                </div>
                <Switch
                  checked={webhookConfig.ativo}
                  onCheckedChange={(checked) => setWebhookConfig({ ...webhookConfig, ativo: checked })}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => saveWebhookConfig(webhookConfig)} className="bg-green-600 hover:bg-green-700">
                  💾 Salvar Configuração
                </Button>
                <Button
                  onClick={testWebhook}
                  disabled={!webhookConfig.url || isTestingWebhook}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  {isTestingWebhook ? "Testando..." : "🧪 Testar Webhook"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Exemplo de Payload */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Exemplo de Payload</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                {`{
  "id": "1234567890",
  "nome": "João Silva",
  "whatsapp": "(11) 99999-9999",
  "tem_cnpj": true,
  "tipo_loja": "fisica",
  "data_envio": "2024-01-15T10:30:00.000Z",
  "origem": "Google",
  "dispositivo": "Mobile",
  "localizacao": "São Paulo"
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes do Lead */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Detalhes do Lead</h3>
              <Button onClick={() => setSelectedLead(null)} variant="outline" size="sm">
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Informações Básicas */}
              <div>
                <h4 className="font-medium mb-3">📋 Informações Básicas</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                    <p className="text-sm text-gray-900">{selectedLead.nome}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                    <p className="text-sm text-gray-900">{selectedLead.whatsapp}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CNPJ</label>
                    <p className="text-sm text-gray-900">{selectedLead.temCnpj === "sim" ? "Sim" : "Não"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Loja</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedLead.tipoLoja}</p>
                  </div>
                </div>
              </div>

              {/* Analytics do Lead */}
              <div>
                <h4 className="font-medium mb-3">📊 Analytics</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Origem</label>
                    <p className="text-sm text-gray-900">{selectedLead.origem || "Direto"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Dispositivo</label>
                    <p className="text-sm text-gray-900">{selectedLead.dispositivo || "Desktop"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Localização</label>
                    <p className="text-sm text-gray-900">{selectedLead.localizacao || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tempo na Página</label>
                    <p className="text-sm text-gray-900">
                      {selectedLead.tempoNaPagina ? formatTime(selectedLead.tempoNaPagina) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Páginas Visitadas</label>
                    <p className="text-sm text-gray-900">{selectedLead.paginasVisitadas || "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Envio</label>
                    <p className="text-sm text-gray-900">{new Date(selectedLead.dataEnvio).toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              </div>

              {/* Status e Webhook */}
              <div>
                <h4 className="font-medium mb-3">⚙️ Status e Webhook</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <Badge className={getStatusColor(selectedLead.status)}>{getStatusText(selectedLead.status)}</Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tentativas</label>
                    <p className="text-sm text-gray-900">{selectedLead.tentativas}</p>
                  </div>
                </div>

                {selectedLead.webhookResponse && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resposta do Webhook</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-xs text-gray-600">Status HTTP:</span>
                          <p className="font-mono text-sm">{selectedLead.webhookResponse.status}</p>
                        </div>
                        {selectedLead.webhookResponse.id_lead && (
                          <div>
                            <span className="text-xs text-gray-600">ID Lead:</span>
                            <p className="font-mono text-sm">{selectedLead.webhookResponse.id_lead}</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Resposta:</span>
                        <pre className="text-xs bg-white p-2 rounded border mt-1 overflow-x-auto">
                          {JSON.stringify(selectedLead.webhookResponse.response, null, 2)}
                        </pre>
                      </div>
                      {selectedLead.webhookResponse.error && (
                        <div className="mt-2">
                          <span className="text-xs text-red-600">Erro:</span>
                          <p className="text-sm text-red-700 bg-red-50 p-2 rounded mt-1">
                            {selectedLead.webhookResponse.error}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    reenviarLead(selectedLead.id)
                    setSelectedLead(null)
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  🔄 Reenviar para Webhook
                </Button>
                <Button onClick={() => setSelectedLead(null)} variant="outline">
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
