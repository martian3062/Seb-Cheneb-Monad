import { PGlite } from '@electric-sql/pglite'

let dbInstance: PGlite | null = null;

export async function getDb() {
  if (!dbInstance) {
    dbInstance = new PGlite('idb://evolet-offline-db');
    // Ensure table exists
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS queued_intents (
        id SERIAL PRIMARY KEY,
        intent TEXT,
        provider TEXT,
        status TEXT DEFAULT 'queued',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return dbInstance;
}

export async function queueIntentLocally(intent: string, provider: string) {
  try {
    const db = await getDb();
    await db.query(
      'INSERT INTO queued_intents (intent, provider) VALUES ($1, $2)',
      [intent, provider]
    );
    console.log('Intent queued to PGLite successfully');
    return true;
  } catch (error) {
    console.error('Failed to queue locally', error);
    return false;
  }
}
