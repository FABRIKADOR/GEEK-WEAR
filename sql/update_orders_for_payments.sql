-- Agregar columnas para información de pago
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_details JSONB;

-- Crear índice para búsquedas por payment_id
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- Crear índice para búsquedas por order_number
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
