import fs from 'fs';
import path from 'path';
import { executeQuery } from '../src/lib/neo4j';

async function seedDatabase() {
  console.log('Seeding CognoDB graph database...');

  const dataPath = path.resolve(process.cwd(), 'data/seed-data.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const seedData = JSON.parse(rawData);

  const {
    developers,
    skills,
    technologies,
    companies,
    projects,
    devSkills,
    devProjects,
    projTechs,
    projCompanies,
    techRelations,
  } = seedData;

  await executeQuery(
    `UNWIND $developers AS d
     MERGE (dev:Developer {id: d.id})
     SET dev.name = d.name,
         dev.bio = d.bio,
         dev.location = d.location,
         dev.avatarUrl = d.avatarUrl,
         dev.yearsExp = d.yearsExp`,
    { developers }
  );

  await executeQuery(
    `UNWIND $skills AS s
     MERGE (sk:Skill {id: s.id})
     SET sk.name = s.name,
         sk.category = s.category`,
    { skills }
  );

  await executeQuery(
    `UNWIND $technologies AS t
     MERGE (tech:Technology {id: t.id})
     SET tech.name = t.name,
         tech.domain = t.domain`,
    { technologies }
  );

  await executeQuery(
    `UNWIND $companies AS c
     MERGE (comp:Company {id: c.id})
     SET comp.name = c.name,
         comp.industry = c.industry`,
    { companies }
  );

  await executeQuery(
    `UNWIND $projects AS p
     MERGE (proj:Project {id: p.id})
     SET proj.name = p.name,
         proj.description = p.description,
         proj.url = p.url,
         proj.year = p.year`,
    { projects }
  );

  await executeQuery(
    `UNWIND $devSkills AS ds
     MATCH (d:Developer {id: ds.devId})
     MATCH (s:Skill {id: ds.skillId})
     MERGE (d)-[r:KNOWS]->(s)
     SET r.level = ds.level,
         r.since = ds.since`,
    { devSkills }
  );

  await executeQuery(
    `UNWIND $devProjects AS dp
     MATCH (d:Developer {id: dp.devId})
     MATCH (p:Project {id: dp.projId})
     MERGE (d)-[r:BUILT]->(p)
     SET r.role = dp.role,
         r.year = dp.year`,
    { devProjects }
  );

  await executeQuery(
    `UNWIND $projTechs AS pt
     MATCH (p:Project {id: pt.projId})
     MATCH (t:Technology {id: pt.techId})
     MERGE (p)-[r:USES]->(t)
     SET r.primary = pt.primary`,
    { projTechs }
  );

  await executeQuery(
    `UNWIND $projCompanies AS pc
     MATCH (p:Project {id: pc.projId})
     MATCH (c:Company {id: pc.compId})
     MERGE (p)-[:FOR]->(c)`,
    { projCompanies }
  );

  await executeQuery(
    `UNWIND $techRelations AS tr
     MATCH (t1:Technology {id: tr.fromId})
     MATCH (t2:Technology {id: tr.toId})
     MERGE (t1)-[r:RELATED_TO]->(t2)
     SET r.strength = tr.strength`,
    { techRelations }
  );

  console.log('Seed completed successfully!');
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('Seed failed:', err instanceof Error ? err.message : String(err));
  process.exit(1);
});
