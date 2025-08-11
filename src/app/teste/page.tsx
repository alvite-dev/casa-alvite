'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface AvailableSlot {
  id: number;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_available: boolean;
  max_capacity: number | null;
  current_bookings: number | null;
  created_at: string;
  updated_at: string;
}

export default function TestePage() {
  const [data, setData] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string>('Testando...')

  useEffect(() => {
    async function testSupabaseConnection() {
      try {
        setLoading(true)
        setConnectionStatus('Conectando ao Supabase...')
        
        console.log('Iniciando teste de conexão com Supabase')
        
        // Primeiro testa a conexão básica
        const testResponse = await fetch('/api/test-supabase')
        console.log('Resposta do teste:', testResponse.status, testResponse.statusText)
        
        if (!testResponse.ok) {
          const testError = await testResponse.json()
          console.error('Erro no teste básico:', testError)
          throw new Error(`Teste básico falhou: ${testError.error}`)
        }
        
        const testResult = await testResponse.json()
        console.log('Teste básico passou:', testResult)
        
        // Agora tenta buscar os dados
        const response = await fetch('/api/available-slots')
        console.log('Resposta da API de dados:', response.status, response.statusText)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Erro na resposta:', errorText)
          throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        console.log('Dados recebidos:', result)
        
        if (Array.isArray(result)) {
          setData(result)
          setConnectionStatus(`✅ Conectado! ${result.length} registros encontrados`)
        } else {
          setData([])
          setConnectionStatus('✅ Conectado! Nenhum registro encontrado')
        }
        
      } catch (err) {
        console.error('Erro completo:', err)
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
        setError(errorMessage)
        setConnectionStatus(`❌ Erro: ${errorMessage}`)
      } finally {
        setLoading(false)
      }
    }

    testSupabaseConnection()
  }, [])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
      return dateString
    }
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return 'N/A'
    return timeString.slice(0, 5)
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header simples */}
      <header className="bg-verde py-6 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              src="/images/logo/logo.svg"
              alt="Casa Alvite Logo"
              width={48}
              height={48}
              className="w-full h-full"
              priority
            />
          </div>
          <div>
            <h1 className="text-cream font-instrument-serif text-2xl font-bold">
              Teste de Conexão - Supabase
            </h1>
            <p className="text-cream/80 font-instrument text-sm">
              Verificando conexão com o banco de dados
            </p>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Status da conexão */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-verde font-instrument font-semibold text-xl mb-4">
            📡 Status da Conexão
          </h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-instrument text-lg">
              {connectionStatus}
            </p>
            {loading && (
              <div className="mt-3 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-verde"></div>
                <span className="text-sm text-gray-600">Carregando...</span>
              </div>
            )}
          </div>
        </div>

        {/* Informações técnicas */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <h2 className="text-verde font-instrument font-semibold text-xl mb-4">
            🔧 Informações Técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-instrument">
            <div className="bg-gray-50 rounded-lg p-3">
              <strong>Teste Básico:</strong> /api/test-supabase
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <strong>Endpoint Principal:</strong> /api/available-slots
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <strong>Tabela:</strong> available_slots
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <strong>Ambiente:</strong> {' '}
              {typeof window !== 'undefined' ? 'Cliente' : 'Servidor'}
            </div>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8 rounded-lg">
            <h3 className="text-red-800 font-instrument font-semibold text-lg mb-2">
              ❌ Erro de Conexão
            </h3>
            <p className="text-red-700 font-instrument mb-3">
              {error}
            </p>
            <div className="bg-red-100 rounded p-3">
              <p className="text-red-600 text-sm font-instrument">
                <strong>Possíveis soluções:</strong>
              </p>
              <ul className="text-red-600 text-sm font-instrument mt-1 ml-4">
                <li>• Verificar se as variáveis de ambiente estão configuradas</li>
                <li>• Verificar se o projeto Supabase está ativo</li>
                <li>• Verificar se a tabela 'available_slots' existe</li>
                <li>• Verificar as permissões RLS (Row Level Security)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tabela de dados */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-verde font-instrument font-semibold text-xl mb-4">
            📊 Dados da Tabela available_slots
          </h2>
          
          {!loading && !error && data.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-500 font-instrument">
                Nenhum dado encontrado na tabela
              </p>
              <p className="text-gray-400 text-sm font-instrument mt-2">
                A conexão funcionou, mas a tabela está vazia
              </p>
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-verde text-cream">
                    <th className="border border-verde/20 px-3 py-2 text-left font-instrument text-sm">ID</th>
                    <th className="border border-verde/20 px-3 py-2 text-left font-instrument text-sm">Data</th>
                    <th className="border border-verde/20 px-3 py-2 text-left font-instrument text-sm">Início</th>
                    <th className="border border-verde/20 px-3 py-2 text-left font-instrument text-sm">Fim</th>
                    <th className="border border-verde/20 px-3 py-2 text-center font-instrument text-sm">Disponível</th>
                    <th className="border border-verde/20 px-3 py-2 text-center font-instrument text-sm">Capacidade</th>
                    <th className="border border-verde/20 px-3 py-2 text-center font-instrument text-sm">Reservas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((slot) => (
                    <tr key={slot.id} className={`hover:bg-gray-50 ${slot.is_available ? 'bg-green-50' : 'bg-gray-100'}`}>
                      <td className="border border-gray-200 px-3 py-2 font-instrument text-sm">{slot.id}</td>
                      <td className="border border-gray-200 px-3 py-2 font-instrument text-sm">{formatDate(slot.date)}</td>
                      <td className="border border-gray-200 px-3 py-2 font-instrument text-sm">{formatTime(slot.start_time)}</td>
                      <td className="border border-gray-200 px-3 py-2 font-instrument text-sm">{formatTime(slot.end_time)}</td>
                      <td className="border border-gray-200 px-3 py-2 text-center">
                        {slot.is_available ? (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-instrument">
                            ✅ Sim
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-instrument">
                            ❌ Não
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-center font-instrument text-sm">
                        {slot.max_capacity || 'N/A'}
                      </td>
                      <td className="border border-gray-200 px-3 py-2 text-center font-instrument text-sm">
                        {slot.current_bookings || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && data.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 font-instrument text-center">
              Total de registros: {data.length}
            </div>
          )}
        </div>

        {/* Botões de navegação */}
        <div className="mt-8 flex gap-4 justify-center">
          <a 
            href="/"
            className="bg-verde text-cream px-6 py-3 rounded-lg hover:bg-verde/90 transition-colors font-instrument font-semibold"
          >
            ← Voltar ao Início
          </a>
          <a 
            href="/agendamento"
            className="bg-amarelo text-cream px-6 py-3 rounded-lg hover:bg-amarelo/90 transition-colors font-instrument font-semibold"
          >
            Ver Agendamento →
          </a>
        </div>

      </main>
    </div>
  )
}
