'use client'

import { useState, useEffect } from 'react'

interface EventModalProps {
  show: boolean
  onClose: () => void
}

export default function EventModal({ show, onClose }: EventModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="relative bg-cream rounded-3xl p-6 sm:p-8 max-w-md w-full mx-4 shadow-2xl">
        
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-cinza/10 hover:bg-cinza/20 rounded-full flex items-center justify-center transition-colors"
        >
          <svg className="w-5 h-5 text-cinza" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Conteúdo do modal */}
        <div className="text-center space-y-6">
          
          {/* Ícone decorativo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-verde/10 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-verde" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>

          {/* Título */}
          <div>
            <h2 className="font-junyper text-3xl sm:text-4xl text-verde font-medium mb-2">
              Novidade!
            </h2>
            <h3 className="font-instrument text-xl sm:text-2xl text-cinza font-semibold">
              Café da Manhã com Cerâmica
            </h3>
          </div>

          {/* Informações do evento */}
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-roxo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-cinza font-instrument">
                <strong>Sábado, 06 de Dezembro</strong>
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-roxo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-cinza font-instrument">
                <strong>9h às 11h</strong>
              </span>
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-roxo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-cinza font-instrument">
                <strong>Vegan Vegan - Botafogo</strong>
              </span>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-cinza font-instrument text-sm leading-relaxed">
            Faça sua cumbuca personalizada enquanto aproveita um delicioso café da manhã liberado!
          </p>

          {/* Preço */}
          <div className="bg-verde/10 rounded-2xl p-4">
            <p className="text-verde font-instrument font-bold text-lg">
              R$ 190 por pessoa
            </p>
            <p className="text-verde/80 font-instrument text-sm">
              Tudo incluso
            </p>
          </div>

          {/* Botões */}
          <div className="space-y-3">
            <a
              href="/cafe-com-ceramica"
              className="block w-full bg-verde hover:bg-verde/90 text-cream font-instrument font-semibold py-3 px-6 rounded-xl transition-all duration-200 uppercase tracking-wide"
              onClick={onClose}
            >
              Ver Detalhes
            </a>
            
            <button
              onClick={onClose}
              className="block w-full bg-transparent border border-cinza/30 hover:bg-cinza/5 text-cinza font-instrument font-medium py-2 px-6 rounded-xl transition-all duration-200"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}