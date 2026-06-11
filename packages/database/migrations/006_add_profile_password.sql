-- Stores the bcrypt HASH of the password, never the password itself.
-- Named password_hash (not password) so the code can never pretend otherwise.
ALTER TABLE profiles
  ADD COLUMN password_hash TEXT NOT NULL;