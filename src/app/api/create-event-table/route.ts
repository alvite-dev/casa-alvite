import { createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const supabase = createServerClient();

    // Criar tabela event_participants
    const { data, error } = await supabase.rpc('create_event_participants_table');

    if (error) {
      console.error('Erro ao criar tabela:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Tabela event_participants criada com sucesso!' 
    });
  } catch (error) {
    console.error('Erro geral:', error);
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}

// SQL para criar a tabela via RPC no Supabase:
/*
CREATE OR REPLACE FUNCTION create_event_participants_table()
RETURNS TEXT AS $$
BEGIN
  -- Criar tabela se não existir
  CREATE TABLE IF NOT EXISTS event_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TEXT NOT NULL,
    group_id UUID NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    is_payment_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Criar índices para performance
  CREATE INDEX IF NOT EXISTS idx_event_participants_group_id ON event_participants(group_id);
  CREATE INDEX IF NOT EXISTS idx_event_participants_event_name ON event_participants(event_name);
  CREATE INDEX IF NOT EXISTS idx_event_participants_created_at ON event_participants(created_at);

  RETURN 'Tabela event_participants criada com sucesso!';
END;
$$ LANGUAGE plpgsql;
*/