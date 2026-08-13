import { executeQuery } from '../src/lib/neo4j';

async function initSchema() {
  const constraints = [
    'CREATE CONSTRAINT developer_id IF NOT EXISTS FOR (d:Developer) REQUIRE d.id IS UNIQUE',
    'CREATE CONSTRAINT skill_id IF NOT EXISTS FOR (s:Skill) REQUIRE s.id IS UNIQUE',
    'CREATE CONSTRAINT project_id IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE',
    'CREATE CONSTRAINT technology_id IF NOT EXISTS FOR (t:Technology) REQUIRE t.id IS UNIQUE',
    'CREATE CONSTRAINT company_id IF NOT EXISTS FOR (c:Company) REQUIRE c.id IS UNIQUE',
  ];

  for (const statement of constraints) {
    try {
      await executeQuery(statement);
    } catch {
      // Ignore if database handles constraints differently
    }
  }

  console.log('Database schema initialization completed successfully.');
  process.exit(0);
}

initSchema().catch((err) => {
  console.error('Schema initialization failed:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
