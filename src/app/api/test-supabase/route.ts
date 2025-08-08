import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== TESTE SUPABASE INICIADO ===');
    
    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('URL existe:', !!supabaseUrl);
    console.log('Key existe:', !!supabaseKey);
    console.log('URL (primeiros 30 chars):', supabaseUrl?.substring(0, 30) || 'undefined');
    console.log('Key (primeiros 30 chars):', supabaseKey?.substring(0, 30) || 'undefined');
    
    // Mostrar todas as variáveis de ambiente que começam com NEXT_PUBLIC_SUPABASE
    const envVars = Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_SUPABASE'));
    console.log('Variáveis encontradas:', envVars);
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Variáveis de ambiente não configuradas',
        details: {
          url_exists: !!supabaseUrl,
          key_exists: !!supabaseKey,
          found_vars: envVars,
          url_preview: supabaseUrl?.substring(0, 30) || null,
          key_preview: supabaseKey?.substring(0, 30) || null
        },
        help: 'Configure as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local'
      }, { status: 500 });
    }

    // Tentar importar o Supabase
    const { createClient } = await import('@supabase/supabase-js');
    console.log('Supabase importado com sucesso');

    // Tentar criar o cliente
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Cliente Supabase criado');

    // Teste básico: verificar se o cliente responde
    const { data, error } = await supabase.from('available_slots').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.log('Erro do Supabase:', error);
      return NextResponse.json({
        error: 'Erro ao conectar com Supabase',
        details: error,
        step: 'select_test'
      }, { status: 500 });
    }

    console.log('Teste realizado com sucesso:', data);

    return NextResponse.json({
      success: true,
      message: 'Conexão com Supabase funcionando!',
      data: data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro completo:', error);
    return NextResponse.json({
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
