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
  // Fetch from the NestJS API; cache: "no-store" = always fresh data.
  const res = await fetch("http://localhost:3000/memberships", {
    cache: "no-store",
  });

  // Parse the JSON body into our typed array.
  const memberships: Membership[] = await res.json();

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
