import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { Database } from "~/lib/db/schema";
import { config } from 'dotenv';

// Load environment variables
config();

export const dialect = new PostgresDialect({
    pool: new Pool({
  connectionString: process.env.TESTDB_STRING,
  max: 20,
})});

export const db = new Kysely<Database>({
  dialect,
});