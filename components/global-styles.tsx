"use client"

import { useEffect } from "react"

export default function GlobalStyles() {
  useEffect(() => {
    // Aplicar estilos globais baseados nas configurações
    const applyGlobalStyles = () => {
      try {
        const savedConfig = localStorage.getItem("global-config")
        if (savedConfig) {
          const config = JSON.parse(savedConfig)
          const root = document.documentElement

          // Aplicar cores CSS custom properties
          if (config.colors) {
            root.style.setProperty("--color-primary", config.colors.primary || "#dc2626")
            root.style.setProperty("--color-secondary", config.colors.secondary || "#1f2937")
            root.style.setProperty("--color-accent", config.colors.accent || "#f59e0b")
            root.style.setProperty("--color-background", config.colors.background || "#ffffff")
            root.style.setProperty("--color-background-section", config.colors.backgroundSection || "#f9fafb")
            root.style.setProperty("--color-background-card", config.colors.backgroundCard || "#ffffff")
            root.style.setProperty("--color-text-primary", config.colors.text?.primary || "#111827")
            root.style.setProperty("--color-text-secondary", config.colors.text?.secondary || "#6b7280")
            root.style.setProperty("--color-text-muted", config.colors.text?.muted || "#9ca3af")
            root.style.setProperty("--color-success", config.colors.success || "#10b981")
            root.style.setProperty("--color-warning", config.colors.warning || "#f59e0b")
            root.style.setProperty("--color-error", config.colors.error || "#ef4444")
          }

          // Aplicar fontes
          if (config.fonts) {
            root.style.setProperty("--font-primary", config.fonts.primary || "Inter, system-ui, sans-serif")
            root.style.setProperty("--font-secondary", config.fonts.secondary || "Georgia, serif")
            root.style.setProperty("--font-size-small", config.fonts.size?.small || "0.875rem")
            root.style.setProperty("--font-size-base", config.fonts.size?.base || "1rem")
            root.style.setProperty("--font-size-large", config.fonts.size?.large || "1.25rem")
            root.style.setProperty("--font-size-xlarge", config.fonts.size?.xlarge || "2rem")
          }

          // Aplicar espaçamentos
          if (config.spacing) {
            root.style.setProperty("--spacing-section", config.spacing.section || "5rem")
            root.style.setProperty("--spacing-container", config.spacing.container || "1200px")
          }
        }
      } catch (error) {
        console.error("Erro ao aplicar estilos globais:", error)
      }
    }

    // Aplicar na inicialização
    applyGlobalStyles()

    // Escutar mudanças na configuração global
    const handleConfigUpdate = () => {
      applyGlobalStyles()
    }

    window.addEventListener("global-config-updated", handleConfigUpdate)

    return () => {
      window.removeEventListener("global-config-updated", handleConfigUpdate)
    }
  }, [])

  return null
}
