import { sql } from '@vercel/postgres';

// Database query helper functions

export async function query<T>(
  queryText: string,
  params: unknown[] = []
): Promise<T[]> {
  try {
    const result = await sql.query(queryText, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function queryOne<T>(
  queryText: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(queryText, params);
  return rows[0] || null;
}

export { sql };
