"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, X, Send, User, Mail, Phone } from "lucide-react"

interface SiteConfig {
  author: string
}

const DEFAULT_CONFIG = {
  author: "Sua Loja de Moda",
}

export default function WhatsAppFloatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    const loadConfig = () => {
      if (typeof window !== "undefined") {
        try {
          const savedConfig = localStorage.getItem("site-config")
          if (savedConfig) {
            const parsed = JSON.parse(savedConfig)
            setConfig({
              author: parsed.author || DEFAULT_CONFIG.author,
            })
          }
        } catch (error) {
          console.error("Erro ao carregar configuração:", error)
        }
      }
    }

    loadConfig()

    const handleConfigUpdate = (event: CustomEvent) => {
      const newConfig = event.detail
      setConfig({
        author: newConfig.author || DEFAULT_CONFIG.author,
      })
    }

    window.addEventListener("site-config-updated", handleConfigUpdate as EventListener)

    return () => {
      window.removeEventListener("site-config-updated", handleConfigUpdate as EventListener)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const message = `Olá! Vim do site da ${config.author}

*Nome:* ${formData.name}
*Email:* ${formData.email}
*Telefone:* ${formData.phone}

*Mensagem:*
${formData.message}`

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")

    setIsOpen(false)
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsOpen(false)} />}

      {/* Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
            size="sm"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        )}

        {/* Modal */}
        {isOpen && (
          <Card className="w-80 md:w-96 shadow-2xl border-0 animate-in slide-in-from-bottom-2 duration-300">
            <CardHeader className="bg-green-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Fale Conosco
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-green-600 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-green-100 text-sm">Entre em contato com a {config.author}</p>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center text-sm font-medium">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    Nome *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Seu nome completo"
                    required
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center text-sm font-medium">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center text-sm font-medium">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="flex items-center text-sm font-medium">
                    <MessageCircle className="w-4 h-4 mr-2 text-gray-500" />
                    Mensagem *
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Como podemos ajudar você?"
                    rows={3}
                    required
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                  />
                </div>

                <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar via WhatsApp
                </Button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Ao enviar, você será redirecionado para o WhatsApp
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
