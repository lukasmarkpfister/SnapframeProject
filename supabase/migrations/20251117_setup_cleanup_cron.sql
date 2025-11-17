-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule daily cleanup at 3:00 AM UTC
SELECT cron.schedule(
  'cleanup-old-pending-orders',
  '0 3 * * *',
  $$
  DELETE FROM orders 
  WHERE status = 'pending' 
  AND created_at < NOW() - INTERVAL '24 hours';
  $$
);

-- Optional: Schedule to run every hour instead
-- SELECT cron.schedule(
--   'cleanup-old-pending-orders',
--   '0 * * * *',
--   $$
--   DELETE FROM orders 
--   WHERE status = 'pending' 
--   AND created_at < NOW() - INTERVAL '24 hours';
--   $$
-- );

-- View scheduled jobs
SELECT * FROM cron.job;

-- Unschedule job (if needed)
-- SELECT cron.unschedule('cleanup-old-pending-orders');
