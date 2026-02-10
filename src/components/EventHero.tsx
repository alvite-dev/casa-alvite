'use client'

export default function EventHero() {
  const scrollToMainHero = () => {
    const heroSection = document.getElementById('hero-section')
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const symplaUrl = 'https://www.sympla.com.br/evento/tapas-com-ceramica-alvite-na-casa-mila/3304407?utm_source=casaalvite&utm_campaign=tapas-ceramica&utm_medium=site'

  return (
    <main id="hero-event-section" className="relative h-screen w-full overflow-hidden">
      {/* Imagem de fundo do evento */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-terracotta"
        style={{ backgroundImage: "url('/images/event-tapas.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Conteúdo centralizado */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 pt-20 sm:pt-24">
        <div className="text-center space-y-8 sm:space-y-10 lg:space-y-12 max-w-4xl w-full">

          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-block bg-terracotta/90 text-cream font-instrument font-semibold text-xs sm:text-sm uppercase tracking-widest px-5 py-2 rounded-full">
              Novo Evento
            </span>
          </div>

          {/* Título */}
          <h1 className="text-cream font-junyper text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-wide leading-tight">
            Tapas com<br />
            Cerâmica
          </h1>

          {/* Data e Local */}
          <p className="text-cream/90 font-instrument text-lg sm:text-xl lg:text-2xl leading-relaxed">
            Domingo, 01 de Março &bull; Casa Mila, Laranjeiras
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center w-full sm:w-auto">
            <a
              href={symplaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-verde hover:bg-verde/90 text-cream font-instrument font-semibold text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center"
            >
              COMPRAR INGRESSO
            </a>

            <button
              onClick={scrollToMainHero}
              className="w-full sm:w-auto bg-transparent border-2 border-cream/60 hover:bg-cream/10 text-cream font-instrument font-semibold text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center"
              type="button"
            >
              VER EXPERIÊNCIAS REGULARES
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
