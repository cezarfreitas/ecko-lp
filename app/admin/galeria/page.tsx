"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

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

export default function AdminGaleriaPage() {
  const [galeria, setGaleria] = useState<GaleriaItem[]>(DEFAULT_GALERIA)
  const [config, setConfig] = useState<GaleriaConfig>({
    title: "Nova Coleção",
    subtitle: "Descubra as últimas tendências da moda",
    active: true,
  })
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      const savedData = localStorage.getItem("galeria-data")
      if (savedData) {
        const parsed = JSON.parse(savedData)
        if (parsed.galeria && Array.isArray(parsed.galeria)) {
          setGaleria(parsed.galeria)
        }
        if (parsed.config) {
          setConfig(parsed.config)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar galeria:", error)
    }
  }

  const saveData = (newGaleria: GaleriaItem[], newConfig: GaleriaConfig) => {
    setSaveStatus("saving")
    try {
      const dataToSave = { galeria: newGaleria, config: newConfig }
      localStorage.setItem("galeria-data", JSON.stringify(dataToSave))
      window.dispatchEvent(new CustomEvent("galeria-updated", { detail: dataToSave }))
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    } catch (error) {
      console.error("Erro ao salvar galeria:", error)
      setSaveStatus("idle")
    }
  }

  const addGaleriaItem = () => {
    const newItem: GaleriaItem = {
      id: Date.now().toString(),
      imagem: "/placeholder.svg?height=400&width=300",
      titulo: "Nova Imagem",
      descricao: "Descrição da imagem",
    }
    const newGaleria = [...galeria, newItem]
    setGaleria(newGaleria)
    saveData(newGaleria, config)
  }

  const updateGaleriaItem = (itemId: string, field: keyof GaleriaItem, value: string) => {
    const newGaleria = galeria.map((item) => (item.id === itemId ? { ...item, [field]: value } : item))
    setGaleria(newGaleria)
    saveData(newGaleria, config)
  }

  const deleteGaleriaItem = (itemId: string) => {
    if (confirm("Tem certeza que deseja excluir esta imagem?")) {
      const newGaleria = galeria.filter((item) => item.id !== itemId)
      setGaleria(newGaleria)
      saveData(newGaleria, config)
    }
  }

  const updateConfig = (field: keyof GaleriaConfig, value: string | boolean) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    saveData(galeria, newConfig)
  }

  const handleImageUpload = (itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
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
            saveData(newGaleria, config)
            return newGaleria
          })
        }
        reader.readAsDataURL(file)
      })
    }
  }

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
    saveData(newGaleria, config)
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">🖼️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Imagens</p>
                <p className="text-xl font-bold">{galeria.length}</p>
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
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
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
          <CardTitle>Configurações da Galeria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título Principal</label>
              <Input
                value={config.title}
                onChange={(e) => updateConfig("title", e.target.value)}
                placeholder="Nova Coleção"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtítulo</label>
              <Input
                value={config.subtitle}
                onChange={(e) => updateConfig("subtitle", e.target.value)}
                placeholder="Descubra as últimas tendências da moda"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium">Seção Ativa</label>
              <p className="text-xs text-gray-600">Controla se a galeria aparece no site</p>
            </div>
            <Switch checked={config.active} onCheckedChange={(checked) => updateConfig("active", checked)} />
          </div>
        </CardContent>
      </Card>

      {/* Upload e Controles da Galeria */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Galeria de Imagens</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Arraste as imagens para reordenar</p>
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
                  className={`cursor-move transition-all hover:shadow-lg ${draggedItem === index ? "opacity-50" : ""}`}
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
                          onChange={(e) => handleImageUpload(item.id, e)}
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
    </div>
  )
}
