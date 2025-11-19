import { createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

interface WaitlistRequest {
  email: string;
  eventName: string;
}

export async function POST(request: Request) {
  try {
    const body: WaitlistRequest = await request.json();
    const { email, eventName } = body;

    // Validação básica
    if (!email || !eventName) {
      return NextResponse.json(
        { error: 'Email e nome do evento são obrigatórios' },
        { status: 400 }
      );
    }

    // Validação de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Verificar se o email já está cadastrado para este evento
    const { data: existing, error: checkError } = await supabase
      .from('event_waitlist')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('event_name', eventName)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado para este evento' },
        { status: 409 }
      );
    }

    // Inserir o email na waitlist
    const { data, error } = await supabase
      .from('event_waitlist')
      .insert([
        {
          email: email.toLowerCase(),
          event_name: eventName,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao inserir na waitlist:', error);
      return NextResponse.json(
        { error: 'Erro ao cadastrar email. Tente novamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email cadastrado com sucesso!',
        data
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erro na API waitlist:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
