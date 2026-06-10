

/*
REFERENCES — foreign keys: the DB rejects memberships pointing at profiles/breweries that don't exist.

ON DELETE CASCADE — deleting a profile or brewery auto-deletes its memberships (no orphan rows).

PRIMARY KEY (profile_id, brewery_id) — a composite key instead of a UUID id. It also prevents the same person joining the same brewery twice.

*/



CREATE TABLE memberships (
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  brewery_id UUID NOT NULL REFERENCES breweries(id) ON DELETE CASCADE,
  -- role must be one of these 4 and it is case sensitive
  role TEXT NOT NULL CHECK (role IN ('OWNER', 'ADMIN', 'BREWER', 'STAFF')),
  PRIMARY KEY (profile_id, brewery_id)
);