/*
To add a new profile.
A profile must now belong to a brewery, so this form also asks
WHICH brewery and WHAT role.
*/

"use client";

// useEffect is a React function for running code at specific moments —
// here: "when the page first loads" (to fetch the brewery list).
import { useEffect, useState } from "react";

// A TypeScript type describing one brewery row from GET /breweries.
type Brewery = { id: string; name: string };

export default function NewProfilePage() {
  const [firstName, setFirstName] = useState("");
  // The id of the brewery picked in the dropdown ("" = nothing picked yet).
  const [breweryId, setBreweryId] = useState("");
  // The role picked in the dropdown. Defaults to STAFF.
  const [role, setRole] = useState("STAFF");
  // The list of breweries to show in the dropdown. Starts empty,
  // gets filled by the fetch below.
  const [breweries, setBreweries] = useState<Brewery[]>([]);
  const [message, setMessage] = useState("");

  // useEffect(fn, []) — run fn once, right after the page first renders.
  // The empty array [] means "no dependencies → never run it again."
  // Without it, the fetch would run on EVERY re-render (every keystroke!).
  useEffect(() => {
    async function loadBreweries() {
      const res = await fetch("http://localhost:3000/breweries");
      const data = await res.json();
      setBreweries(data); // triggers a re-render; dropdown now has options
    }
    loadBreweries();
  }, []);

  async function handleSubmit() {
    const res = await fetch("http://localhost:3000/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Shorthand: { firstName } is the same as { firstName: firstName }
      body: JSON.stringify({ firstName, breweryId, role }),
    });

    const created = await res.json();
    setMessage(`Created profile: ${created.firstName} (${created.role})`);
    setFirstName("");
  }

  return (
    <div>
      <h1>New Profile</h1>
      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First name"
      />

      {/* Brewery dropdown. Works like the input: value + onChange. */}
      <select value={breweryId} onChange={(e) => setBreweryId(e.target.value)}>
        {/* Disabled placeholder so the user must actively choose */}
        <option value="" disabled>
          Pick a brewery
        </option>
        {/* .map turns each brewery object into an <option>.
            key — React needs a unique id per item in a list.
            value={b.id} — what gets stored in state (the UUID).
            {b.name} — what the user sees. */}
        {breweries.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      {/* Role dropdown — fixed options matching the DB CHECK constraint */}
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="OWNER">Owner</option>
        <option value="ADMIN">Admin</option>
        <option value="BREWER">Brewer</option>
        <option value="STAFF">Staff</option>
      </select>

      <button onClick={handleSubmit}>Create</button>
      <p>{message}</p>
    </div>
  );
}

// http://localhost:3001/profiles/new
