import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

config({ path: '.env.local' });
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool);
