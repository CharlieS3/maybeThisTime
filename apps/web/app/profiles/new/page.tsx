/*
To add a new profile.
*/

// "use client" means this component runs in the browser instead of on the server
"use client";

// useState is a React function. It returns (for example):
//    firstName — the current value (starts as "")
//    setFirstName — a function to change it

import { useState } from "react";

export default function NewProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    // fetch(...) — the browser sends an HTTP request to the NestJS API. await pauses here until the response arrives.
    // method: "Post" tells use where to to route to in Nest
    // headers: {...} — tells the server "the body is JSON." NestJS uses this to know it should parse the body the DTO
    const res = await fetch("http://localhost:3000/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: firstName }), //  JSON.stringify converts the object into a JSON string ({"firstName":"Bob"}) — HTTP bodies are text, not JS objects.
    });

    // reads the response body and parses it from JSON string back into an object. This is the row your service returned via RETURNING
    const created = await res.json();
    setMessage(`Created profile: ${created.firstName}`);

    //clears the state, which empties the input box
    setFirstName("");
  }

  return (
    <div>
      <h1>New Profile</h1>
      <input
        value={firstName}
        //onChange={...} — "run this function every time the input's content changes" (each keystroke)
        // (e) => ... — an arrow function; e is the event object React hands you, describing what happened.
        // e.target.value — whatever text is currently in that input.
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First name" //What shows up when no name is entered
      />
      <button onClick={handleSubmit}>Create</button>
      <p>{message}</p>
    </div>
  );
}

// http://localhost:3001/profiles/new
