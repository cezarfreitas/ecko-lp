"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FAQ {
  id: string
  pergunta: string
  resposta: string
  categoria: string
  ordem: number
  ativo: boolean
}

const DEFAULT_FAQS: FAQ[] = [
  {
    id: "1",
    pergunta: "Como funciona o processo de compra?",
    resposta:
      "Nosso processo de compra é simples e seguro. Você escolhe os produtos, adiciona ao carrinho, preenche seus dados e finaliza o pagamento. Enviamos tudo com segurança para sua casa.",
    categoria: "Compras",
    ordem: 1,
    ativo: true,
  },
  {
    id: "2",
    pergunta: "Quais são as formas de pagamento aceitas?",
    resposta:
      "Aceitamos cartão de crédito (Visa, Mastercard, Elo), cartão de débito, PIX, boleto bancário e parcelamento em até 12x sem juros.",
    categoria: "Pagamento",
    ordem: 2,
    ativo: true,
  },
  {
    id: "3",
    pergunta: "Qual o prazo de entrega?",
    resposta:
      "O prazo de entrega varia conforme sua região. Para São Paulo capital: 1-2 dias úteis. Demais regiões: 3-7 dias úteis. Você recebe o código de rastreamento por email.",
    categoria: "Entrega",
    ordem: 3,
    ativo: true,
  },
  {
    id: "4",
    pergunta: "Posso trocar ou devolver um produto?",
    resposta:
      "Sim! Você tem até 30 dias para trocar ou devolver qualquer produto. O item deve estar em perfeitas condições, com etiquetas e embalagem original.",
    categoria: "Trocas",
    ordem: 4,
    ativo: true,
  },
  {
    id: "5",
    pergunta: "Como faço para acompanhar meu pedido?",
    resposta:
      "Após a confirmação do pagamento, você recebe um email com o código de rastreamento. Também pode acompanhar pelo nosso site na seção 'Meus Pedidos'.",
    categoria: "Pedidos",
    ordem: 5,
    ativo: true,
  },
]

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>(DEFAULT_FAQS)
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas")

  useEffect(() => {
    const loadFAQs = () => {
      try {
        const savedData = localStorage.getItem("faq-data")
        if (savedData) {
          const data = JSON.parse(savedData)
          if (data.faqs && Array.isArray(data.faqs)) {
            setFaqs(data.faqs.filter((faq: FAQ) => faq.ativo))
          }
        }
      } catch (error) {
        console.error("Erro ao carregar FAQs:", error)
      }
    }

    loadFAQs()

    // Escutar mudanças nos FAQs
    const handleFAQUpdate = (event: CustomEvent) => {
      if (event.detail.faqs && Array.isArray(event.detail.faqs)) {
        setFaqs(event.detail.faqs.filter((faq: FAQ) => faq.ativo))
      }
    }

    window.addEventListener("faq-updated", handleFAQUpdate as EventListener)

    return () => {
      window.removeEventListener("faq-updated", handleFAQUpdate as EventListener)
    }
  }, [])

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const categories = ["Todas", ...Array.from(new Set(faqs.map((faq) => faq.categoria)))]

  const filteredFAQs = faqs
    .filter((faq) => selectedCategory === "Todas" || faq.categoria === selectedCategory)
    .sort((a, b) => a.ordem - b.ordem)

  if (faqs.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços
          </p>
        </div>

        {/* Filtro por Categoria */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category ? "bg-red-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Lista de FAQs */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.pergunta}</span>
                {openItems.has(faq.id) ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openItems.has(faq.id) && (
                <div className="px-6 pb-4">
                  <div className="text-gray-600 leading-relaxed">{faq.resposta}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma pergunta encontrada para esta categoria.</p>
          </div>
        )}
      </div>
    </section>
  )
}
