"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

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

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS)
  const [config, setConfig] = useState<FaqConfig>({
    title: "FAQ",
    subtitle: "Respostas para suas principais dúvidas",
    active: true,
  })
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      const savedData = localStorage.getItem("faq-data")
      if (savedData) {
        const parsed = JSON.parse(savedData)
        if (parsed.faqs && Array.isArray(parsed.faqs)) {
          setFaqs(parsed.faqs)
        }
        if (parsed.config) {
          setConfig(parsed.config)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar FAQ:", error)
    }
  }

  const saveData = (newFaqs: FaqItem[], newConfig: FaqConfig) => {
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

  const addFaq = () => {
    const newFaq: FaqItem = {
      id: Date.now().toString(),
      question: "Nova pergunta",
      answer: "Nova resposta",
    }
    const newFaqs = [...faqs, newFaq]
    setFaqs(newFaqs)
    saveData(newFaqs, config)
  }

  const updateFaq = (faqId: string, field: keyof FaqItem, value: string) => {
    const newFaqs = faqs.map((faq) => (faq.id === faqId ? { ...faq, [field]: value } : faq))
    setFaqs(newFaqs)
    saveData(newFaqs, config)
  }

  const deleteFaq = (faqId: string) => {
    if (confirm("Tem certeza que deseja excluir esta pergunta?")) {
      const newFaqs = faqs.filter((faq) => faq.id !== faqId)
      setFaqs(newFaqs)
      saveData(newFaqs, config)
    }
  }

  const updateConfig = (field: keyof FaqConfig, value: string | boolean) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    saveData(faqs, newConfig)
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">❓</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Perguntas</p>
                <p className="text-xl font-bold">{faqs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">{config.active ? "✅" : "❌"}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status da Seção</p>
                <p className="text-xl font-bold">{config.active ? "Ativa" : "Inativa"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">{saveStatus === "saving" ? "⏳" : saveStatus === "saved" ? "✅" : "💾"}</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-xl font-bold">
                  {saveStatus === "saving" ? "Salvando" : saveStatus === "saved" ? "Salvo" : "Pronto"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Seção FAQ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título Principal</label>
              <Input value={config.title} onChange={(e) => updateConfig("title", e.target.value)} placeholder="FAQ" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtítulo</label>
              <Input
                value={config.subtitle}
                onChange={(e) => updateConfig("subtitle", e.target.value)}
                placeholder="Respostas para suas principais dúvidas"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium">Seção Ativa</label>
              <p className="text-xs text-gray-600">Controla se a seção FAQ aparece no site</p>
            </div>
            <Switch checked={config.active} onCheckedChange={(checked) => updateConfig("active", checked)} />
          </div>
        </CardContent>
      </Card>

      {/* Lista de FAQs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Perguntas Frequentes</CardTitle>
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
                <Card key={faq.id} className="border-l-4 border-blue-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-gray-600">Pergunta #{index + 1}</span>
                      <Button onClick={() => deleteFaq(faq.id)} size="sm" variant="destructive" className="h-8 w-8 p-0">
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
    </div>
  )
}
