"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

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

export default function AdminDepoimentosPage() {
  const [depoimentos, setDepoimentos] = useState<DepoimentoItem[]>(DEFAULT_DEPOIMENTOS)
  const [config, setConfig] = useState<DepoimentosConfig>({
    title: "Depoimentos",
    subtitle: "O que nossos clientes dizem sobre nós",
    active: true,
  })
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      const savedData = localStorage.getItem("depoimentos-data")
      if (savedData) {
        const parsed = JSON.parse(savedData)
        if (parsed.depoimentos && Array.isArray(parsed.depoimentos)) {
          setDepoimentos(parsed.depoimentos)
        }
        if (parsed.config) {
          setConfig(parsed.config)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar depoimentos:", error)
    }
  }

  const saveData = (newDepoimentos: DepoimentoItem[], newConfig: DepoimentosConfig) => {
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
    saveData(newDepoimentos, config)
  }

  const updateDepoimento = (depoimentoId: string, field: keyof DepoimentoItem, value: string) => {
    const newDepoimentos = depoimentos.map((depoimento) =>
      depoimento.id === depoimentoId ? { ...depoimento, [field]: value } : depoimento,
    )
    setDepoimentos(newDepoimentos)
    saveData(newDepoimentos, config)
  }

  const deleteDepoimento = (depoimentoId: string) => {
    if (confirm("Tem certeza que deseja excluir este depoimento?")) {
      const newDepoimentos = depoimentos.filter((depoimento) => depoimento.id !== depoimentoId)
      setDepoimentos(newDepoimentos)
      saveData(newDepoimentos, config)
    }
  }

  const updateConfig = (field: keyof DepoimentosConfig, value: string | boolean) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    saveData(depoimentos, newConfig)
  }

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

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">💬</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Depoimentos</p>
                <p className="text-xl font-bold">{depoimentos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
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
          <CardTitle>Configurações da Seção Depoimentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título Principal</label>
              <Input
                value={config.title}
                onChange={(e) => updateConfig("title", e.target.value)}
                placeholder="Depoimentos"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtítulo</label>
              <Input
                value={config.subtitle}
                onChange={(e) => updateConfig("subtitle", e.target.value)}
                placeholder="O que nossos clientes dizem sobre nós"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium">Seção Ativa</label>
              <p className="text-xs text-gray-600">Controla se a seção Depoimentos aparece no site</p>
            </div>
            <Switch checked={config.active} onCheckedChange={(checked) => updateConfig("active", checked)} />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Depoimentos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Depoimentos de Clientes</CardTitle>
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
                <Card key={depoimento.id} className="border-l-4 border-green-600">
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
    </div>
  )
}
