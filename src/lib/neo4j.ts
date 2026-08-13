import neo4j, { Driver, Session, QueryResult } from 'neo4j-driver';

const uri = process.env.COGNODB_URI || process.env.NEO4J_URI;
const username = process.env.COGNODB_USERNAME || process.env.NEO4J_USERNAME;
const password = process.env.COGNODB_PASSWORD || process.env.NEO4J_PASSWORD;

if (!uri || !username || !password) {
  throw new Error(
    'Missing required environment variables: COGNODB_URI, COGNODB_USERNAME, COGNODB_PASSWORD'
  );
}

const globalForDriver = global as unknown as { _cognoDBDriver?: Driver };

const driver: Driver =
  globalForDriver._cognoDBDriver ??
  neo4j.driver(uri, neo4j.auth.basic(username, password));

if (process.env.NODE_ENV !== 'production') {
  globalForDriver._cognoDBDriver = driver;
}

export default driver;

export function getSession(): Session {
  return driver.session();
}

export async function executeQuery(
  cypher: string,
  params: Record<string, unknown> = {}
): Promise<QueryResult> {
  const session = getSession();
  try {
    const result = await session.run(cypher, params);
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Database query execution failed: ${message}`);
  } finally {
    await session.close();
  }
}

export async function testConnection(): Promise<boolean> {
  const result = await executeQuery('RETURN 1 AS result');
  if (result.records.length > 0) {
    const val = result.records[0].get('result');
    return val.toNumber ? val.toNumber() === 1 : val === 1;
  }
  return false;
}
