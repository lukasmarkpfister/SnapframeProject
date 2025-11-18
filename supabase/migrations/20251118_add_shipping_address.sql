-- Add shipping address and phone fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_address_line1 text,
ADD COLUMN IF NOT EXISTS shipping_address_line2 text,
ADD COLUMN IF NOT EXISTS shipping_postal_code text,
ADD COLUMN IF NOT EXISTS shipping_city text,
ADD COLUMN IF NOT EXISTS shipping_country text DEFAULT 'DE',
ADD COLUMN IF NOT EXISTS customer_phone text;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_shipping_city ON orders(shipping_city);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
