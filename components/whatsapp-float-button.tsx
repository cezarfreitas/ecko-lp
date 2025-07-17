"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Lead {
  id: string
  nome: string
  whatsapp: string
  temCnpj: string
  tipoLoja: string
  dataEnvio: string
  status: "pendente" | "enviado" | "erro" | "sucesso"
  tentativas: number
  origem: string
  dispositivo?: string
  navegador?: string
  localizacao?: string
}

export default function WhatsAppFloatButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    temCnpj: "nao",
    tipoLoja: "fisica",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Detectar dispositivo e navegador
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent
    let dispositivo = "Desktop"
    let navegador = "Unknown"

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      if (/iPad/i.test(userAgent)) {
        dispositivo = "Tablet"
      } else {
        dispositivo = "Mobile"
      }
    }

    if (userAgent.indexOf("Chrome") > -1) {
      navegador = "Chrome"
    } else if (userAgent.indexOf("Firefox") > -1) {
      navegador = "Firefox"
    } else if (userAgent.indexOf("Safari") > -1) {
      navegador = "Safari"
    } else if (userAgent.indexOf("Edge") > -1) {
      navegador = "Edge"
    }

    return { dispositivo, navegador }
  }

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "whatsapp") {
      value = formatWhatsApp(value)
    }
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validações
      if (!formData.nome.trim()) {
        alert("Por favor, preencha seu nome")
        return
      }

      if (!formData.whatsapp.trim()) {
        alert("Por favor, preencha seu WhatsApp")
        return
      }

      const whatsappNumbers = formData.whatsapp.replace(/\D/g, "")
      if (whatsappNumbers.length < 10 || whatsappNumbers.length > 11) {
        alert("Por favor, digite um WhatsApp válido")
        return
      }

      // Criar lead
      const { dispositivo, navegador } = getDeviceInfo()
      const lead: Lead = {
        id: Date.now().toString(),
        nome: formData.nome.trim(),
        whatsapp: formData.whatsapp,
        temCnpj: formData.temCnpj,
        tipoLoja: formData.tipoLoja,
        dataEnvio: new Date().toISOString(),
        status: "pendente",
        tentativas: 1,
        origem: "WhatsApp Float",
        dispositivo,
        navegador,
        localizacao: "Brasil",
      }

      // Salvar no localStorage
      const existingLeads = JSON.parse(localStorage.getItem("leads-data") || "[]")
      const updatedLeads = [...existingLeads, lead]
      localStorage.setItem("leads-data", JSON.stringify(updatedLeads))

      // Tentar enviar para webhook
      try {
        const webhookConfig = JSON.parse(localStorage.getItem("webhook-config") || "{}")
        if (webhookConfig.url && webhookConfig.ativo) {
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

          const response = await fetch(webhookConfig.url, {
            method: "POST",
            headers: webhookConfig.headers || { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

          const responseData = await response.json()

          // Atualizar status do lead
          const finalLead = {
            ...lead,
            status: response.ok ? ("sucesso" as const) : ("erro" as const),
            webhookResponse: {
              id_lead: responseData.id_lead || responseData.id || null,
              status: response.status,
              response: responseData,
              error: response.ok ? undefined : `HTTP ${response.status}`,
            },
          }

          const finalLeads = updatedLeads.map((l) => (l.id === lead.id ? finalLead : l))
          localStorage.setItem("leads-data", JSON.stringify(finalLeads))
        }
      } catch (webhookError) {
        console.error("Erro no webhook:", webhookError)
        // Lead já foi salvo, apenas atualizar status
        const errorLead = {
          ...lead,
          status: "erro" as const,
          webhookResponse: {
            status: 0,
            response: null,
            error: "Erro de conexão com webhook",
          },
        }
        const finalLeads = updatedLeads.map((l) => (l.id === lead.id ? errorLead : l))
        localStorage.setItem("leads-data", JSON.stringify(finalLeads))
      }

      // Resetar formulário e fechar modal
      setFormData({
        nome: "",
        whatsapp: "",
        temCnpj: "nao",
        tipoLoja: "fisica",
      })
      setIsModalOpen(false)
      alert("✅ Dados enviados com sucesso! Entraremos em contato em breve.")
    } catch (error) {
      console.error("Erro ao enviar dados:", error)
      alert("❌ Erro ao enviar dados. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    // Resetar formulário ao fechar
    setFormData({
      nome: "",
      whatsapp: "",
      temCnpj: "nao",
      tipoLoja: "fisica",
    })
  }

  return (
    <>
      {/* Botão Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="group relative bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center"
          aria-label="Abrir WhatsApp"
        >
          {/* Animação de pulso */}
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-30"></div>

          {/* Ícone do WhatsApp */}
          <svg
            className="w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
          </svg>

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Fale conosco
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Fale Conosco</h3>
                  <p className="text-green-100 text-sm mt-1">Preencha os dados e entraremos em contato via WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo *</label>
                  <Input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Seu nome completo"
                    required
                    disabled={isSubmitting}
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp *</label>
                  <Input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                    disabled={isSubmitting}
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Possui CNPJ? *</label>
                  <select
                    value={formData.temCnpj}
                    onChange={(e) => handleInputChange("temCnpj", e.target.value)}
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors bg-white"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Loja *</label>
                  <select
                    value={formData.tipoLoja}
                    onChange={(e) => handleInputChange("tipoLoja", e.target.value)}
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-0 transition-colors bg-white"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="fisica">Loja Física</option>
                    <option value="online">Loja Online</option>
                    <option value="ambas">Física e Online</option>
                    <option value="nao_tenho">Não tenho loja ainda</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    onClick={closeModal}
                    variant="outline"
                    className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold bg-transparent"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Enviando...
                      </div>
                    ) : (
                      "💬 Enviar Mensagem"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
