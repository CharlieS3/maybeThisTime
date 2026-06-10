type Brewery = {
  id: string;
  name: string;
};

export default async function BreweriesPage() {
  const res = await fetch("http://localhost:3000/breweries", {
    cache: "no-store",
  });
  const breweries: Brewery[] = await res.json();

  return (
    <ul>
      {breweries.map((b) => (
        <li key={b.id}>{b.name}</li>
      ))}
    </ul>
  );
}

// Run from apps/web
// npm run dev
// http://localhost:3001/breweries
