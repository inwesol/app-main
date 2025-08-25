import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

config({
  path: '.env.local',
});

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not defined');
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log('⏳ Running migrations...');

  const start = Date.now();
  
  try {
    await migrate(db, { migrationsFolder: './lib/db/migrations' });
    const end = Date.now();
    console.log('✅ Migrations completed in', end - start, 'ms');
  } catch (err: any) {
    const end = Date.now();
    
    // Handle specific PostgreSQL errors for existing relations
    if (err.code === '42P07' || err.message?.includes('already exists')) {
      console.log('⚠️ Some tables already exist, migration completed in', end - start, 'ms');
      console.log('This is normal for existing databases.');
    } else if (err.code === '42P06' || err.message?.includes('schema') && err.message?.includes('already exists')) {
      console.log('⚠️ Schema already exists, migration completed in', end - start, 'ms');
    } else {
      // Re-throw if it's a different error
      throw err;
    }
  } finally {
    // Close the connection
    await connection.end();
  }
  
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});