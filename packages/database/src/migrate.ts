/*
This file runs every sql file in order that is in migrations.
If the file has already been run it does not run.
*/


import { Client } from "pg";
import fs from "node:fs/promises";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

async function main() {

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();


  // CREATE TABLE IF NOT EXISTS schema_migrations — creates a bookkeeping table the first time; on later runs it already exists
  // We then check that table (schema_migrations) to see which sql files have ran and if they do not exist we run them
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // process.cwd() means the folder where you ran the command so process.cwd() = packages/database
  // path.join() means we join process.cwd() with "migrations" and thus get the path packages/database/migrations
  const migrationsPath = path.join(process.cwd(), "migrations");

  // Read all file names inside the migrations folder.
  const files = await fs.readdir(migrationsPath);

  // sort the files in the folder and then 
  // loop through the folder looking for files that end in sql
  for (const file of files.sort()) {
    if (!file.endsWith(".sql")) continue;

    // See if the file name table and see if the file name exists
    const applied = await client.query(
      "SELECT 1 FROM schema_migrations WHERE filename = $1",
      [file]
    );

    // Any row count greater than 0 is true
    // That means the file exists and we run it.
    if (applied.rowCount && applied.rowCount > 0) {
      console.log(`Skipped ${file} (already applied)`);
      continue;
    }

    // path.join(migrationsPath, file) like above builds the full file path "packages/database/migrations/001_..._table.sql"
    // fs.readFile(..., "utf8") reads the file in that path in normal text
    const sql = await fs.readFile(path.join(migrationsPath, file), "utf8");
    
    // run that actual sql file
    await client.query(sql);
    await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [file]);
    
    console.log(`Ran ${file}`);
  }

  await client.end();

  console.log("Done");
}

main();

// To run the code (MAKE SURE YOU RUN IT EXACTLY LIKE THIS):
// From: cd C://Users//Charl//Desktop//brewery//Code//packages//database
// Run: npx tsx src/migrate.ts