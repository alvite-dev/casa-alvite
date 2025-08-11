import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== TESTE BÁSICO INICIADO ===');
    
    // Verificar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('URL existe:', !!supabaseUrl);
    console.log('Key existe:', !!supabaseKey);
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Variáveis de ambiente não configuradas',
        url_exists: !!supabaseUrl,
        key_exists: !!supabaseKey
      }, { status: 500 });
    }

    // Só testar a importação e criação do cliente
    const { createClient } = await import('@supabase/supabase-js');
    console.log('Supabase importado com sucesso');

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Cliente Supabase criado');

    return NextResponse.json({
      success: true,
      message: 'Cliente Supabase criado com sucesso!',
      url_configured: !!supabaseUrl,
      key_configured: !!supabaseKey,
      url_start: supabaseUrl.substring(0, 30),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na criação do cliente:', error);
    return NextResponse.json({
      error: 'Erro ao criar cliente Supabase',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined
    }, { status: 500 });
  }
}
