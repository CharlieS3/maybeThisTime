/*
This is our one shared database access tool.

DatabaseService is the backend's database connection layer.
It is the ONLY place in the app that talks to PostgreSQL directly.

Its jobs:
* connect to PostgreSQL
* hold the connection pool (a pool is a reusable group of database connections —
  cheaper than opening a fresh connection for every query)
* expose a query method (for single queries)
* expose a transaction method (for groups of queries that must succeed or fail together)
*/

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {

  // The pool object we use to connect to the db.
  private pool: Pool;

  constructor() {
    // Fail fast at startup if the connection string is missing.
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is missing');
    }

    // Create the pool. Connections are opened lazily as queries come in.
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  // Our "query" method, for normal single queries.
  // <T extends QueryResultRow = QueryResultRow> means:
  //   T represents the shape of a database row,
  //   "extends QueryResultRow" means T must be a valid PostgreSQL result row type,
  //   "= QueryResultRow" means: if no specific row type is given, use the generic default.
  // Returns a Promise that resolves to a PostgreSQL query result whose rows have shape T.
  query<T extends QueryResultRow = QueryResultRow>(sql: string, values?: unknown[]): Promise<QueryResult<T>> {
    // Sends the SQL to PostgreSQL. The pool picks ANY free connection —
    // fine for single queries, not fine for transactions (see below).
    return this.pool.query<T>(sql, values);
  }

  // Our "transaction" method, for multiple queries that must be all-or-nothing
  // (e.g. INSERT a profile AND its membership — never one without the other).
  //
  // Why this exists: a transaction must run on ONE dedicated connection.
  // this.pool.query() may use a different connection each call, so BEGIN could
  // land on one connection and the INSERTs on another — broken. So here we
  // check out a single client and run everything on it.
  //
  // How callers use it: they pass in a function (fn). We hand that function the
  // dedicated client, and it runs its queries with client.query(...).
  //
  // <T> here is the return type of the caller's function (whatever fn returns,
  // transaction returns).
  async transaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
    // Borrow ONE connection from the pool. It is ours alone until released.
    const client = await this.pool.connect();
    try {
      // BEGIN tells PostgreSQL: start a transaction. From here on, nothing is
      // permanent yet — changes are pending.
      await client.query('BEGIN');

      // Run the caller's queries on this same connection.
      const result = await fn(client);

      // COMMIT tells PostgreSQL: everything succeeded, make it all permanent.
      await client.query('COMMIT');
      return result;
    } catch (err) {
      // If ANY query inside fn threw an error, ROLLBACK undoes every pending
      // change from this transaction, as if none of it ever happened.
      await client.query('ROLLBACK');
      // Re-throw so the caller still sees the error.
      throw err;
    } finally {
      // ALWAYS hand the connection back to the pool — success or failure.
      // Forgetting this leaks connections until the pool runs dry.
      client.release();
    }
  }

  // When the app stops, close all connections in the pool cleanly.
  async onModuleDestroy() {
    await this.pool.end();
  }
}