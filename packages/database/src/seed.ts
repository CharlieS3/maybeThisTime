// Simple file to add some data

import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const nameGiven = "please work"

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  // we provide the name but the id is automatically generated because of how we 
  // constructed the table in our sql file.
  const result = await client.query(
    `
    INSERT INTO profiles (first_name)
    VALUES ($1)
    RETURNING *;
    `, // RETURNING * means after insertion return the full row back
    [nameGiven]
  );

  console.log("Created user:", result.rows[0]);

  await client.end();
}

main();

// To run the code:
// From: C://Users//Charl//Desktop//brewery//Code//packages//database
// Run: npx tsx src/seed.ts