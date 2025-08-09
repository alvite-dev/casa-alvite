'use client'

import { useRouter } from 'next/navigation'
import AgendamentoSection from '@/components/AgendamentoSection'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AgendamentoPage() {
  const router = useRouter()

  const handleVoltar = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header transparent={false} />

      {/* Conteúdo principal */}
      <main className="pt-24">
        {/* Seção de Agendamento */}
        <AgendamentoSection />
      </main>
      
      <Footer />
    </div>
  )
}