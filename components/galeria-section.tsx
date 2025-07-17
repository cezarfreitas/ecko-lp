"use client"

import { useState, useEffect } from "react"

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

// Dados padrão - SEMPRE visíveis
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

export default function GaleriaSection() {
  const [galeria, setGaleria] = useState<GaleriaItem[]>(DEFAULT_GALERIA)
  const [config, setConfig] = useState<GaleriaConfig>({
    title: "Nova Coleção",
    subtitle: "Descubra as últimas tendências da moda",
    active: true,
  })
  const [isLoading, setIsLoading] = useState(true)

  // Função para carregar dados
  const loadData = () => {
    try {
      const savedData = localStorage.getItem("galeria-data")
      console.log("🖼️ Galeria - Tentando carregar dados:", savedData)

      if (savedData) {
        const parsed = JSON.parse(savedData)
        console.log("🖼️ Galeria - Dados parseados:", parsed)

        if (parsed.galeria && Array.isArray(parsed.galeria) && parsed.galeria.length > 0) {
          setGaleria(parsed.galeria)
          console.log("🖼️ Galeria - Dados carregados com sucesso:", parsed.galeria.length, "imagens")
        } else {
          console.log("🖼️ Galeria - Usando dados padrão")
          setGaleria(DEFAULT_GALERIA)
        }

        if (parsed.config) {
          setConfig(parsed.config)
        }
      } else {
        console.log("🖼️ Galeria - Nenhum dado salvo, usando padrão")
        setGaleria(DEFAULT_GALERIA)
      }
    } catch (error) {
      console.error("🖼️ Galeria - Erro ao carregar dados:", error)
      setGaleria(DEFAULT_GALERIA)
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar dados na inicialização
  useEffect(() => {
    loadData()
  }, [])

  // Escutar mudanças do admin
  useEffect(() => {
    const handleGaleriaUpdate = (event: CustomEvent) => {
      console.log("🖼️ Galeria - Recebeu atualização do admin:", event.detail)
      if (event.detail.galeria) {
        setGaleria(event.detail.galeria)
      }
      if (event.detail.config) {
        setConfig(event.detail.config)
      }
    }

    window.addEventListener("galeria-updated", handleGaleriaUpdate as EventListener)

    // Também escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "galeria-data") {
        console.log("🖼️ Galeria - Detectou mudança no localStorage")
        loadData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("galeria-updated", handleGaleriaUpdate as EventListener)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando galeria...</p>
          </div>
        </div>
      </section>
    )
  }

  // Não renderizar se a seção estiver inativa
  if (!config.active) {
    console.log("🖼️ Galeria - Seção inativa, não renderizando")
    return null
  }

  console.log("🖼️ Galeria - Renderizando com", galeria.length, "imagens")

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{config.title}</h2>
          <div className="w-16 md:w-20 h-1 bg-red-600 mx-auto mb-4 md:mb-6"></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 px-4">{config.subtitle}</p>
        </div>

        {galeria.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">🖼️</div>
            <p>Nenhuma imagem na galeria</p>
            <p className="text-sm mt-2">Acesse o admin para adicionar imagens</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {galeria.map((item, index) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.imagem || "/placeholder.svg?height=400&width=300"}
                    alt={item.titulo || `Imagem ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      console.log("🖼️ Erro ao carregar imagem:", item.imagem)
                      e.currentTarget.src = "/placeholder.svg?height=400&width=300"
                    }}
                  />
                </div>

                {/* Overlay com informações - Otimizado para mobile */}
                {(item.titulo || item.descricao) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 text-white">
                      {item.titulo && (
                        <h3 className="font-bold text-sm md:text-lg mb-1 leading-tight">{item.titulo}</h3>
                      )}
                      {item.descricao && (
                        <p className="text-xs md:text-sm opacity-90 leading-tight line-clamp-2">{item.descricao}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Debug info - remover em produção */}
        <div className="mt-8 p-4 bg-blue-50 rounded text-xs text-blue-800">
          <strong>Debug Galeria:</strong> {galeria.length} imagens carregadas | Seção ativa:{" "}
          {config.active ? "Sim" : "Não"} | Dados no localStorage:{" "}
          {localStorage.getItem("galeria-data") ? "Sim" : "Não"}
        </div>
      </div>
    </section>
  )
}
