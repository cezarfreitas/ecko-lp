export default function EmpresaSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">A Empresa</h2>
          <div className="w-16 md:w-20 h-1 bg-red-600 mx-auto mb-6 md:mb-8"></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 space-y-4 md:space-y-6">
            <p>
              Somos uma empresa especializada em soluções digitais inovadoras, com mais de 10 anos de experiência no
              mercado. Nossa missão é transformar ideias em realidade através da tecnologia, oferecendo serviços de alta
              qualidade que impulsionam o crescimento dos nossos clientes.
            </p>

            <p>
              Com uma equipe multidisciplinar de profissionais altamente qualificados, desenvolvemos projetos
              personalizados que atendem às necessidades específicas de cada cliente. Desde startups até grandes
              corporações, nossa abordagem é sempre focada na excelência e na inovação.
            </p>

            <p>
              Nossos valores fundamentais incluem transparência, qualidade, agilidade e compromisso com resultados.
              Acreditamos que o sucesso dos nossos clientes é o nosso próprio sucesso, por isso trabalhamos como
              verdadeiros parceiros em cada projeto.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
