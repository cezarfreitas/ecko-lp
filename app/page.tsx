"use client"

import { useEffect, useState } from "react"
import HeaderSection from "@/components/header-section"
import EmpresaSection from "@/components/empresa-section"
import ShowroomSection from "@/components/showroom-section"
import GaleriaSection from "@/components/galeria-section"
import DepoimentosSection from "@/components/depoimentos-section"
import RevendaSection from "@/components/revenda-section"
import FAQSection from "@/components/faq-section"
import ContatoSection from "@/components/contato-section"
import Footer from "@/components/footer"
import SEOHead from "@/components/seo-head"
import PerformanceOptimizer from "@/components/performance-optimizer"
import StructuredData from "@/components/structured-data"
import GlobalStyles from "@/components/global-styles"
import WhatsAppFloatButton from "@/components/whatsapp-float-button"

interface SectionConfig {
  id: string
  name: string
  component: string
  enabled: boolean
  order: number
  description: string
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  {
    id: "header",
    name: "Header/Cabeçalho",
    component: "HeaderSection",
    enabled: true,
    order: 0,
    description: "Cabeçalho com logo, frase e imagem de fundo",
  },
  {
    id: "empresa",
    name: "Sobre a Empresa",
    component: "EmpresaSection",
    enabled: true,
    order: 1,
    description: "Seção com informações sobre a empresa e história",
  },
  {
    id: "showroom",
    name: "Showroom",
    component: "ShowroomSection",
    enabled: true,
    order: 2,
    description: "Galeria de produtos em destaque",
  },
  {
    id: "galeria",
    name: "Galeria",
    component: "GaleriaSection",
    enabled: true,
    order: 3,
    description: "Galeria completa de imagens dos produtos",
  },
  {
    id: "depoimentos",
    name: "Depoimentos",
    component: "DepoimentosSection",
    enabled: true,
    order: 4,
    description: "Avaliações e depoimentos de clientes",
  },
  {
    id: "revenda",
    name: "Seja Revendedor",
    component: "RevendaSection",
    enabled: true,
    order: 5,
    description: "Informações sobre programa de revenda",
  },
  {
    id: "faq",
    name: "Perguntas Frequentes",
    component: "FAQSection",
    enabled: true,
    order: 6,
    description: "Dúvidas mais comuns dos clientes",
  },
  {
    id: "contato",
    name: "Contato",
    component: "ContatoSection",
    enabled: true,
    order: 7,
    description: "Formulário de contato e informações",
  },
]

const SECTION_COMPONENTS = {
  HeaderSection,
  EmpresaSection,
  ShowroomSection,
  GaleriaSection,
  DepoimentosSection,
  RevendaSection,
  FAQSection,
  ContatoSection,
}

export default function HomePage() {
  const [sections, setSections] = useState<SectionConfig[]>(DEFAULT_SECTIONS)

  useEffect(() => {
    // Carregar configuração das seções
    const loadSectionsConfig = () => {
      try {
        const savedSections = localStorage.getItem("sections-config")
        if (savedSections) {
          setSections(JSON.parse(savedSections))
        }
      } catch (error) {
        console.error("Erro ao carregar configuração das seções:", error)
      }
    }

    loadSectionsConfig()

    // Escutar mudanças na configuração das seções
    const handleSectionsUpdate = (event: CustomEvent) => {
      setSections(event.detail)
    }

    window.addEventListener("sections-config-updated", handleSectionsUpdate as EventListener)

    return () => {
      window.removeEventListener("sections-config-updated", handleSectionsUpdate as EventListener)
    }
  }, [])

  // Renderizar seções na ordem configurada
  const renderSections = () => {
    return sections
      .filter((section) => section.enabled) // Apenas seções habilitadas
      .sort((a, b) => a.order - b.order) // Ordenar pela ordem configurada
      .map((section) => {
        const Component = SECTION_COMPONENTS[section.component as keyof typeof SECTION_COMPONENTS]
        if (!Component) {
          console.warn(`Componente ${section.component} não encontrado`)
          return null
        }
        return <Component key={section.id} />
      })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead />
      <StructuredData />
      <GlobalStyles />
      <PerformanceOptimizer />

      <main>{renderSections()}</main>

      <Footer />
      <WhatsAppFloatButton />
    </div>
  )
}
