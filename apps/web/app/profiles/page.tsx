// type is simply describing the shape of the data we expect
// data shapes → type (or interface); behavior + state you instantiate with new → class.
type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string | null;
};

export default async function ProfilesPage() {
  let profiles: Profile[];

  try {
    const res = await fetch("http://localhost:3000/profiles", {
      cache: "no-store",
    });

    // Same lesson as the forms: fetch doesn't throw on 500s.
    // Throwing here jumps us into the catch block below.
    if (!res.ok) throw new Error();

    profiles = await res.json();
  } catch {
    // API down or returned an error: render a friendly page instead of crashing.
    return (
      <main>
        <h1>Profiles</h1>
        <p>Could not load profiles. Is the API running?</p>
      </main>
    );
  }

  return (
    <ul>
      {profiles.map((p) => (
        <li key={p.id}>
          {p.firstName} {p.lastName} {p.username} {p.email}
        </li>
      ))}
    </ul>
  );
}

// Run in apps/web
// npm run dev

// http://localhost:3001/profiles
