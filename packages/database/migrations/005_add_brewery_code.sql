-- Login/identification code for each brewery (e.g. "BRW42X").
-- UNIQUE: the code must identify exactly one brewery.
ALTER TABLE breweries
  ADD COLUMN code TEXT NOT NULL UNIQUE;