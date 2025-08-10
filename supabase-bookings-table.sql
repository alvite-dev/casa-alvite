-- SQL para criar a tabela bookings no Supabase
-- Execute este código no SQL Editor do Supabase Dashboard

-- 1. Criar tabela bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES available_slots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  number_of_people INTEGER NOT NULL CHECK (number_of_people > 0),
  total_value DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índices para performance
CREATE INDEX idx_bookings_slot_id ON bookings(slot_id);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- 3. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 4. Criar trigger para available_slots (caso não exista)
CREATE TRIGGER update_available_slots_updated_at 
BEFORE UPDATE ON available_slots 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Criar trigger para bookings
CREATE TRIGGER update_bookings_updated_at 
BEFORE UPDATE ON bookings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Habilitar RLS (Row Level Security) se necessário
-- ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 7. Criar policies para permitir operações (ajustar conforme necessário)
-- CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);