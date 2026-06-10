/*
This file needs to run on its own independently to create the db we will use.
Then we can run migrate to create the table(s) and work from there.
*/

// pg is s the PostgreSQL package for Node/TypeScript.
// It lets your TypeScript code connect to PostgreSQL and run SQL.
// Client is the object from pg that represents one connection to PostgreSQL
import { Client } from "pg";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// name of our example database
const DB_NAME = "my_app";

async function main() {
    // Create a connection to PostgreSQL.
    // We connect to the default "postgres" database first,
    const client = new Client({
        host: "localhost",
        port: 5432,
        user: "postgres",
        password: process.env.DB_PASSWORD,
        database: "postgres",
    });

    // Open the connection.
    await client.connect();

    // SELECT 1 means: for every row that matches, just return the value 1
    // pg_database is a PostgreSQL system table/catalog so it holds all the databases
    // We check this list and if we find our database we know it exists and thus return 1
    const result = await client.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [DB_NAME]
    );

    console.log(`result print ${result}`)

    // If the database does not exist creat it
    if (result.rowCount === 0) {
        await client.query(`CREATE DATABASE ${DB_NAME}`);
        console.log(`Created database: ${DB_NAME}`);
    } else {
        console.log(`Database already exists: ${DB_NAME}`);
    }

    // Close the connection.
    await client.end();

}

main();

// To run the code:
// From: C://Users//Charl//Desktop//brewery//Code//packages//database
// Run: npx tsx src/create-db.ts