-- Add contact/login fields to profiles.
-- DB convention: snake_case (the API translates to camelCase via aliases).

ALTER TABLE profiles
  ADD COLUMN last_name TEXT NOT NULL,
  ADD COLUMN email     TEXT NOT NULL UNIQUE,  -- UNIQUE: two profiles can't share an email (and login needs this)
  ADD COLUMN username  TEXT NOT NULL UNIQUE,  -- same reasoning; this will be the login identifier
  ADD COLUMN phone     TEXT;                  -- nullable: phone is optional