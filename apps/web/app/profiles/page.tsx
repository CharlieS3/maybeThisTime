// type is simply describing the shape of the data we expect
// data shapes → type (or interface); behavior + state you instantiate with new → class.
type Profile = {
  id: string;
  firstName: string;
};

export default async function ProfilesPage() {
  const res = await fetch("http://localhost:3000/profiles", {
    cache: "no-store",
  });
  const profiles: Profile[] = await res.json();

  return (
    <ul>
      {profiles.map((p) => (
        <li key={p.id}>{p.firstName}</li>
      ))}
    </ul>
  );
}

// Run in apps/web
// npm run dev

// http://localhost:3001/profiles
