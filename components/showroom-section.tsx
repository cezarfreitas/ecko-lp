export default function ShowroomSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Visite Nosso Showroom</h2>
          <div className="w-16 md:w-20 h-1 bg-red-600 mx-auto mb-4 md:mb-6"></div>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 px-4">
            Conheça nossa loja física e experimente nossas peças
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 md:space-y-6 order-2 md:order-1">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Uma Experiência Única</h3>
              <p className="text-gray-700 leading-relaxed mb-3 md:mb-4 text-sm md:text-base">
                Nosso showroom foi cuidadosamente projetado para oferecer uma experiência de compra única e
                personalizada. Aqui você pode tocar, experimentar e sentir a qualidade de cada peça da nossa coleção.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Nossa equipe especializada está sempre pronta para ajudar você a encontrar o look perfeito, oferecendo
                consultoria de estilo personalizada e um atendimento diferenciado.
              </p>
            </div>

            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm md:text-base">Atendimento personalizado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm md:text-base">Consultoria de estilo gratuita</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm md:text-base">Ambiente aconchegante e moderno</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                <span className="text-gray-700 text-sm md:text-base">Peças exclusivas disponíveis</span>
              </div>
            </div>

            <div className="pt-2 md:pt-4">
              <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-medium px-6 md:px-8 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] touch-manipulation">
                Agendar Visita
              </button>
            </div>
          </div>

          <div className="relative order-1 md:order-2">
            <div className="relative overflow-hidden rounded-lg shadow-xl">
              <img
                src="/modern-fashion-showroom.png"
                alt="Interior do nosso showroom moderno"
                className="w-full h-[300px] md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
