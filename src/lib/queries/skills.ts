import { executeQuery } from '@/lib/neo4j';
import type {
  Skill,
  SkillsListResponse,
  SkillEcosystemResponse,
} from '@/lib/types';

function extractInteger(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'object' && 'toNumber' in val && typeof (val as { toNumber: () => number }).toNumber === 'function') {
    return (val as { toNumber: () => number }).toNumber();
  }
  return Number(val) || 0;
}

export async function getSkills(): Promise<SkillsListResponse> {
  const result = await executeQuery(
    `MATCH (s:Skill)
     RETURN s.id AS id, s.name AS name, s.category AS category
     ORDER BY s.name ASC`
  );

  const skills: Skill[] = result.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    category: r.get('category'),
  }));

  return { skills };
}

export async function getSkillEcosystem(
  id: string
): Promise<SkillEcosystemResponse | null> {
  const skillRes = await executeQuery(
    `MATCH (s:Skill)
     WHERE toLower(s.id) = toLower($id) OR toLower(s.name) = toLower($id)
     RETURN s.id AS id, s.name AS name, s.category AS category LIMIT 1`,
    { id }
  );

  if (skillRes.records.length === 0) return null;
  const sRec = skillRes.records[0];
  const skill: Skill = {
    id: String(sRec.get('id')),
    name: String(sRec.get('name')),
    category: sRec.get('category'),
  };

  const devsRes = await executeQuery(
    `MATCH (s:Skill {id: $skillId})<-[k:KNOWS]-(d:Developer)
     RETURN d.id AS id, d.name AS name, d.bio AS bio, d.location AS location,
            d.avatarUrl AS avatarUrl, d.yearsExp AS yearsExp, k.level AS level
     ORDER BY d.name ASC`,
    { skillId: skill.id }
  );

  const developers = devsRes.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    bio: String(r.get('bio')),
    location: String(r.get('location')),
    avatarUrl: String(r.get('avatarUrl')),
    yearsExp: extractInteger(r.get('yearsExp')),
    level: String(r.get('level')),
  }));

  const techsRes = await executeQuery(
    `MATCH (s:Skill {id: $skillId})<-[:KNOWS]-(d:Developer)-[:BUILT]->(:Project)-[:USES]->(t:Technology)
     WITH t, count(DISTINCT d) AS devCount
     RETURN t.id AS id, t.name AS name, t.domain AS domain, devCount
     ORDER BY devCount DESC LIMIT 10`,
    { skillId: skill.id }
  );

  const technologies = techsRes.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    domain: r.get('domain'),
    devCount: extractInteger(r.get('devCount')),
  }));

  const relTechsRes = await executeQuery(
    `MATCH (s:Skill {id: $skillId})<-[:KNOWS]-(d:Developer)-[:BUILT]->(:Project)-[:USES]->(t1:Technology)
     MATCH (t1)-[r:RELATED_TO*1..2]-(t2:Technology)
     WHERE NOT (s:Skill {id: $skillId})<-[:KNOWS]-(d)-[:BUILT]->(:Project)-[:USES]->(t2)
     WITH t2, count(DISTINCT d) AS weight
     RETURN t2.id AS id, t2.name AS name, t2.domain AS domain, weight
     ORDER BY weight DESC LIMIT 5`,
    { skillId: skill.id }
  );

  const relatedTechnologies = relTechsRes.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    domain: r.get('domain'),
    weight: extractInteger(r.get('weight')),
  }));

  return {
    skill,
    developers,
    technologies,
    relatedTechnologies,
  };
}
