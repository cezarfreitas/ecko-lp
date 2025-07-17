"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

interface HeaderData {
  logo: string
  title: string
  subtitle: string
  description: string
  backgroundImage: string
  ctaText: string
  ctaLink: string
  showCta: boolean
  showScrollIndicator: boolean
  textColor: string
  overlayOpacity: number
}

const DEFAULT_HEADER_DATA: HeaderData = {
  logo: "/placeholder.svg?height=80&width=200&text=Logo",
  title: "Bem-vindos à Nossa Empresa",
  subtitle: "Soluções Inovadoras",
  description:
    "Oferecemos produtos e serviços de alta qualidade para transformar seu negócio e alcançar resultados extraordinários.",
  backgroundImage: "/placeholder.svg?height=600&width=1200&text=Header+Background",
  ctaText: "Conheça Nossos Produtos",
  ctaLink: "#produtos",
  showCta: true,
  showScrollIndicator: true,
  textColor: "#ffffff",
  overlayOpacity: 0.5,
}

export default function HeaderSection() {
  const [headerData, setHeaderData] = useState<HeaderData>(DEFAULT_HEADER_DATA)

  useEffect(() => {
    const loadHeaderData = () => {
      try {
        const savedData = localStorage.getItem("header-data")
        if (savedData) {
          const parsed = JSON.parse(savedData)
          setHeaderData({ ...DEFAULT_HEADER_DATA, ...parsed })
        }
      } catch (error) {
        console.error("Erro ao carregar dados do header:", error)
      }
    }

    loadHeaderData()

    // Escutar mudanças nos dados do header
    const handleHeaderUpdate = (event: CustomEvent) => {
      setHeaderData({ ...DEFAULT_HEADER_DATA, ...event.detail })
    }

    window.addEventListener("header-updated", handleHeaderUpdate as EventListener)

    return () => {
      window.removeEventListener("header-updated", handleHeaderUpdate as EventListener)
    }
  }, [])

  const scrollToNext = () => {
    const headerHeight = window.innerHeight
    window.scrollTo({
      top: headerHeight,
      behavior: "smooth",
    })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${headerData.backgroundImage})`,
        }}
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          opacity: headerData.overlayOpacity,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Logo */}
        {headerData.logo && (
          <div className="mb-8">
            <img
              src={headerData.logo || "/placeholder.svg"}
              alt="Logo"
              className="h-16 sm:h-20 mx-auto object-contain"
              loading="eager"
            />
          </div>
        )}

        {/* Subtitle */}
        {headerData.subtitle && (
          <p
            className="text-lg sm:text-xl md:text-2xl font-medium mb-4 opacity-90"
            style={{ color: headerData.textColor }}
          >
            {headerData.subtitle}
          </p>
        )}

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          style={{ color: headerData.textColor }}
        >
          {headerData.title}
        </h1>

        {/* Description */}
        {headerData.description && (
          <p
            className="text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90"
            style={{ color: headerData.textColor }}
          >
            {headerData.description}
          </p>
        )}

        {/* CTA Button */}
        {headerData.showCta && headerData.ctaText && (
          <div className="mb-12">
            <Button
              size="lg"
              className="text-lg px-8 py-4 h-auto bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                if (headerData.ctaLink.startsWith("#")) {
                  const element = document.querySelector(headerData.ctaLink)
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" })
                  }
                } else {
                  window.open(headerData.ctaLink, "_blank")
                }
              }}
            >
              {headerData.ctaText}
            </Button>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      {headerData.showScrollIndicator && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={scrollToNext}
            className="flex flex-col items-center text-white opacity-70 hover:opacity-100 transition-opacity duration-300 group"
            aria-label="Rolar para baixo"
          >
            <span className="text-sm mb-2 hidden sm:block">Role para baixo</span>
            <ChevronDown
              size={32}
              className="animate-bounce group-hover:animate-pulse"
              style={{ color: headerData.textColor }}
            />
          </button>
        </div>
      )}

      {/* Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-5" />
    </section>
  )
}
