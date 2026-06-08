/*
This is our one shared database access tool.

DatabaseService handles:
"how to send a query to PostgreSQL"

This file acts as our connection file between the backend and the database.
It is the backend’s database connection layer.

Its job is to:

* connect to PostgreSQL
* hold the connection pool (a pool is a reusable group of database connections).
* expose a query method
*/

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {

  //create a pool object we will use to connect to the db
  private pool: Pool;

  // ensure we have the url to connect to the db
  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is missing');
    }

    // allow use now to actually connect to the db
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  // we create a method named "query" 
  // <T extends QueryResultRow = QueryResultRow> means: T represents the shape of a database row and 
  // extends QueryResultRow means: T must be a valid PostgreSQL result row type.
  // = QueryResultRow means: If we do not provide a specific row type, use the default generic row type.
  // This function returns a Promise. When it finishes, the result will be a PostgreSQL query result. The rows inside that result have shape T.
  query<T extends QueryResultRow = QueryResultRow>(sql: string, values?: unknown[]): Promise<QueryResult<T>> {
    // This sends the SQL to PostgreSQL using the connection pool.
    // <T> tells TypeScript: The rows returned from this query should have this shape.
    return this.pool.query<T>(sql, values);
  }

  // When the app stops, close the database pool cleanly.
  async onModuleDestroy() {
    // this.pool.end() means: closes all database connections in the pool.
    await this.pool.end();
  }
}
