"use client"

import { useEffect, useState } from "react"

interface SiteConfig {
  title: string
  description: string
  keywords: string
  author: string
  url: string
  logo: string
  favicon: string
  language: string
  ogImage: string
  twitterCard: string
  googleAnalytics: string
  googleTagManager: string
  facebookPixel: string
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  title: "Landing Page CMS - Sistema de Gerenciamento",
  description:
    "Sistema completo de gerenciamento de conteúdo para landing pages com FAQ, depoimentos, galeria e analytics avançados.",
  keywords: "landing page, cms, gerenciamento, faq, depoimentos, galeria, analytics, leads",
  author: "Sua Empresa",
  url: "https://seusite.com.br",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  language: "pt-BR",
  ogImage: "/og-image.jpg",
  twitterCard: "summary_large_image",
  googleAnalytics: "",
  googleTagManager: "",
  facebookPixel: "",
}

export default function SEOHead() {
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
    // Atualizar title
    document.title = siteConfig.title

    // Atualizar meta tags
    updateMetaTag("description", siteConfig.description)
    updateMetaTag("keywords", siteConfig.keywords)
    updateMetaTag("author", siteConfig.author)
    updateMetaTag("og:title", siteConfig.title)
    updateMetaTag("og:description", siteConfig.description)
    updateMetaTag("og:image", siteConfig.ogImage)
    updateMetaTag("og:url", siteConfig.url)
    updateMetaTag("twitter:card", siteConfig.twitterCard)
    updateMetaTag("twitter:title", siteConfig.title)
    updateMetaTag("twitter:description", siteConfig.description)
    updateMetaTag("twitter:image", siteConfig.ogImage)

    // Atualizar favicon
    updateFavicon(siteConfig.favicon)

    // Adicionar Google Analytics
    if (siteConfig.googleAnalytics) {
      addGoogleAnalytics(siteConfig.googleAnalytics)
    }

    // Adicionar Google Tag Manager
    if (siteConfig.googleTagManager) {
      addGoogleTagManager(siteConfig.googleTagManager)
    }

    // Adicionar Facebook Pixel
    if (siteConfig.facebookPixel) {
      addFacebookPixel(siteConfig.facebookPixel)
    }
  }, [siteConfig])

  const updateMetaTag = (name: string, content: string) => {
    if (typeof document === "undefined") return

    let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement
    if (meta) {
      meta.setAttribute("content", content)
    } else {
      meta = document.createElement("meta")
      if (name.startsWith("og:") || name.startsWith("twitter:")) {
        meta.setAttribute("property", name)
      } else {
        meta.setAttribute("name", name)
      }
      meta.setAttribute("content", content)
      document.head.appendChild(meta)
    }
  }

  const updateFavicon = (href: string) => {
    if (typeof document === "undefined") return

    let favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement
    if (favicon) {
      favicon.setAttribute("href", href)
    } else {
      favicon = document.createElement("link")
      favicon.setAttribute("rel", "icon")
      favicon.setAttribute("href", href)
      document.head.appendChild(favicon)
    }
  }

  const addGoogleAnalytics = (gaId: string) => {
    if (typeof window === "undefined" || document.querySelector(`script[src*="${gaId}"]`)) return

    // Google Analytics 4
    const script1 = document.createElement("script")
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(script1)

    const script2 = document.createElement("script")
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `
    document.head.appendChild(script2)
  }

  const addGoogleTagManager = (gtmId: string) => {
    if (typeof window === "undefined" || document.querySelector(`script[src*="${gtmId}"]`)) return

    // Google Tag Manager
    const script = document.createElement("script")
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    `
    document.head.appendChild(script)

    // NoScript fallback
    const noscript = document.createElement("noscript")
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
    document.body.appendChild(noscript)
  }

  const addFacebookPixel = (pixelId: string) => {
    if (typeof window === "undefined" || document.querySelector(`script[src*="connect.facebook.net"]`)) return

    // Facebook Pixel
    const script = document.createElement("script")
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)

    // NoScript fallback
    const noscript = document.createElement("noscript")
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`
    document.body.appendChild(noscript)
  }

  return null
}
