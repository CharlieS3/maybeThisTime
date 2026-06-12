-- It creates the sessions table — the server-side half of "staying logged in."
-- Each row = one active login: a random ID (the coat-check ticket), whose user it belongs to (profile_id), when it started (created_at), and when it stops being valid (expires_at).
-- On login we'll INSERT a row here and hand the ID to the browser as a cookie; on every later request we look the ID up here to know who's talking.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- When the session begain for the profile
  expires_at TIMESTAMPTZ NOT NULL
);