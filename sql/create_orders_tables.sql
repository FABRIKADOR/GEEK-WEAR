-- Crear tabla de estados de pedido si no existe
CREATE TABLE IF NOT EXISTS order_statuses (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  color VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar estados básicos si no existen
INSERT INTO order_statuses (id, name, color) 
VALUES 
  ('processing', 'Procesando', 'yellow'),
  ('shipped', 'Enviado', 'blue'),
  ('delivered', 'Entregado', 'green'),
  ('cancelled', 'Cancelado', 'red')
ON CONFLICT (id) DO NOTHING;

-- Crear tabla de pedidos si no existe
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number VARCHAR NOT NULL UNIQUE,
  status_id VARCHAR REFERENCES order_statuses(id) DEFAULT 'processing',
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) NOT NULL,
  shipping_method VARCHAR NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_info JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de items de pedido si no existe
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  variant_id UUID,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Habilitar RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Políticas para pedidos
CREATE POLICY "Los usuarios pueden ver sus propios pedidos" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Los usuarios pueden crear sus propios pedidos" 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Políticas para items de pedido
CREATE POLICY "Los usuarios pueden ver los items de sus propios pedidos" 
ON order_items FOR SELECT 
USING (
  order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Los usuarios pueden crear items para sus propios pedidos" 
ON order_items FOR INSERT 
WITH CHECK (
  order_id IN (
    SELECT id FROM orders WHERE user_id = auth.uid()
  )
);
