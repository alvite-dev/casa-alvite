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
        total_value,
        status: 'booked'
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

    // 4. Marcar TODOS os slots do mesmo dia como indisponíveis
    console.log('Bloqueando todos os slots do dia:', slot.date);
    const { error: updateError, count } = await supabase
      .from('available_slots')
      .update({ is_available: false, updated_at: new Date().toISOString() })
      .eq('date', slot.date);
    
    console.log('Slots bloqueados:', count);

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
    console.log('Booking criado com sucesso:', booking.id);
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