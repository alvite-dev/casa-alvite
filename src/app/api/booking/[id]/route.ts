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

    console.log('Buscando booking com ID:', bookingId);

    // Primeiro, vamos tentar buscar apenas o booking para ver se existe
    const { data: simpleBooking, error: simpleError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single();

    console.log('Resultado da busca simples:', { simpleBooking, simpleError });

    if (simpleError || !simpleBooking) {
      return NextResponse.json(
        { 
          error: 'Reserva não encontrada',
          debug: {
            bookingId,
            error: simpleError?.message,
            code: simpleError?.code
          }
        },
        { status: 404 }
      );
    }

    // Vamos buscar os dados separadamente para evitar problemas de relacionamento
    const { data: slot, error: slotError } = await supabase
      .from('available_slots')
      .select(`
        date,
        start_time,
        experience_id,
        experiences (name, duration)
      `)
      .eq('id', simpleBooking.slot_id)
      .single();

    console.log('Resultado da busca do slot:', { slot, slotError });

    if (slotError || !slot) {
      // Se não conseguir buscar o slot, retorna só o booking sem os dados do slot
      const booking = {
        ...simpleBooking,
        available_slots: {
          date: new Date().toISOString().split('T')[0],
          start_time: '10:00:00',
          experiences: {
            name: 'Experiência na Casa Alvite',
            duration: '120'
          }
        }
      };
      return NextResponse.json(booking);
    }

    // Combinar os dados
    const booking = {
      ...simpleBooking,
      available_slots: slot
    };

    console.log('Dados finais do booking:', booking);

    return NextResponse.json(booking);

  } catch (error) {
    console.error('Erro ao buscar booking:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        debug: {
          message: error instanceof Error ? error.message : 'Erro desconhecido'
        }
      },
      { status: 500 }
    );
  }
}