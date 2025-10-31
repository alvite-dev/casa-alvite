import { createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

interface EventBookingRequest {
  numberOfPeople: number;
  participants: { name: string }[];
  phone: string;
  email: string;
  eventName: string;
  eventDate: string;
  eventTime: string;
}

// Links do MercadoPago baseados na quantidade de pessoas
const MERCADO_PAGO_LINKS = {
  1: 'https://mpago.li/1Mo6bXN', // 1 pessoa - R$ 190
  2: 'https://mpago.li/1Mo6bXN', // 2 pessoas - R$ 380 (temporário, mesmo link)
  3: 'https://mpago.li/1Mo6bXN', // 3 pessoas - R$ 570 (temporário, mesmo link)
  4: 'https://mpago.li/1Mo6bXN', // 4 pessoas - R$ 760 (temporário, mesmo link)
  5: 'https://mpago.li/1Mo6bXN', // 5 pessoas - R$ 950 (temporário, mesmo link)
};

export async function POST(request: Request) {
  try {
    const body: EventBookingRequest = await request.json();
    const { numberOfPeople, participants, phone, email, eventName, eventDate, eventTime } = body;

    // Validação básica
    if (!numberOfPeople || !participants || !phone || !email || !eventName || !eventDate || !eventTime) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (numberOfPeople < 1 || numberOfPeople > 5) {
      return NextResponse.json(
        { error: 'Número de pessoas deve ser entre 1 e 5' },
        { status: 400 }
      );
    }

    if (participants.length !== numberOfPeople) {
      return NextResponse.json(
        { error: 'Número de participantes não confere com quantidade informada' },
        { status: 400 }
      );
    }

    // Validar se todos os participantes têm nome
    if (participants.some(p => !p.name.trim())) {
      return NextResponse.json(
        { error: 'Todos os participantes devem ter nome' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Gerar ID único para o grupo
    const groupId = uuidv4();

    // Preparar dados dos participantes
    const participantsData = participants.map(participant => ({
      name: participant.name.trim(),
      event_name: eventName,
      event_date: eventDate,
      event_time: eventTime,
      group_id: groupId,
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      is_payment_confirmed: false
    }));

    // Inserir participantes no banco
    const { data: insertedParticipants, error: insertError } = await supabase
      .from('event_participants')
      .insert(participantsData)
      .select();

    if (insertError) {
      console.error('Erro ao inserir participantes:', insertError);
      return NextResponse.json(
        { error: 'Erro ao processar reserva' },
        { status: 500 }
      );
    }

    // Obter link do MercadoPago baseado na quantidade
    const mercadoPagoLink = MERCADO_PAGO_LINKS[numberOfPeople as keyof typeof MERCADO_PAGO_LINKS];

    if (!mercadoPagoLink) {
      return NextResponse.json(
        { error: 'Quantidade de pessoas não suportada' },
        { status: 400 }
      );
    }

    console.log('Reserva do evento criada com sucesso:', {
      groupId,
      numberOfPeople,
      participants: insertedParticipants?.length
    });

    // Retornar sucesso com link do MercadoPago
    return NextResponse.json({
      success: true,
      groupId,
      participants: insertedParticipants,
      mercadoPagoLink,
      message: 'Reserva registrada com sucesso!'
    });

  } catch (error) {
    console.error('Erro geral na API event-booking:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// Endpoint para buscar participantes (admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventName = searchParams.get('event');
    const groupId = searchParams.get('group');

    const supabase = createServerClient();
    
    let query = supabase
      .from('event_participants')
      .select('*')
      .order('created_at', { ascending: false });

    if (eventName) {
      query = query.eq('event_name', eventName);
    }

    if (groupId) {
      query = query.eq('group_id', groupId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar participantes:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar dados' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro geral na busca:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}