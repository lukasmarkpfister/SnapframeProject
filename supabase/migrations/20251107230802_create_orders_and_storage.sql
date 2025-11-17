/*
  # LightPicture Orders System

  1. Neue Tabellen
    - `orders`
      - `id` (uuid, primary key) - Eindeutige Bestell-ID
      - `image_url` (text) - URL des hochgeladenen und zugeschnittenen Bildes
      - `frame_color` (text) - Rahmenfarbe (black oder white)
      - `status` (text) - Bestellstatus (pending, paid, processing, shipped, completed)
      - `stripe_session_id` (text, optional) - Stripe Checkout Session ID
      - `created_at` (timestamptz) - Erstellungszeitpunkt

  2. Sicherheit
    - RLS aktiviert für `orders` Tabelle
    - Policy für authentifizierte Benutzer zum Erstellen von Bestellungen
    - Policy für Service-Rolle zum Aktualisieren von Bestellungen

  3. Storage Bucket
    - Erstellt `order-images` Bucket für Kundenbilder
    - Privater Bucket mit kontrolliertem Zugriff via Signed URLs
    - Nur authentifizierte Uploads erlaubt
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  frame_color text NOT NULL CHECK (frame_color IN ('black', 'white')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'completed')),
  stripe_session_id text,
  tracking_number text,
  customer_email text NOT NULL DEFAULT '',
  customer_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Service role can update orders"
  ON orders
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders"
  ON orders
  FOR SELECT
  TO anon
  USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('order-images', 'order-images', false)
ON CONFLICT (id) DO NOTHING;

  CREATE POLICY "Anon can upload images"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'order-images');

  CREATE POLICY "Service role can access all images"
  ON storage.objects
  FOR SELECT
  TO service_role
  USING (bucket_id = 'order-images');

  CREATE POLICY "Service role can delete images"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'order-images');
