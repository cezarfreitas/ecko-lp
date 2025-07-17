"use client"

import { useEffect, useState } from "react"

interface SiteConfig {
  schema: {
    type: string
    name: string
    description: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    phone: string
    email: string
    socialMedia: {
      facebook: string
      instagram: string
      twitter: string
      linkedin: string
      youtube: string
    }
  }
  url: string
  logo: string
}

const DEFAULT_SITE_CONFIG = {
  schema: {
    type: "Organization",
    name: "Sua Empresa",
    description: "Empresa especializada em soluções digitais inovadoras",
    address: {
      street: "Rua Exemplo, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      country: "Brasil",
    },
    phone: "+55 11 99999-9999",
    email: "contato@seusite.com.br",
    socialMedia: {
      facebook: "https://facebook.com/suaempresa",
      instagram: "https://instagram.com/suaempresa",
      twitter: "https://twitter.com/suaempresa",
      linkedin: "https://linkedin.com/company/suaempresa",
      youtube: "https://youtube.com/@suaempresa",
    },
  },
  url: "https://seusite.com.br",
  logo: "/logo.png",
}

export default function StructuredData() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG)

  useEffect(() => {
    const loadSiteConfig = () => {
      try {
        const savedConfig = localStorage.getItem("site-config")
        if (savedConfig) {
          setSiteConfig({ ...DEFAULT_SITE_CONFIG, ...JSON.parse(savedConfig) })
        }
      } catch (error) {
        console.error("Erro ao carregar configuração do site:", error)
      }
    }

    loadSiteConfig()

    // Escutar mudanças na configuração do site
    const handleSiteConfigUpdate = (event: CustomEvent) => {
      setSiteConfig({ ...DEFAULT_SITE_CONFIG, ...event.detail })
    }

    window.addEventListener("site-config-updated", handleSiteConfigUpdate as EventListener)

    return () => {
      window.removeEventListener("site-config-updated", handleSiteConfigUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    // Remover script anterior se existir
    const existingScript = document.getElementById("structured-data")
    if (existingScript) {
      existingScript.remove()
    }

    // Criar dados estruturados
    const structuredData = {
      "@context": "https://schema.org",
      "@type": siteConfig.schema.type,
      name: siteConfig.schema.name,
      description: siteConfig.schema.description,
      url: siteConfig.url,
      logo: `${siteConfig.url}${siteConfig.logo}`,
      telephone: siteConfig.schema.phone,
      email: siteConfig.schema.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.schema.address.street,
        addressLocality: siteConfig.schema.address.city,
        addressRegion: siteConfig.schema.address.state,
        postalCode: siteConfig.schema.address.zipCode,
        addressCountry: siteConfig.schema.address.country,
      },
      sameAs: [
        siteConfig.schema.socialMedia.facebook,
        siteConfig.schema.socialMedia.instagram,
        siteConfig.schema.socialMedia.twitter,
        siteConfig.schema.socialMedia.linkedin,
        siteConfig.schema.socialMedia.youtube,
      ].filter(Boolean),
    }

    // Adicionar script com dados estruturados
    const script = document.createElement("script")
    script.id = "structured-data"
    script.type = "application/ld+json"
    script.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script)
  }, [siteConfig])

  return null
}
