-- Criação da tabela event_waitlist para armazenar emails de pessoas interessadas em eventos futuros
CREATE TABLE IF NOT EXISTS event_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  event_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  notified BOOLEAN DEFAULT false
);

-- Criar índice no email para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_event_waitlist_email ON event_waitlist(email);

-- Criar índice no event_name para filtrar por evento
CREATE INDEX IF NOT EXISTS idx_event_waitlist_event_name ON event_waitlist(event_name);

-- Adicionar comentários para documentação
COMMENT ON TABLE event_waitlist IS 'Armazena emails de pessoas interessadas em ser notificadas sobre eventos futuros';
COMMENT ON COLUMN event_waitlist.email IS 'Email da pessoa interessada';
COMMENT ON COLUMN event_waitlist.event_name IS 'Nome do evento de interesse';
COMMENT ON COLUMN event_waitlist.notified IS 'Indica se a pessoa já foi notificada sobre o próximo evento';
