-- SQL para corrigir o problema da tabela available_slots
-- Execute este código no SQL Editor do Supabase Dashboard

-- OPÇÃO 1: Adicionar a coluna updated_at na tabela available_slots
ALTER TABLE available_slots ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- OPÇÃO 2: Se preferir remover o trigger da tabela available_slots (descomente as linhas abaixo)
-- DROP TRIGGER IF EXISTS update_available_slots_updated_at ON available_slots;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'available_slots' 
AND column_name = 'updated_at';