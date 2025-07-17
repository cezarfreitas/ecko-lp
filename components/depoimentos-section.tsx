"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

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

// Dados padrão
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
  {
    id: "5",
    nome: "Fernanda Lima",
    cargo: "Gerente de Produto",
    empresa: "StartupTech",
    depoimento:
      "A parceria foi fundamental para o crescimento da nossa startup. Entregaram soluções inovadoras que nos ajudaram a conquistar novos mercados e aumentar nossa base de clientes.",
    avatar: "/professional-woman-avatar.png",
  },
  {
    id: "6",
    nome: "Roberto Mendes",
    cargo: "Diretor Comercial",
    empresa: "VendaMais Corp",
    depoimento:
      "Resultados excepcionais! Nossa conversão aumentou 300% após implementarmos as estratégias sugeridas. A equipe é altamente qualificada e sempre disponível para suporte.",
    avatar: "/professional-man-avatar.png",
  },
]

export default function DepoimentosSection() {
  const [depoimentos, setDepoimentos] = useState<DepoimentoItem[]>(DEFAULT_DEPOIMENTOS)
  const [config, setConfig] = useState<DepoimentosConfig>({
    title: "Depoimentos",
    subtitle: "O que nossos clientes dizem sobre nós",
    active: true,
  })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Função para carregar dados
  const loadData = () => {
    try {
      const savedData = localStorage.getItem("depoimentos-data")
      if (savedData) {
        const parsed = JSON.parse(savedData)
        console.log("Depoimentos Section - Dados carregados:", parsed)

        if (parsed.depoimentos && Array.isArray(parsed.depoimentos)) {
          setDepoimentos(parsed.depoimentos)
        }
        if (parsed.config) {
          setConfig(parsed.config)
        }
      }
    } catch (error) {
      console.error("Erro ao carregar dados dos depoimentos:", error)
    }
  }

  // Carregar dados na inicialização
  useEffect(() => {
    loadData()
  }, [])

  // Escutar mudanças do admin
  useEffect(() => {
    const handleDepoimentosUpdate = (event: CustomEvent) => {
      console.log("Depoimentos Section - Recebeu atualização:", event.detail)
      if (event.detail.depoimentos) {
        setDepoimentos(event.detail.depoimentos)
      }
      if (event.detail.config) {
        setConfig(event.detail.config)
      }
    }

    window.addEventListener("depoimentos-updated", handleDepoimentosUpdate as EventListener)

    // Também escutar mudanças no localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "depoimentos-data") {
        loadData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("depoimentos-updated", handleDepoimentosUpdate as EventListener)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isHovered || depoimentos.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const maxSlides = Math.ceil(depoimentos.length / getItemsPerSlide())
        return prev >= maxSlides - 1 ? 0 : prev + 1
      })
    }, 5000) // Muda a cada 5 segundos

    return () => clearInterval(interval)
  }, [isAutoPlaying, isHovered, depoimentos.length])

  // Função para determinar quantos itens mostrar por slide
  const getItemsPerSlide = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768 ? 2 : 1 // 2 no desktop, 1 no mobile
    }
    return 2
  }

  // Navegação do slider
  const nextSlide = () => {
    const maxSlides = Math.ceil(depoimentos.length / getItemsPerSlide())
    setCurrentSlide((prev) => (prev >= maxSlides - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    const maxSlides = Math.ceil(depoimentos.length / getItemsPerSlide())
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Touch handlers para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // Não renderizar se a seção estiver inativa
  if (!config.active) {
    return null
  }

  if (depoimentos.length === 0) {
    return (
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-500">Nenhum depoimento disponível</p>
          </div>
        </div>
      </section>
    )
  }

  const itemsPerSlide = getItemsPerSlide()
  const maxSlides = Math.ceil(depoimentos.length / itemsPerSlide)
  const currentDepoimentos = depoimentos.slice(
    currentSlide * itemsPerSlide,
    currentSlide * itemsPerSlide + itemsPerSlide,
  )

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{config.title}</h2>
          <div className="w-16 md:w-20 h-1 bg-red-600 mx-auto mb-4 md:mb-6"></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 px-4">{config.subtitle}</p>
        </div>

        {/* Slider Container */}
        <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          {/* Slider Content */}
          <div
            ref={sliderRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 transition-all duration-500 ease-in-out">
              {currentDepoimentos.map((depoimento, index) => (
                <div
                  key={depoimento.id}
                  className="bg-gray-50 p-6 md:p-8 rounded-lg hover:shadow-lg transition-all duration-300 border-l-4 border-red-600 h-full flex flex-col"
                  style={{
                    animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <img
                      src={depoimento.avatar || "/placeholder.svg?height=64&width=64"}
                      alt={`Avatar de ${depoimento.nome}`}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{depoimento.nome}</h3>
                      <p className="text-red-600 font-medium">{depoimento.cargo}</p>
                      <p className="text-gray-600 text-sm">{depoimento.empresa}</p>
                    </div>
                  </div>

                  <blockquote className="text-gray-700 leading-relaxed italic flex-1 text-sm md:text-base">
                    "{depoimento.depoimento}"
                  </blockquote>

                  {/* Rating Stars */}
                  <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-lg">
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">5.0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {maxSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-200 transition-all duration-200 z-10"
                aria-label="Depoimento anterior"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-600 hover:border-red-200 transition-all duration-200 z-10"
                aria-label="Próximo depoimento"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {maxSlides > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(maxSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? "bg-red-600 scale-110" : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        {depoimentos.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4 text-sm md:text-base">Quer fazer parte dos nossos casos de sucesso?</p>
            <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium px-6 md:px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] touch-manipulation">
              Começar Meu Projeto
            </button>
          </div>
        )}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
