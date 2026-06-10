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
    // fetch(...) — the browser sends an HTTP request to the NestJS API.
    // await pauses here until the response arrives.
    // method: "POST" — matches the @Post() handler in BreweriesController.
    // headers: {...} — tells the server "the body is JSON." NestJS uses this
    // to know it should parse the body into the DTO.
    const res = await fetch("http://localhost:3000/breweries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // JSON.stringify converts the object into a JSON string ({"name":"Fat Tire"})
      // — HTTP bodies are text, not JS objects.
      body: JSON.stringify({ name: name }),
    });

    // Reads the response body and parses it from a JSON string back into an
    // object. This is the row your service returned via RETURNING.
    const created = await res.json();
    setMessage(`Created brewery: ${created.name}`);

    // Clears the state, which empties the input box
    // (the input shows whatever `name` is, see value={name} below).
    setName("");
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
