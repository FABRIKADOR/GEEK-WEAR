-- Crear tabla de direcciones si no existe
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  street_address VARCHAR NOT NULL,
  city VARCHAR NOT NULL,
  state VARCHAR NOT NULL,
  postal_code VARCHAR NOT NULL,
  country VARCHAR DEFAULT 'México',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Actualizar tabla de pedidos para México
ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address;
ALTER TABLE orders DROP COLUMN IF EXISTS payment_info;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address_id UUID REFERENCES addresses(id);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR DEFAULT 'MercadoPago';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id VARCHAR;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency VARCHAR DEFAULT 'MXN';

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_default ON addresses(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- Habilitar RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Políticas para direcciones
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propias direcciones" ON addresses;
CREATE POLICY "Los usuarios pueden ver sus propias direcciones" 
ON addresses FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden crear sus propias direcciones" ON addresses;
CREATE POLICY "Los usuarios pueden crear sus propias direcciones" 
ON addresses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propias direcciones" ON addresses;
CREATE POLICY "Los usuarios pueden actualizar sus propias direcciones" 
ON addresses FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Los usuarios pueden eliminar sus propias direcciones" ON addresses;
CREATE POLICY "Los usuarios pueden eliminar sus propias direcciones" 
ON addresses FOR DELETE 
USING (auth.uid() = user_id);

-- Insertar estados de México
INSERT INTO order_statuses (id, name, color) 
VALUES 
  ('pending_payment', 'Pendiente de Pago', 'orange'),
  ('confirmed', 'Confirmado', 'green'),
  ('preparing', 'Preparando', 'blue'),
  ('shipped', 'Enviado', 'purple'),
  ('delivered', 'Entregado', 'green'),
  ('cancelled', 'Cancelado', 'red')
ON CONFLICT (id) DO NOTHING;
