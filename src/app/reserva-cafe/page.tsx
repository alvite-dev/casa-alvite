'use client'

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ParticipantData {
  name: string;
}

export default function ReservaCafePage() {
  const router = useRouter();
  const participantesRef = useRef<HTMLDivElement>(null);
  const informacoesRef = useRef<HTMLDivElement>(null);
  
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [participants, setParticipants] = useState<ParticipantData[]>([{ name: '' }]);
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: ''
  });
  const [activeAccordion, setActiveAccordion] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  // Função para fazer scroll considerando o offset do header
  const scrollToElementWithOffset = (element: HTMLElement, customOffset?: number) => {
    const getResponsiveOffset = () => {
      if (customOffset) return customOffset;
      if (window.innerWidth < 640) return 90;
      if (window.innerWidth < 1024) return 110;
      return 120;
    };
    
    const offsetTop = getResponsiveOffset();
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const scrollPosition = elementPosition - offsetTop;
    
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  };

  const handlePeopleChange = (count: number) => {
    setNumberOfPeople(count);
    
    // Atualizar array de participantes
    const newParticipants = Array.from({ length: count }, (_, index) => 
      participants[index] || { name: '' }
    );
    setParticipants(newParticipants);
  };

  const handleParticipantChange = (index: number, field: string, value: string) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index] = { ...updatedParticipants[index], [field]: value };
    setParticipants(updatedParticipants);
  };

  const handleContactInfoChange = (field: string, value: string) => {
    setContactInfo(prev => ({ ...prev, [field]: value }));
  };

  const toggleAccordion = (stepNumber: number) => {
    setActiveAccordion(activeAccordion === stepNumber ? 0 : stepNumber);
  };

  const canAccessStep = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return completedSteps.includes(1);
    if (stepNumber === 3) return completedSteps.includes(2);
    return false;
  };

  const handleContinueStep1 = () => {
    if (numberOfPeople >= 1) {
      if (!completedSteps.includes(1)) {
        setCompletedSteps(prev => [...prev, 1]);
      }
      setActiveAccordion(2);
      
      setTimeout(() => {
        if (participantesRef.current) {
          scrollToElementWithOffset(participantesRef.current);
        }
      }, 300);
    }
  };

  const handleContinueStep2 = () => {
    const allNamesProvided = participants.every(participant => participant.name.trim() !== '');
    
    if (allNamesProvided) {
      if (!completedSteps.includes(2)) {
        setCompletedSteps(prev => [...prev, 2]);
      }
      setActiveAccordion(3);
      
      setTimeout(() => {
        if (informacoesRef.current) {
          scrollToElementWithOffset(informacoesRef.current);
        }
      }, 300);
    }
  };

  const handleContinueStep3 = () => {
    if (contactInfo.phone && contactInfo.email) {
      if (!completedSteps.includes(3)) {
        setCompletedSteps(prev => [...prev, 3]);
      }
      setActiveAccordion(0);
    }
  };

  const allStepsCompleted = completedSteps.includes(1) && completedSteps.includes(2) && completedSteps.includes(3);

  const handleEventBooking = async () => {
    if (!allStepsCompleted) return;
    
    setBookingLoading(true);
    setBookingMessage(null);
    
    try {
      const bookingData = {
        numberOfPeople,
        participants: participants.map(p => ({ name: p.name.trim() })),
        phone: contactInfo.phone.trim(),
        email: contactInfo.email.toLowerCase().trim(),
        eventName: 'cafe-com-ceramica',
        eventDate: '2025-12-06',
        eventTime: '9h às 11h'
      };
      
      const response = await fetch('/api/event-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Erro ao processar reserva');
      }
      
      // Redirecionar para MercadoPago
      window.location.href = result.mercadoPagoLink;
      
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      setBookingMessage(`❌ ${error instanceof Error ? error.message : 'Erro ao processar reserva. Tente novamente.'}`);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header transparent={false} />

      <main className="pt-24">
        <section className="pb-12 bg-cream min-h-screen">
          <div className="container mx-auto px-8">

            {/* Header com título */}
            <div className="mb-16">
              <div className="max-w-2xl">
                <h1 className="font-instrument-serif italic text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-6">
                  Café com Cerâmica
                </h1>
              </div>
            </div>

            <div className="max-w-5xl">
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Área Principal - Accordion de Reserva */}
                <div className="flex-1 lg:max-w-2xl">
                  <div className="space-y-4">
                    
                    {/* Accordion 1: Quantidade de Pessoas */}
                    <div className="border border-cinza bg-cream/20 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleAccordion(1)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between bg-cream/30 hover:bg-cream/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {completedSteps.includes(1) ? (
                            <div className="w-6 h-6 bg-verde rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 bg-cream border border-cinza/40 rounded-full flex items-center justify-center text-cinza text-sm font-semibold">
                              1
                            </div>
                          )}
                          <span className="text-lg font-medium text-cinza">Quantidade de Pessoas</span>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-cinza/60 transition-transform duration-200 ${
                            activeAccordion === 1 ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {activeAccordion === 1 && (
                        <div className="px-6 py-6 border-t border-cinza/20 accordion-content">
                          <h4 className="text-base font-medium text-cinza mb-4">
                            Quantas Pessoas?
                          </h4>
                          
                          <div className="flex items-center gap-4">
                            <label htmlFor="numberOfPeople" className="text-sm text-gray-600">
                              Pessoas:
                            </label>
                            <select
                              id="numberOfPeople"
                              value={numberOfPeople}
                              onChange={(e) => handlePeopleChange(Number(e.target.value))}
                              className="px-3 py-2 border border-gray-300 bg-cream/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde text-cinza font-medium"
                            >
                              <option value={1}>1 pessoa</option>
                              <option value={2}>2 pessoas</option>
                              <option value={3}>3 pessoas</option>
                              <option value={4}>4 pessoas</option>
                              <option value={5}>5 pessoas</option>
                            </select>
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-cinza/20">
                            <button
                              onClick={handleContinueStep1}
                              className="w-full py-3 px-4 bg-verde text-cream font-medium rounded-md hover:bg-verde/90 transition-colors text-sm"
                            >
                              Continuar para Participantes
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Accordion 2: Dados dos Participantes */}
                    <div ref={participantesRef} className={`border rounded-xl overflow-hidden ${
                      canAccessStep(2) ? 'border-cinza bg-cream/20' : 'border-cinza/50 bg-cream/10'
                    }`}>
                      <button
                        onClick={() => canAccessStep(2) && toggleAccordion(2)}
                        className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${
                          canAccessStep(2) 
                            ? 'bg-cream/30 hover:bg-cream/50 cursor-pointer' 
                            : 'bg-cream/15 cursor-not-allowed opacity-60'
                        }`}
                        disabled={!canAccessStep(2)}
                      >
                        <div className="flex items-center gap-3">
                          {completedSteps.includes(2) ? (
                            <div className="w-6 h-6 bg-verde rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm font-semibold ${
                              canAccessStep(2) 
                                ? 'bg-cream border-cinza/40 text-cinza' 
                                : 'bg-cream/50 border-cinza/20 text-cinza/40'
                            }`}>
                              2
                            </div>
                          )}
                          <span className={`text-lg font-medium ${canAccessStep(2) ? 'text-cinza' : 'text-cinza/40'}`}>
                            Dados dos Participantes
                          </span>
                        </div>
                        {canAccessStep(2) && (
                          <svg 
                            className={`w-5 h-5 text-cinza/60 transition-transform duration-200 ${
                              activeAccordion === 2 ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                      
                      {activeAccordion === 2 && canAccessStep(2) && (
                        <div className="px-6 py-6 border-t border-cinza/20 accordion-content">
                          <h4 className="text-base font-medium text-cinza mb-4">
                            Nome dos Participantes
                          </h4>
                          
                          <div className="space-y-4">
                            {participants.map((participant, index) => (
                              <div key={index}>
                                <label htmlFor={`participant-${index}`} className="block text-sm font-medium text-cinza mb-1">
                                  {numberOfPeople === 1 ? 'Seu Nome' : `Participante ${index + 1}`}*
                                </label>
                                <input
                                  type="text"
                                  id={`participant-${index}`}
                                  value={participant.name}
                                  onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border border-cinza/30 bg-cream/30 rounded-md focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde text-cinza placeholder-cinza/60"
                                  placeholder="Digite o nome completo"
                                  required
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-cinza/20">
                            <button
                              onClick={handleContinueStep2}
                              disabled={!participants.every(p => p.name.trim() !== '')}
                              className={`w-full py-3 px-4 font-medium rounded-md transition-colors text-sm ${
                                participants.every(p => p.name.trim() !== '')
                                  ? 'bg-verde text-cream hover:bg-verde/90'
                                  : 'bg-cream/50 text-cinza/40 cursor-not-allowed border border-cinza/30'
                              }`}
                            >
                              Continuar para Contato
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Accordion 3: Informações de Contato */}
                    <div ref={informacoesRef} className={`border rounded-xl overflow-hidden ${
                      canAccessStep(3) ? 'border-cinza bg-cream/20' : 'border-cinza/50 bg-cream/10'
                    }`}>
                      <button
                        onClick={() => canAccessStep(3) && toggleAccordion(3)}
                        className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${
                          canAccessStep(3) 
                            ? 'bg-cream/30 hover:bg-cream/50 cursor-pointer' 
                            : 'bg-cream/15 cursor-not-allowed opacity-60'
                        }`}
                        disabled={!canAccessStep(3)}
                      >
                        <div className="flex items-center gap-3">
                          {completedSteps.includes(3) ? (
                            <div className="w-6 h-6 bg-verde rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm font-semibold ${
                              canAccessStep(3) 
                                ? 'bg-cream border-cinza/40 text-cinza' 
                                : 'bg-cream/50 border-cinza/20 text-cinza/40'
                            }`}>
                              3
                            </div>
                          )}
                          <span className={`text-lg font-medium ${canAccessStep(3) ? 'text-cinza' : 'text-cinza/40'}`}>
                            Informações de Contato
                          </span>
                        </div>
                        {canAccessStep(3) && (
                          <svg 
                            className={`w-5 h-5 text-cinza/60 transition-transform duration-200 ${
                              activeAccordion === 3 ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </button>
                      
                      {activeAccordion === 3 && canAccessStep(3) && (
                        <div className="px-6 py-6 border-t border-cinza/20 accordion-content">
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-cinza mb-1">
                                WhatsApp para Contato*
                              </label>
                              <input
                                type="tel"
                                id="phone"
                                value={contactInfo.phone}
                                onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                                className="w-full px-3 py-2 border border-cinza/30 bg-cream/30 rounded-md focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde text-cinza placeholder-cinza/60"
                                placeholder="(21) 99999-9999"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="email" className="block text-sm font-medium text-cinza mb-1">
                                E-mail*
                              </label>
                              <input
                                type="email"
                                id="email"
                                value={contactInfo.email}
                                onChange={(e) => handleContactInfoChange('email', e.target.value)}
                                className="w-full px-3 py-2 border border-cinza/30 bg-cream/30 rounded-md focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde text-cinza placeholder-cinza/60"
                                placeholder="seu@email.com"
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-cinza/20">
                            <button
                              onClick={handleContinueStep3}
                              disabled={!contactInfo.phone || !contactInfo.email}
                              className={`w-full py-3 px-4 font-medium rounded-md transition-colors text-sm ${
                                contactInfo.phone && contactInfo.email
                                  ? 'bg-verde text-cream hover:bg-verde/90'
                                  : 'bg-cream/50 text-cinza/40 cursor-not-allowed border border-cinza/30'
                              }`}
                            >
                              Verificar Informações
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card de Resumo - Desktop */}
                <div className="hidden lg:block">
                  <div className="sticky top-32 w-80 space-y-4">
                    <div className="bg-verde border border-verde rounded-2xl p-6 backdrop-blur-sm shadow-lg">
                      <h3 className="text-lg font-medium text-cream mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-amarelo rounded-full"></span>
                        Resumo da Reserva
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Evento */}
                        <div className="pb-3 border-b border-cream/30">
                          <p className="text-sm text-cream/70 mb-1">Evento</p>
                          <p className="text-base font-medium text-cream">Café da Manhã com Cerâmica</p>
                          <p className="text-xs text-cream/60 mt-1">Sábado, 06/12 • 9h às 11h</p>
                        </div>

                        {/* Quantidade de Pessoas */}
                        {completedSteps.includes(1) && (
                          <div className="pb-3 border-b border-cream/30">
                            <p className="text-sm text-cream/70 mb-1">Pessoas</p>
                            <p className="text-base font-medium text-cream">
                              {numberOfPeople} {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}
                            </p>
                          </div>
                        )}

                        {/* Participantes */}
                        {completedSteps.includes(2) && (
                          <div className="pb-3 border-b border-cream/30">
                            <p className="text-sm text-cream/70 mb-1">Participantes</p>
                            <div className="space-y-1">
                              {participants.map((participant, index) => (
                                <p key={index} className="text-sm text-cream">
                                  {participant.name}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contato */}
                        {completedSteps.includes(3) && (
                          <div className="pb-3 border-b border-cream/30">
                            <p className="text-sm text-cream/70 mb-1">Contato</p>
                            <p className="text-xs text-cream/60">{contactInfo.phone}</p>
                            <p className="text-xs text-cream/60">{contactInfo.email}</p>
                          </div>
                        )}

                        {/* Valor */}
                        <div className="pb-3 border-b border-cream/30">
                          <p className="text-sm text-cream/70 mb-1">Valor Total</p>
                          {completedSteps.includes(1) ? (
                            <>
                              <p className="text-xl font-semibold text-cream">R$ {(190 * numberOfPeople).toLocaleString('pt-BR')}</p>
                              <p className="text-xs text-cream/60">
                                R$ 190 × {numberOfPeople} {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-xl font-semibold text-cream">R$ 190</p>
                              <p className="text-xs text-cream/60">por pessoa</p>
                            </>
                          )}
                        </div>

                        {/* Mensagem de Status */}
                        {bookingMessage && (
                          <div className={`p-3 rounded-md text-sm font-medium ${
                            bookingMessage.includes('✅') 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {bookingMessage}
                          </div>
                        )}

                        {/* Botão de Confirmação */}
                        {allStepsCompleted && (
                          <div className="pt-2">
                            <button
                              onClick={handleEventBooking}
                              disabled={bookingLoading}
                              className={`w-full py-3 px-6 rounded-md font-medium transition-colors text-sm shadow-sm ${
                                bookingLoading 
                                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                  : 'bg-amarelo text-cream hover:bg-amarelo/90'
                              }`}
                            >
                              {bookingLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cream"></div>
                                  Processando...
                                </div>
                              ) : (
                                'Prosseguir para Pagamento'
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card de Resumo - Mobile */}
              <div className="lg:hidden mt-12 space-y-4">
                <div className="bg-verde border border-verde rounded-2xl p-6 backdrop-blur-sm shadow-lg">
                  <h3 className="text-lg font-medium text-cream mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amarelo rounded-full"></span>
                    Resumo da Reserva
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Evento */}
                    <div className="pb-3 border-b border-cream/50">
                      <p className="text-sm text-cream/70 mb-1">Evento</p>
                      <p className="text-base font-medium text-cream">Café da Manhã com Cerâmica</p>
                      <p className="text-xs text-cream/60 mt-1">Sábado, 06/12 • 9h às 11h</p>
                    </div>

                    {/* Quantidade de Pessoas */}
                    {completedSteps.includes(1) && (
                      <div className="pb-3 border-b border-cream/50">
                        <p className="text-sm text-cream/70 mb-1">Pessoas</p>
                        <p className="text-base font-medium text-cream">
                          {numberOfPeople} {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}
                        </p>
                      </div>
                    )}

                    {/* Participantes */}
                    {completedSteps.includes(2) && (
                      <div className="pb-3 border-b border-cream/50">
                        <p className="text-sm text-cream/70 mb-1">Participantes</p>
                        <div className="space-y-1">
                          {participants.map((participant, index) => (
                            <p key={index} className="text-sm text-cream">
                              {participant.name}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contato */}
                    {completedSteps.includes(3) && (
                      <div className="pb-3 border-b border-cream/50">
                        <p className="text-sm text-cream/70 mb-1">Contato</p>
                        <p className="text-xs text-cream/60">{contactInfo.phone}</p>
                        <p className="text-xs text-cream/60">{contactInfo.email}</p>
                      </div>
                    )}

                    {/* Valor */}
                    <div className="pb-3 border-b border-cream/50">
                      <p className="text-sm text-cream/70 mb-1">Valor Total</p>
                      {completedSteps.includes(1) ? (
                        <>
                          <p className="text-xl font-semibold text-cream">R$ {(190 * numberOfPeople).toLocaleString('pt-BR')}</p>
                          <p className="text-xs text-cream/60">
                            R$ 190 × {numberOfPeople} {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xl font-semibold text-cream">R$ 190</p>
                          <p className="text-xs text-cream/60">por pessoa</p>
                        </>
                      )}
                    </div>

                    {/* Mensagem de Status */}
                    {bookingMessage && (
                      <div className={`p-3 rounded-md text-sm font-medium ${
                        bookingMessage.includes('✅') 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {bookingMessage}
                      </div>
                    )}

                    {/* Botão de Confirmação */}
                    {allStepsCompleted && (
                      <div className="pt-2">
                        <button
                          onClick={handleEventBooking}
                          disabled={bookingLoading}
                          className={`w-full py-3 px-6 rounded-md font-medium transition-colors text-sm shadow-sm ${
                            bookingLoading 
                              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                              : 'bg-amarelo text-cream hover:bg-amarelo/90'
                          }`}
                        >
                          {bookingLoading ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cream"></div>
                              Processando...
                            </div>
                          ) : (
                            'Prosseguir para Pagamento'
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />

      <style jsx global>{`
        /* Estilos para acordeão */
        .accordion-content {
          animation: accordionOpen 0.3s ease-out;
        }
        
        @keyframes accordionOpen {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}