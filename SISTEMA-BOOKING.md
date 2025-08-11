# Sistema de Booking - Casa Alvite

## 📋 Visão Geral

Este documento detalha a implementação do sistema de reservas para tornar horários indisponíveis após agendamento, incluindo uma página de confirmação.

## 🔍 Análise do Sistema Atual

### Estrutura Existente
- **Tabela:** `available_slots`
- **Frontend:** `src/components/AgendamentoSection.tsx`
- **API:** `src/app/api/available-slots/route.ts`

### Estado Atual do Agendamento
- Usuário escolhe data, horário e número de pessoas
- Sistema apenas exibe um `alert()` com confirmação (linha 354)
- **PROBLEMA:** Horários não são realmente reservados no banco

### Interface Atual (`AvailableSlot`)
```typescript
interface AvailableSlot {
  id: string;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_available: boolean;
  max_capacity?: number | null;
  current_bookings?: number | null;
  created_at: string;
  updated_at?: string;
  experience_id?: string;
}
```

## 🗄️ Estrutura do Banco de Dados

### Tabela Existente: `available_slots`
```sql
-- Estrutura atual (já existe)
CREATE TABLE available_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT true,
  max_capacity INTEGER,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  experience_id UUID
);
```

### Nova Tabela: `bookings` (CRIAR)
```sql
-- Nova tabela para armazenar reservas
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES available_slots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  number_of_people INTEGER NOT NULL CHECK (number_of_people > 0),
  total_value DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
```

### Triggers para `updated_at`
```sql
-- Trigger para available_slots
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_available_slots_updated_at BEFORE UPDATE ON available_slots 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para bookings
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔗 API Endpoints

### Nova Rota: `/api/booking` (CRIAR)

**Arquivo:** `src/app/api/booking/route.ts`

```typescript
import { createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface BookingRequest {
  slot_id: string;
  name: string;
  email: string;
  phone: string;
  number_of_people: number;
}

export async function POST(request: Request) {
  try {
    const body: BookingRequest = await request.json();
    const { slot_id, name, email, phone, number_of_people } = body;

    // Validação básica
    if (!slot_id || !name || !email || !phone || !number_of_people) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (number_of_people < 1 || number_of_people > 10) {
      return NextResponse.json(
        { error: 'Número de pessoas deve ser entre 1 e 10' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // 1. Verificar se o slot ainda está disponível
    const { data: slot, error: slotError } = await supabase
      .from('available_slots')
      .select('*, experiences(name, price)')
      .eq('id', slot_id)
      .eq('is_available', true)
      .single();

    if (slotError || !slot) {
      return NextResponse.json(
        { error: 'Horário não encontrado ou não está mais disponível' },
        { status: 404 }
      );
    }

    // 2. Calcular valor total
    const pricePerPerson = slot.experiences?.price || 120; // Fallback
    const total_value = pricePerPerson * number_of_people;

    // 3. Criar reserva e marcar slot como indisponível (transação)
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        slot_id,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        number_of_people,
        total_value
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Erro ao criar booking:', bookingError);
      return NextResponse.json(
        { error: 'Erro ao processar reserva' },
        { status: 500 }
      );
    }

    // 4. Marcar slot como indisponível
    const { error: updateError } = await supabase
      .from('available_slots')
      .update({ is_available: false, updated_at: new Date().toISOString() })
      .eq('id', slot_id);

    if (updateError) {
      // Se falhou ao atualizar slot, remover booking
      await supabase.from('bookings').delete().eq('id', booking.id);
      
      console.error('Erro ao atualizar slot:', updateError);
      return NextResponse.json(
        { error: 'Erro ao finalizar reserva' },
        { status: 500 }
      );
    }

    // 5. Retornar sucesso com ID da reserva
    return NextResponse.json({
      success: true,
      booking_id: booking.id,
      message: 'Reserva confirmada com sucesso!'
    });

  } catch (error) {
    console.error('Erro geral na API booking:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

### Nova Rota: `/api/booking/[id]` (CRIAR)

**Arquivo:** `src/app/api/booking/[id]/route.ts`

```typescript
import { createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;

    if (!bookingId) {
      return NextResponse.json(
        { error: 'ID da reserva é obrigatório' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        *,
        available_slots (
          date,
          start_time,
          end_time,
          experiences (name, duration)
        )
      `)
      .eq('id', bookingId)
      .single();

    if (error || !booking) {
      return NextResponse.json(
        { error: 'Reserva não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);

  } catch (error) {
    console.error('Erro ao buscar booking:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
```

## 🎨 Frontend - Mudanças Necessárias

### 1. Atualizar `AgendamentoSection.tsx`

**Localização:** `src/components/AgendamentoSection.tsx`

#### Mudanças na função `handleBooking` (linha 310-362)

```typescript
// SUBSTITUIR a função handleBooking atual por:
const handleBooking = async () => {
  if (!selectedSlot || !(selectedDate instanceof Date) || !experience) return;
  
  setBookingLoading(true);
  setBookingMessage(null);
  
  try {
    // Verificar se o horário ainda está disponível
    const checkResponse = await fetch('/api/available-slots', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    
    if (!checkResponse.ok) {
      throw new Error('Erro ao verificar disponibilidade');
    }
    
    const currentSlots = await checkResponse.json();
    const currentSlot = currentSlots.find((slot: AvailableSlot) => slot.id === selectedSlot.id);
    
    if (!currentSlot || !currentSlot.is_available) {
      setBookingMessage('❌ Este horário não está mais disponível. Por favor, escolha outro horário.');
      setAvailableSlots(currentSlots);
      setSelectedSlot(null);
      return;
    }
    
    // Criar a reserva
    const bookingData = {
      slot_id: selectedSlot.id,
      name: personalInfo.name,
      email: personalInfo.email,
      phone: personalInfo.phone,
      number_of_people: numberOfPeople
    };
    
    const bookingResponse = await fetch('/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    const result = await bookingResponse.json();
    
    if (!bookingResponse.ok) {
      throw new Error(result.error || 'Erro ao criar reserva');
    }
    
    // Sucesso! Redirecionar para página de confirmação
    router.push(`/confirmacao/${result.booking_id}`);
    
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    setBookingMessage(`❌ ${error instanceof Error ? error.message : 'Erro ao processar reserva. Tente novamente.'}`);
  } finally {
    setBookingLoading(false);
  }
};
```

#### Adicionar import do useRouter (se não existir)
```typescript
import { useRouter } from 'next/navigation';
```

### 2. Criar Página de Confirmação

**Arquivo:** `src/app/confirmacao/[id]/page.tsx` (CRIAR)

```typescript
'use client'

import { useState, useEffect } from 'react';
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const formatTimeRange = (startTime: string) => {
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
        <div className="bg-white rounded-2xl shadow-lg border border-cinza/10 overflow-hidden mb-8">
          <div className="bg-verde px-8 py-6">
            <h2 className="text-xl font-semibold text-cream flex items-center gap-3">
              <span className="w-2 h-2 bg-amarelo rounded-full"></span>
              Detalhes da sua Reserva
            </h2>
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
          
          <div className="space-y-2 text-cinza">
            <p>📧 contato@casaalvite.com</p>
            <p>📱 (11) 99999-9999</p>
            <p>📍 Localização será enviada via WhatsApp</p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="text-center space-y-4">
          <button
            onClick={() => router.push('/')}
            className="bg-verde text-cream px-8 py-3 rounded-md hover:bg-verde/90 transition-colors font-medium"
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
```

### 3. Atualizar Rota de Agendamento

**Arquivo:** `src/app/agendamento/page.tsx` (se não existir, criar)

```typescript
import AgendamentoSection from '@/components/AgendamentoSection';

export default function AgendamentoPage() {
  return <AgendamentoSection />;
}
```

## 🔄 Fluxo Completo do Sistema

### 1. Fluxo de Agendamento
```
1. Usuário acessa /agendamento
2. Escolhe data (calendário)
3. Escolhe horário (botões)
4. Define número de pessoas (dropdown)
5. Preenche dados pessoais (nome, email, telefone)
6. Clica "Confirmar Agendamento"
7. Sistema valida se horário ainda está disponível
8. Sistema cria registro na tabela bookings
9. Sistema marca slot como is_available = false
10. Usuário é redirecionado para /confirmacao/[booking_id]
```

### 2. Fluxo da Página de Confirmação
```
1. Usuário acessa /confirmacao/[booking_id]
2. Sistema busca dados da reserva
3. Exibe informações completas
4. Mostra próximos passos
5. Fornece informações de contato
```

## ✅ Validações e Regras de Negócio

### Frontend (Client-side)
- Nome: obrigatório, min 2 caracteres
- Email: formato válido obrigatório
- Telefone: obrigatório
- Número de pessoas: entre 2-6

### Backend (Server-side)
- Slot existe e está disponível
- Dados pessoais completos
- Número de pessoas entre 1-10
- Email em formato válido
- Transação atômica (criar booking + atualizar slot)

### Tratamento de Erros
- Slot não encontrado: 404
- Slot não disponível: erro específico
- Erro de validação: 400 com detalhes
- Erro interno: 500

## 🧪 Testes Necessários

### 1. Testes da API `/api/booking`

```bash
# Teste de criação bem-sucedida
curl -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "slot_id": "uuid-do-slot",
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999",
    "number_of_people": 2
  }'

# Teste de slot indisponível
# (repetir o mesmo request acima)

# Teste de dados inválidos
curl -X POST http://localhost:3000/api/booking \
  -H "Content-Type: application/json" \
  -d '{
    "slot_id": "uuid-do-slot",
    "name": "",
    "email": "email-inválido",
    "number_of_people": 0
  }'
```

### 2. Testes da API `/api/booking/[id]`

```bash
# Teste de busca bem-sucedida
curl http://localhost:3000/api/booking/uuid-da-reserva

# Teste de reserva não encontrada
curl http://localhost:3000/api/booking/uuid-inexistente
```

### 3. Testes do Frontend

**Cenários a testar:**
1. Agendamento bem-sucedido
2. Tentativa de agendar slot indisponível
3. Validação de campos obrigatórios
4. Redirecionamento para confirmação
5. Exibição correta da página de confirmação
6. Tratamento de reserva não encontrada

## 🚀 Deployment

### 1. Aplicar Mudanças no Supabase

```sql
-- 1. Criar tabela bookings
-- (executar SQL da seção "Estrutura do Banco de Dados")

-- 2. Verificar permissões RLS se habilitado
-- Permitir leitura e escrita para usuários anônimos nas tabelas necessárias
```

### 2. Deploy do Código

```bash
# 1. Commit das mudanças
git add .
git commit -m "feat: implementa sistema de booking com confirmação"

# 2. Push para produção
git push origin main

# 3. Verificar se variáveis de ambiente estão configuradas
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Verificações Pós-Deploy

```bash
# 1. Testar API em produção
curl -X POST https://sua-url.vercel.app/api/booking -d '...'

# 2. Testar fluxo completo no browser
# - Fazer agendamento
# - Verificar se slot fica indisponível
# - Acessar página de confirmação

# 3. Verificar dados no Supabase Dashboard
# - Registros na tabela bookings
# - Slots marcados como is_available = false
```

## 🔧 Configurações Adicionais

### Variáveis de Ambiente
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Tailwind CSS (cores utilizadas)
```javascript
// tailwind.config.js - verificar se essas cores existem
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: '#F4E8DA',
        verde: '#6A6D51',
        cinza: '#40413E',
        amarelo: '#E6B17A'
      }
    }
  }
}
```

## 📊 Monitoramento

### Logs Importantes
- Tentativas de booking
- Slots que ficam indisponíveis
- Erros de validação
- Acessos às páginas de confirmação

### Métricas a Acompanhar
- Taxa de conversão (agendamentos/visitas)
- Tempo médio do fluxo
- Abandono por etapa
- Erros de slot indisponível

---

## 🎯 Resumo da Implementação

**Arquivos a CRIAR:**
- `src/app/api/booking/route.ts`
- `src/app/api/booking/[id]/route.ts`
- `src/app/confirmacao/[id]/page.tsx`
- `src/app/agendamento/page.tsx` (se não existir)

**Arquivos a MODIFICAR:**
- `src/components/AgendamentoSection.tsx` (função handleBooking)

**Banco de Dados:**
- Criar tabela `bookings`
- Criar triggers para `updated_at`

**Resultado Final:**
✅ Sistema de reserva funcional
✅ Horários ficam indisponíveis após agendamento  
✅ Página de confirmação com todos os detalhes
✅ Fluxo completo de agendamento
✅ Tratamento de erros robusto
