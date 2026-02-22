import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.ADMIN) throw new Error('ADMIN env var is not set');

const { databaseUrl } = JSON.parse(env.ADMIN);

const client = postgres(databaseUrl);

export const db = drizzle(client, { schema });
