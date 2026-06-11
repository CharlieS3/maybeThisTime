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
  // Lives at the TOP LEVEL of the component — hooks can't go inside
  // regular functions like handleSubmit (a React rule).
  useEffect(() => {
    async function loadBreweries() {
      const res = await fetch("http://localhost:3000/breweries");
      const data = await res.json();
      setBreweries(data); // triggers a re-render; dropdown now has options
    }
    loadBreweries();
  }, []);

  async function handleSubmit() {
    // try/catch handles the case where the request itself fails
    // (API down, no network) — fetch throws, it never gets a response.
    try {
      // The POST that creates the profile
      const res = await fetch("http://localhost:3000/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Shorthand: { firstName } is the same as { firstName: firstName }.
        body: JSON.stringify({ firstName, breweryId, role }),
      });

      // fetch does NOT throw on 400/409/500 — a response arrived, so to
      // fetch that's "success". We must check the status ourselves.
      // res.ok is true only for 2xx statuses.
      if (!res.ok) {
        // Parse the error body our API sends ({ statusCode, message }).
        const err = await res.json();
        // ValidationPipe sends message as an ARRAY of strings;
        // our filter sends a single string. Handle both.
        const text = Array.isArray(err.message)
          ? err.message.join(", ")
          : err.message;
        setMessage(`Error: ${text}`);
        return; // stop here — don't clear the input, let the user fix it
      }

      // Only reached on 2xx: safe to read the created row.
      const created = await res.json();
      setMessage(`Created profile: ${created.firstName} (${created.role})`);
      setFirstName("");
    } catch {
      // No response at all (server unreachable, network error).
      setMessage("Error: could not reach the server. Is the API running?");
    }
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
