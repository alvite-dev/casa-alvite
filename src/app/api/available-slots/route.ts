import { createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== AVAILABLE SLOTS API INICIADA ===');
    
    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Environment check:');
    console.log('- URL exists:', !!supabaseUrl);
    console.log('- Key exists:', !!supabaseKey);
    console.log('- URL preview:', supabaseUrl?.substring(0, 30) || 'undefined');
    console.log('- Node env:', process.env.NODE_ENV);
    console.log('- Vercel URL:', process.env.VERCEL_URL || 'not set');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Variáveis de ambiente Supabase não encontradas!');
      return NextResponse.json(
        { 
          error: 'Variáveis de ambiente não configuradas',
          details: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey,
            nodeEnv: process.env.NODE_ENV
          }
        },
        { status: 500 }
      );
    }

    console.log('Criando cliente Supabase...');
    const supabase = createServerClient();
    console.log('Cliente Supabase criado com sucesso');
    
    console.log('Fazendo query para available_slots...');
    const { data: availableSlots, error } = await supabase
      .from('available_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { 
          error: 'Erro ao buscar dados do Supabase', 
          details: error.message,
          supabaseError: error 
        },
        { status: 500 }
      );
    }

    console.log('Query executada com sucesso!');
    console.log('Número de slots encontrados:', availableSlots?.length || 0);
    console.log('Primeiros 3 slots:', availableSlots?.slice(0, 3));

    return NextResponse.json(availableSlots || []);
  } catch (error) {
    console.error('API error completo:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor', 
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
