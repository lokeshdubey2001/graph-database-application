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
     RETURN t.id AS id, t.name AS name, t.domain AS domain, d.id AS devId`,
    { skillId: skill.id }
  );

  const techDevsMap = new Map<string, { tech: { id: string; name: string; domain: 'frontend' | 'backend' | 'infra' | 'data' }; devs: Set<string> }>();
  for (const r of techsRes.records) {
    const techId = String(r.get('id'));
    if (!techDevsMap.has(techId)) {
      techDevsMap.set(techId, {
        tech: {
          id: techId,
          name: String(r.get('name')),
          domain: r.get('domain'),
        },
        devs: new Set(),
      });
    }
    techDevsMap.get(techId)?.devs.add(String(r.get('devId')));
  }

  const technologies = Array.from(techDevsMap.values())
    .map((item) => ({
      ...item.tech,
      devCount: item.devs.size,
    }))
    .sort((a, b) => b.devCount - a.devCount)
    .slice(0, 10);

  const relTechsRes = await executeQuery(
    `MATCH (s:Skill {id: $skillId})<-[:KNOWS]-(d:Developer)-[:BUILT]->(:Project)-[:USES]->(t1:Technology)
     MATCH (t1)-[r:RELATED_TO]-(t2:Technology)
     RETURN t2.id AS id, t2.name AS name, t2.domain AS domain, d.id AS devId`,
    { skillId: skill.id }
  );

  const directTechIds = new Set(technologies.map((t) => t.id));
  const relTechsMap = new Map<string, { tech: { id: string; name: string; domain: 'frontend' | 'backend' | 'infra' | 'data' }; devs: Set<string> }>();
  for (const r of relTechsRes.records) {
    const relId = String(r.get('id'));
    if (directTechIds.has(relId)) continue;
    if (!relTechsMap.has(relId)) {
      relTechsMap.set(relId, {
        tech: {
          id: relId,
          name: String(r.get('name')),
          domain: r.get('domain'),
        },
        devs: new Set(),
      });
    }
    relTechsMap.get(relId)?.devs.add(String(r.get('devId')));
  }

  const relatedTechnologies = Array.from(relTechsMap.values())
    .map((item) => ({
      ...item.tech,
      weight: item.devs.size,
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5);

  return {
    skill,
    developers,
    technologies,
    relatedTechnologies,
  };
}
