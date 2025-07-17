"use client"

import { useState, useEffect } from "react"

interface FooterConfig {
  text: string
  company: string
  showHeart: boolean
}

const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  text: "Desenvolvido com ❤️ por",
  company: "Sua Empresa",
  showHeart: true,
}

export default function Footer() {
  const [footerConfig, setFooterConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG)

  useEffect(() => {
    const loadFooterConfig = () => {
      try {
        const savedConfig = localStorage.getItem("global-config")
        if (savedConfig) {
          const config = JSON.parse(savedConfig)
          if (config.footer) {
            setFooterConfig({ ...DEFAULT_FOOTER_CONFIG, ...config.footer })
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configuração do footer:", error)
      }
    }

    loadFooterConfig()

    // Escutar mudanças na configuração global
    const handleConfigUpdate = (event: CustomEvent) => {
      if (event.detail.footer) {
        setFooterConfig({ ...DEFAULT_FOOTER_CONFIG, ...event.detail.footer })
      }
    }

    window.addEventListener("global-config-updated", handleConfigUpdate as EventListener)

    return () => {
      window.removeEventListener("global-config-updated", handleConfigUpdate as EventListener)
    }
  }, [])

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-300">
            {footerConfig.text} {footerConfig.showHeart && "❤️"}{" "}
            <span className="text-red-400 font-medium">{footerConfig.company}</span>
          </p>
          <p className="text-gray-400 text-sm mt-2">© {new Date().getFullYear()} Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
