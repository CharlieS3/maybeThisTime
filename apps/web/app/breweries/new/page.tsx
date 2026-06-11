/*
To add a new brewery.
*/

// "use client" means this component runs in the browser instead of on the server.
// We need this because the page uses state and click handlers (interactivity).
"use client";

// useState is a React function. It returns (for example):
//    name — the current value (starts as "")
//    setName — a function to change it
// Every time you call setName, React re-renders the component with the new value.
import { useState } from "react";

export default function NewBreweryPage() {
  // State for the input box. "" is the starting value.
  const [name, setName] = useState("");
  // State for the feedback message shown after creating.
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    // try/catch handles the case where the request itself fails
    // (API down, no network) — fetch throws, it never gets a response.
    try {
      const res = await fetch("http://localhost:3000/breweries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name }),
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
      setMessage(`Created brewery: ${created.name}`);
      setName("");
    } catch {
      // No response at all (server unreachable, network error).
      setMessage("Error: could not reach the server. Is the API running?");
    }
  }

  return (
    <div>
      <h1>New Brewery</h1>
      <input
        // value={name} — the input always displays the current state.
        // This makes it a "controlled input": React state is the source of truth.
        value={name}
        // onChange={...} — "run this function every time the input's content changes" (each keystroke).
        // (e) => ... — an arrow function; e is the event object React hands you, describing what happened.
        // e.target.value — whatever text is currently in that input.
        onChange={(e) => setName(e.target.value)}
        placeholder="Brewery name" // What shows up when no name is entered
      />
      {/* onClick runs handleSubmit when the button is pressed */}
      <button onClick={handleSubmit}>Create</button>
      {/* Shows the feedback message; empty string renders nothing visible */}
      <p>{message}</p>
    </div>
  );
}

// http://localhost:3001/breweries/new
