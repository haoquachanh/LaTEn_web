-- Create admin account with username and password: admin
-- Password hash is bcrypt of 'admin'

INSERT INTO users (
  username,
  email,
  password,
  fullname,
  role,
  created,
  updated
) VALUES (
  'admin',
  'admin@laten.com',
  '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- bcrypt hash of 'admin'
  'Admin User',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  username = EXCLUDED.username,
  password = EXCLUDED.password,
  role = EXCLUDED.role;
