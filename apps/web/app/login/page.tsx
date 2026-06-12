/*
Login page.
Sends username + password to the API; on success the API sets the
httpOnly session cookie and we redirect. The page itself never sees
or stores the session id — the browser handles the cookie invisibly.

We need this page now to view most (I think all) of our pages
because they are all blocked by a guard that is checking for logged in users.
Someone can still load the page but their is no data to be found.
*/

"use client";

import { useState } from "react";
// useRouter = Next.js hook for navigating in code (no <a> click needed).
// NOTE: must come from "next/navigation" in the App Router —
// the older "next/router" import will error.
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // The hook gives us a router object; hooks live at the top level,
  // same rule as useState/useEffect.
  const router = useRouter();

  async function handleSubmit() {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // THE key line on this page. Without it the browser silently
        // DISCARDS the Set-Cookie header on cross-origin responses —
        // login would "succeed" but no session would be saved.
        // Pairs with credentials: true on the API's CORS config.
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        // Whatever the real reason (unknown user, wrong password),
        // the API deliberately says only "Invalid credentials" —
        // we just show that. Inputs are kept so the user can retry.
        const err = await res.json();
        const text = Array.isArray(err.message)
          ? err.message.join(", ")
          : err.message;
        setMessage(`Error: ${text}`);
        return;
      }

      // 2xx: the cookie is already stored by the browser at this point.
      // The body also contains the user + their breweries (Option B) —
      // the future brewery-picker will read it. For now: straight on.
      router.push("/breweries");
    } catch {
      setMessage("Error: could not reach the server. Is the API running?");
    }
  }

  return (
    <div>
      <h1>Log in</h1>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleSubmit}>Log in</button>
      <p>{message}</p>
    </div>
  );
}

// http://localhost:3001/login
