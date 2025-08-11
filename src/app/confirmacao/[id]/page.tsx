'use client'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface BookingData {
  id: string;
  name: string;
  email: string;
  phone: string;
  number_of_people: number;
  total_value: number;
  created_at: string;
  available_slots: {
    date: string;
    start_time: string;
    end_time: string;
    experiences: {
      name: string;
      duration: string;
    };
  };
}

export default function ConfirmacaoPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await fetch(`/api/booking/${params.id}`, {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Reserva não encontrada');
        }
        
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar reserva');
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Data a definir';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return '10:00';
    return timeString.slice(0, 5);
  };

  const formatTimeRange = (startTime: string | null | undefined) => {
    if (!startTime) return '10:00 - 12:00';
    const start = startTime.slice(0, 5);
    const [hours, minutes] = start.split(':').map(Number);
    const endHours = (hours + 2) % 24;
    const end = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return `${start} - ${end}`;
  };

  const formatDuration = (durationInMinutes: string | number) => {
    const minutes = typeof durationInMinutes === 'string' ? parseInt(durationInMinutes) : durationInMinutes;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes} minutos`;
    } else if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      return `${hours}h${remainingMinutes}min`;
    }
  };

  const generateReceipt = async () => {
    if (!booking || !cardRef.current) return;

    try {
      // Importar as bibliotecas dinamicamente para evitar problemas de SSR
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      // Capturar o card como imagem
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Melhor qualidade
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Criar PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calcular dimensões para ajustar no PDF
      const imgWidth = 190; // Largura em mm (A4 = 210mm, menos margens)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Adicionar a imagem ao PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // Adicionar rodapé com informações de contato
      const pageHeight = pdf.internal.pageSize.height;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      
      const footerY = pageHeight - 30;
      pdf.text('CASA ALVITE - Comprovante de Agendamento', 10, footerY);
      pdf.text('Telefone: (11) 95936-2424', 10, footerY + 5);
      pdf.text('Instagram: @casa.alvite', 10, footerY + 10);
      pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 10, footerY + 15);

      // Fazer download do PDF
      pdf.save(`comprovante-agendamento-${booking.id.slice(0, 8)}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o comprovante. Tente novamente.');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde mx-auto mb-4"></div>
          <p className="text-cinza">Carregando confirmação...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 border border-red-300 text-red-700 px-6 py-4 rounded-lg mb-6">
            <h2 className="font-semibold mb-2">Erro</h2>
            <p>{error || 'Reserva não encontrada'}</p>
          </div>
          <button
            onClick={() => router.push('/agendamento')}
            className="bg-verde text-cream px-6 py-3 rounded-md hover:bg-verde/90 transition-colors"
          >
            Voltar ao Agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-cream py-12">
      <div className="container mx-auto px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-verde rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="font-instrument-serif italic text-4xl sm:text-5xl text-cinza font-normal mb-4">
            Reserva Confirmada!
          </h1>
          
          <p className="text-lg text-cinza/80 max-w-2xl mx-auto leading-relaxed">
            Sua experiência na Casa Alvite foi agendada com sucesso. 
            Nossa equipe entrará em contato em breve com mais informações sobre pagamento e detalhes da experiência.
          </p>
        </div>

        {/* Card de Confirmação */}
        <div ref={cardRef} className="bg-white rounded-2xl shadow-lg border border-cinza/10 overflow-hidden mb-8">
          <div className="bg-verde px-8 py-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-cream flex items-center gap-3">
              <span className="w-2 h-2 bg-amarelo rounded-full"></span>
              Detalhes da sua Reserva
            </h2>
            <button
              onClick={generateReceipt}
              className="flex items-center gap-2 bg-amarelo text-cream px-4 py-2 rounded-md hover:bg-amarelo/90 transition-colors font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Baixar PDF
            </button>
          </div>
          
          <div className="px-8 py-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Informações da Experiência */}
              <div>
                <h3 className="text-lg font-medium text-cinza mb-6 border-b border-cinza/20 pb-2">
                  Experiência
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-cinza/60 mb-1">Nome</p>
                    <p className="text-base font-medium text-cinza">
                      {booking.available_slots.experiences.name}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-cinza/60 mb-1">Duração</p>
                    <p className="text-base text-cinza">
                      {formatDuration(booking.available_slots.experiences.duration)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-cinza/60 mb-1">Data</p>
                    <p className="text-base font-medium text-cinza">
                      {formatDate(booking.available_slots.date)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-cinza/60 mb-1">Horário</p>
                    <p className="text-base font-medium text-cinza">
                      {formatTimeRange(booking.available_slots.start_time)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-cinza/60 mb-1">Pessoas</p>
                    <p className="text-base font-medium text-cinza">
                      {booking.number_of_people} {booking.number_of_people === 1 ? 'pessoa' : 'pessoas'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Informações do Cliente */}
              <div>
                <h3 className="text-lg font-medium text-cinza mb-6 border-b border-cinza/20 pb-2">
                  Seus Dados
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-cinza/60 mb-1">Nome</p>
                    <p className="text-base font-medium text-cinza">{booking.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-cinza/60 mb-1">E-mail</p>
                    <p className="text-base text-cinza">{booking.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-cinza/60 mb-1">Telefone</p>
                    <p className="text-base text-cinza">{booking.phone}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-cinza/20">
                    <p className="text-sm text-cinza/60 mb-1">Valor Total</p>
                    <p className="text-2xl font-semibold text-verde">
                      R$ {booking.total_value.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informações Importantes */}
        <div className="bg-amarelo/10 border border-amarelo/30 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-cinza mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Próximos Passos
          </h3>
          
          <div className="space-y-3 text-cinza">
            <p className="flex items-start gap-2">
              <span className="text-verde mt-1">✓</span>
              <span>Nossa equipe entrará em contato por WhatsApp ou telefone nas próximas horas</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-verde mt-1">✓</span>
              <span>Você receberá instruções sobre pagamento e localização</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-verde mt-1">✓</span>
              <span>Recomendamos chegar 10 minutos antes do horário marcado</span>
            </p>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="bg-cream/50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-cinza mb-4">
            Precisa de Ajuda?
          </h3>
          
          <p className="text-cinza mb-4">
            Entre em contato conosco através dos canais abaixo:
          </p>
          
          <div className="space-y-3 text-cinza">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-verde flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>(11) 95936-2424</span>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-verde flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@casa.alvite</span>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-verde flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Localização será enviada via WhatsApp</span>
            </div>
          </div>
        </div>


        {/* Botões de Ação */}
        <div className="text-center space-y-4">
          <button
            onClick={() => router.push('/')}
            className="bg-cinza text-cream px-8 py-3 rounded-md hover:bg-cinza/90 transition-colors font-medium"
          >
            Voltar ao Início
          </button>
          
          <p className="text-sm text-cinza/60">
            ID da Reserva: {booking.id}
          </p>
        </div>
      </div>
    </section>
  );
}