CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- technically someone could try to insert their own id
-- we need a catch for that here eventually
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL
);