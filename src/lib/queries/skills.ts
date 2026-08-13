import { executeQuery } from '@/lib/neo4j';
import { extractInteger } from '@/lib/utils/record';
import type {
  Skill,
  SkillsListResponse,
  SkillEcosystemResponse,
} from '@/lib/types';

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

export async function getTechnologies(): Promise<{ technologies: Array<{ id: string; name: string; domain: string }> }> {
  const result = await executeQuery(
    `MATCH (t:Technology)
     RETURN t.id AS id, t.name AS name, t.domain AS domain
     ORDER BY t.name ASC`
  );

  const technologies = result.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    domain: String(r.get('domain')),
  }));

  return { technologies };
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

export async function getTechEcosystem(techId: string) {
  const techRes = await executeQuery(
    `MATCH (t:Technology)
     WHERE toLower(t.id) = toLower($techId) OR toLower(t.name) = toLower($techId)
     RETURN t.id AS id, t.name AS name, t.domain AS domain LIMIT 1`,
    { techId }
  );

  if (techRes.records.length === 0) return null;
  const tRec = techRes.records[0];
  const technology = {
    id: String(tRec.get('id')),
    name: String(tRec.get('name')),
    domain: tRec.get('domain'),
  };

  const devsRes = await executeQuery(
    `MATCH (t:Technology {id: $id})<-[:USES]-(p:Project)<-[:BUILT]-(d:Developer)
     RETURN DISTINCT d.id AS id, d.name AS name, d.bio AS bio, d.location AS location,
            d.avatarUrl AS avatarUrl, d.yearsExp AS yearsExp, p.name AS projName`,
    { id: technology.id }
  );

  const developers = devsRes.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    bio: String(r.get('bio')),
    location: String(r.get('location')),
    avatarUrl: String(r.get('avatarUrl')),
    yearsExp: extractInteger(r.get('yearsExp')),
    projectName: String(r.get('projName')),
  }));

  const coTechsRes = await executeQuery(
    `MATCH (t:Technology {id: $id})<-[:USES]-(p:Project)-[:USES]->(coTech:Technology)
     WHERE coTech.id <> $id
     RETURN coTech.id AS id, coTech.name AS name, coTech.domain AS domain, p.id AS projId`,
    { id: technology.id }
  );

  const coTechMap = new Map<string, { tech: { id: string; name: string; domain: string }; projects: Set<string> }>();
  for (const r of coTechsRes.records) {
    const coId = String(r.get('id'));
    if (!coTechMap.has(coId)) {
      coTechMap.set(coId, {
        tech: {
          id: coId,
          name: String(r.get('name')),
          domain: String(r.get('domain')),
        },
        projects: new Set(),
      });
    }
    coTechMap.get(coId)?.projects.add(String(r.get('projId')));
  }

  const coTechnologies = Array.from(coTechMap.values())
    .map((item) => ({
      ...item.tech,
      projectCount: item.projects.size,
    }))
    .sort((a, b) => b.projectCount - a.projectCount);

  const relTechsRes = await executeQuery(
    `MATCH (t:Technology {id: $id})-[r:RELATED_TO]-(relTech:Technology)
     RETURN relTech.id AS id, relTech.name AS name, relTech.domain AS domain, r.strength AS strength`,
    { id: technology.id }
  );

  const relatedTechnologies = relTechsRes.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    domain: String(r.get('domain')),
    strength: extractInteger(r.get('strength')),
  }));

  return {
    technology,
    developers,
    coTechnologies,
    relatedTechnologies,
  };
}
