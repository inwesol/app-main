import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
import * as schema from '../lib/db/schema'; // Import your schema

config({
  path: '.env.local',
});

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is not defined');
}

// Create the connection
const connection = postgres(process.env.POSTGRES_URL);

// Create and export the drizzle database instance
export const db = drizzle(connection, { schema });

// Export your tables from schema
export * from '../lib/db/schema';
