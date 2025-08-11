import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== TESTE CRIAÇÃO/VERIFICAÇÃO DA TABELA ===');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Variáveis não configuradas' }, { status: 500 });
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Primeiro, vamos tentar inserir alguns dados de teste
    console.log('Tentando inserir dados de teste...');
    
    const testData = [
      {
        date: '2025-08-10',
        start_time: '09:00:00',
        end_time: '12:00:00',
        is_available: true,
        max_capacity: 6,
        current_bookings: 0
      },
      {
        date: '2025-08-10',
        start_time: '14:00:00',
        end_time: '17:00:00',
        is_available: true,
        max_capacity: 6,
        current_bookings: 2
      },
      {
        date: '2025-08-11',
        start_time: '09:00:00',
        end_time: '12:00:00',
        is_available: false,
        max_capacity: 6,
        current_bookings: 6
      }
    ];

    const { data: insertData, error: insertError } = await supabase
      .from('available_slots')
      .insert(testData)
      .select();

    if (insertError) {
      console.log('Erro ao inserir:', insertError);
      
      // Se a tabela não existe, tenta apenas verificar se consegue acessar
      const { data: selectData, error: selectError } = await supabase
        .from('available_slots')
        .select('*')
        .limit(1);

      if (selectError) {
        return NextResponse.json({
          error: 'Tabela não existe ou sem permissão',
          insert_error: insertError.message,
          select_error: selectError.message,
          suggestion: 'Crie a tabela available_slots no Supabase Dashboard'
        }, { status: 500 });
      }

      return NextResponse.json({
        message: 'Tabela existe mas erro ao inserir',
        insert_error: insertError.message,
        existing_data: selectData?.length || 0
      });
    }

    console.log('Dados inseridos com sucesso:', insertData);

    return NextResponse.json({
      success: true,
      message: 'Dados de teste inseridos com sucesso!',
      inserted_count: insertData?.length || 0,
      data: insertData
    });

  } catch (error) {
    console.error('Erro geral:', error);
    return NextResponse.json({
      error: 'Erro interno',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
