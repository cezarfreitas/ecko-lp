"use client"

import type React from "react"

import { useState } from "react"

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
}

interface WebhookConfig {
  url: string
  ativo: boolean
  headers: { [key: string]: string }
  timeout: number
}

export default function ContatoSection() {
  const [temCnpj, setTemCnpj] = useState<string>("")
  const [showError, setShowError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const handleCnpjChange = (value: string) => {
    setTemCnpj(value)
    if (value === "nao") {
      setShowError(true)
    } else {
      setShowError(false)
    }
  }

  const sendToWebhook = async (lead: Lead): Promise<{ success: boolean; response?: any; error?: string }> => {
    try {
      // Carregar configuração do webhook
      const savedWebhookConfig = localStorage.getItem("webhook-config")
      if (!savedWebhookConfig) {
        return { success: false, error: "Webhook não configurado" }
      }

      const webhookConfig: WebhookConfig = JSON.parse(savedWebhookConfig)

      if (!webhookConfig.url || !webhookConfig.ativo) {
        return { success: false, error: "Webhook não configurado ou inativo" }
      }

      const payload = {
        id: lead.id,
        nome: lead.nome,
        whatsapp: lead.whatsapp,
        tem_cnpj: lead.temCnpj === "sim",
        tipo_loja: lead.tipoLoja,
        data_envio: lead.dataEnvio,
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

  const saveLead = (lead: Lead) => {
    try {
      const savedLeads = localStorage.getItem("leads-data")
      const leads: Lead[] = savedLeads ? JSON.parse(savedLeads) : []
      leads.push(lead)
      localStorage.setItem("leads-data", JSON.stringify(leads))
    } catch (error) {
      console.error("Erro ao salvar lead:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (temCnpj === "nao") {
      setShowError(true)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const formData = new FormData(e.target as HTMLFormElement)

      const lead: Lead = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        nome: formData.get("nome") as string,
        whatsapp: formData.get("whatsapp") as string,
        temCnpj: temCnpj,
        tipoLoja: formData.get("tipo_loja") as string,
        dataEnvio: new Date().toISOString(),
        status: "pendente",
        tentativas: 1,
      }

      // Salvar lead localmente primeiro
      saveLead(lead)

      // Tentar enviar para webhook
      const webhookResult = await sendToWebhook(lead)

      // Atualizar status do lead baseado no resultado do webhook
      const updatedLead: Lead = {
        ...lead,
        status: webhookResult.success ? "sucesso" : "erro",
        webhookResponse: webhookResult.response || { status: 0, response: null, error: webhookResult.error },
      }

      // Atualizar lead salvo
      const savedLeads = localStorage.getItem("leads-data")
      const leads: Lead[] = savedLeads ? JSON.parse(savedLeads) : []
      const leadIndex = leads.findIndex((l) => l.id === lead.id)
      if (leadIndex !== -1) {
        leads[leadIndex] = updatedLead
        localStorage.setItem("leads-data", JSON.stringify(leads))
      }

      setSubmitStatus("success")

      // Reset form
      ;(e.target as HTMLFormElement).reset()
      setTemCnpj("")
      setShowError(false)
    } catch (error) {
      console.error("Erro ao processar formulário:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-0">
      {/* Layout Mobile-First */}
      <div className="flex flex-col md:grid md:grid-cols-2 min-h-[600px] md:h-[500px]">
        {/* Lado da Imagem com Mensagens - Mobile: Menor altura */}
        <div className="relative h-[300px] md:h-full overflow-hidden order-1 md:order-1">
          <img
            src="/fashion-wholesale-background.png"
            alt="Roupas para revenda"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center text-white max-w-sm">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3">Seja um Lojista de Sucesso!</h2>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-red-400 text-sm">✓</span>
                  <span>
                    <strong>Margens de 60% a 80%</strong> de lucro
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-red-400 text-sm">✓</span>
                  <span>
                    <strong>Pronta entrega</strong> em 24h
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-red-400 text-sm">✓</span>
                  <span>
                    <strong>Sem pedido mínimo</strong> para começar
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-red-400 text-sm">✓</span>
                  <span>
                    <strong>Suporte completo</strong> para vendas
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-red-600/90 rounded-lg">
                <p className="text-xs sm:text-sm font-bold">Últimas 20 vagas para lojistas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado do Formulário - Mobile: Padding maior */}
        <div className="bg-white flex items-center justify-center p-6 md:p-4 min-h-[400px] md:h-full order-2 md:order-2">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-lg font-bold text-gray-900 mb-2">Quero Ser Lojista</h3>
              <div className="w-16 h-1 bg-red-600 mx-auto mb-3"></div>
              <p className="text-gray-600 text-sm">Receba catálogo e preços de atacado</p>
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">✅ Cadastro realizado com sucesso!</p>
                <p className="text-green-600 text-xs mt-1">Entraremos em contato em breve via WhatsApp.</p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">❌ Erro ao enviar cadastro</p>
                <p className="text-red-600 text-xs mt-1">Tente novamente ou entre em contato conosco.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo *</label>
                <input
                  type="text"
                  name="nome"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm disabled:bg-gray-100"
                  placeholder="Digite seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp *</label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm disabled:bg-gray-100"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Possui CNPJ? *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleCnpjChange("sim")}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-50 touch-manipulation ${
                      temCnpj === "sim"
                        ? "bg-green-500 text-white shadow-lg"
                        : "border-2 border-gray-300 text-gray-700 hover:border-green-400 active:bg-green-50"
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleCnpjChange("nao")}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all disabled:opacity-50 touch-manipulation ${
                      temCnpj === "nao"
                        ? "bg-red-500 text-white shadow-lg"
                        : "border-2 border-gray-300 text-gray-700 hover:border-red-400 active:bg-red-50"
                    }`}
                  >
                    Não
                  </button>
                </div>
              </div>

              {showError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <p className="text-red-700 text-sm">
                    <strong>CNPJ obrigatório.</strong> Para ser lojista é necessário ter CNPJ ativo.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo da loja *</label>
                <select
                  name="tipo_loja"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm text-gray-700 disabled:bg-gray-100 bg-white appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingRight: "3rem",
                  }}
                >
                  <option value="">Selecione...</option>
                  <option value="fisica">Loja física</option>
                  <option value="online">Loja online</option>
                  <option value="ambas">Física + Online</option>
                  <option value="iniciante">Quero começar</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={temCnpj === "nao" || isSubmitting}
                className={`w-full py-4 rounded-lg font-bold text-sm transition-all duration-200 touch-manipulation ${
                  temCnpj === "nao" || isSubmitting
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg hover:shadow-xl active:scale-[0.98]"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ENVIANDO...
                  </span>
                ) : temCnpj === "nao" ? (
                  "CNPJ NECESSÁRIO"
                ) : (
                  "RECEBER CATÁLOGO NO WHATSAPP"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">🔒 Dados seguros • ⚡ Resposta imediata</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
