// Server component (no "use client") — it can fetch directly on the server.

// Define the shape of one membership row, matching GET /memberships.
type Membership = {
  profileId: string; // UUID of the profile
  firstName: string; // joined in from profiles
  breweryId: string; // UUID of the brewery
  breweryName: string; // joined in from breweries
  role: string; // OWNER / ADMIN / BREWER / STAFF
};

// async is allowed because this is a server component.
export default async function MembershipsPage() {
  // Declared outside the try so it's still usable after it.
  let memberships: Membership[];

  try {
    const res = await fetch("http://localhost:3000/memberships", {
      cache: "no-store",
    });

    // Same lesson as the forms: fetch doesn't throw on 500s.
    // Throwing here jumps us into the catch block below.
    if (!res.ok) throw new Error();

    memberships = await res.json();
  } catch {
    // API down or returned an error: render a friendly page instead of crashing.
    return (
      <main>
        <h1>Memberships</h1>
        <p>Could not load memberships. Is the API running?</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Memberships</h1>
      <ul>
        {/* Composite key: profileId + breweryId is unique together (matches the DB PK). */}
        {memberships.map((m) => (
          <li key={`${m.profileId}-${m.breweryId}`}>
            {m.firstName} — {m.breweryName} — {m.role}
          </li>
        ))}
      </ul>
    </main>
  );
}
