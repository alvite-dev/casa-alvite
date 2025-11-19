import { createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

// Desabilita cache para garantir dados em tempo real
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = createServerClient();
    
    const { data: experiences, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar dados das experiências', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(experiences || [], {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}