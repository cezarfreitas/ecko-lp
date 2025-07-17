import { Store, Package, Headphones, Globe } from "lucide-react"

export default function RevendaSection() {
  const beneficios = [
    {
      icon: Globe,
      titulo: "MARCA INTERNACIONAL",
      descricao:
        "A Ecko é uma marca reconhecida mundialmente, com forte presença no Brasil e grande apelo junto ao público jovem.",
    },
    {
      icon: Package,
      titulo: "PRONTA ENTREGA",
      descricao:
        "Mais de 100.000 produtos prontos para entrega, com excelentes margens de lucro e rápido giro de estoque.",
    },
    {
      icon: Headphones,
      titulo: "SUPORTE AO LOJISTA",
      descricao: "Equipe de especialistas sempre à disposição para garantir a melhor experiência na compra e venda.",
    },
    {
      icon: Store,
      titulo: "TOTALMENTE ONLINE",
      descricao:
        "Plataforma exclusiva com preços de atacado para lojistas de todo o Brasil, facilitando compra e reabastecimento.",
    },
  ]

  return (
    <section className="py-10 md:py-12 lg:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 px-4">
            Revenda Ecko: Seja um Lojista Autorizado
          </h2>
          <div className="w-16 md:w-20 h-1 bg-red-600 mx-auto mb-3 md:mb-4"></div>
          <p className="text-lg md:text-xl lg:text-2xl font-semibold text-red-600 mb-2 md:mb-3">
            Multiplique Suas Vendas!
          </p>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Venda uma das marcas mais desejadas do streetwear e aumente seus lucros!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          {beneficios.map((item, index) => {
            const IconComponent = item.icon
            return (
              <div
                key={index}
                className="group bg-white p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-red-100"
              >
                {/* Icon container */}
                <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-4 md:mb-6 rounded-lg bg-gray-100 group-hover:bg-red-50 flex items-center justify-center transition-colors duration-300">
                  <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-gray-600 group-hover:text-red-600 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-red-600 transition-colors duration-300">
                    {item.titulo}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-xs md:text-sm">{item.descricao}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center px-4">
          <p className="text-gray-600 mb-6 text-base md:text-lg">Pronto para fazer parte da família Ecko?</p>
          <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold px-8 md:px-10 py-3 md:py-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] touch-manipulation">
            Quero Ser um Lojista Autorizado
          </button>
        </div>
      </div>
    </section>
  )
}
