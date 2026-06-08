/*
This file runs every sql file in order that is in migrations.
If the file has already been run it does not run.
*/

import "dotenv/config";
import { Client } from "pg";
import fs from "node:fs/promises";
import path from "node:path";

async function main() {

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  // process.cwd() means the folder where you ran the command so process.cwd() = packages/database
  // path.join() means we join process.cwd() with "migrations" and thus get the path packages/database/migrations
  const migrationsPath = path.join(process.cwd(), "migrations");

  // Read all file names inside the migrations folder.
  const files = await fs.readdir(migrationsPath);

  // sort the files in the folder and then 
  // loop through the folder looking for files that end in sql
  for (const file of files.sort()) {
    if (!file.endsWith(".sql")) continue;

    // path.join(migrationsPath, file) like above builds the full file path "packages/database/migrations/001_..._table.sql"
    // fs.readFile(..., "utf8") reads the file in that path in normal text
    const sql = await fs.readFile(
      path.join(migrationsPath, file),
      "utf8"
    );

    // run that actual sql file
    await client.query(sql);
    console.log(`Ran ${file}`);
  }

  await client.end();

  console.log("Done");
}

main();

// To run the code:
// From: C://Users//Charl//Desktop//brewery//Code//packages//database
// Run: npx tsx src/migrate.ts