type Brewery = {
  id: string;
  name: string;
  code: string;
};

export default async function BreweriesPage() {
  let breweries: Brewery[];

  try {
    const res = await fetch("http://localhost:3000/breweries", {
      cache: "no-store",
    });

    // Same lesson as the forms: fetch doesn't throw on 500s.
    // Throwing here jumps us into the catch block below.
    if (!res.ok) throw new Error();

    breweries = await res.json();
  } catch {
    // API down or returned an error: render a friendly page instead of crashing.
    return (
      <main>
        <h1>Breweries</h1>
        <p>Could not load Breweries. Is the API running?</p>
      </main>
    );
  }

  return (
    <ul>
      {breweries.map((b) => (
        <li key={b.id}>
          {b.name} {b.code}
        </li>
      ))}
    </ul>
  );
}

// Run from apps/web
// npm run dev
// http://localhost:3001/breweries
