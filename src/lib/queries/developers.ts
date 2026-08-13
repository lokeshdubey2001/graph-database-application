import { executeQuery } from '@/lib/neo4j';
import type {
  Developer,
  DeveloperSkill,
  DeveloperProject,
  DeveloperProfileResponse,
  RelatedDevelopersResponse,
} from '@/lib/types';

function extractInteger(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'object' && 'toNumber' in val && typeof (val as { toNumber: () => number }).toNumber === 'function') {
    return (val as { toNumber: () => number }).toNumber();
  }
  return Number(val) || 0;
}

export async function getDevelopers(filters?: {
  skill?: string;
  tech?: string;
}): Promise<Developer[]> {
  let cypher = `MATCH (d:Developer)`;
  const params: Record<string, unknown> = {};

  if (filters?.skill) {
    cypher += ` MATCH (d)-[:KNOWS]->(s:Skill) WHERE toLower(s.id) = toLower($skill) OR toLower(s.name) = toLower($skill)`;
    params.skill = filters.skill;
  }

  if (filters?.tech) {
    cypher += ` MATCH (d)-[:BUILT]->(:Project)-[:USES]->(t:Technology) WHERE toLower(t.id) = toLower($tech) OR toLower(t.name) = toLower($tech)`;
    params.tech = filters.tech;
  }

  cypher += ` RETURN DISTINCT d.id AS id, d.name AS name, d.bio AS bio, d.location AS location, d.avatarUrl AS avatarUrl, d.yearsExp AS yearsExp ORDER BY d.name ASC`;

  const result = await executeQuery(cypher, params);
  return result.records.map((rec) => ({
    id: String(rec.get('id')),
    name: String(rec.get('name')),
    bio: String(rec.get('bio')),
    location: String(rec.get('location')),
    avatarUrl: String(rec.get('avatarUrl')),
    yearsExp: extractInteger(rec.get('yearsExp')),
  }));
}

export async function getDeveloperById(
  id: string
): Promise<DeveloperProfileResponse | null> {
  const cypher = `
    MATCH (d:Developer {id: $id})
    OPTIONAL MATCH (d)-[k:KNOWS]->(s:Skill)
    OPTIONAL MATCH (d)-[b:BUILT]->(p:Project)
    OPTIONAL MATCH (p)-[u:USES]->(t:Technology)
    OPTIONAL MATCH (p)-[:FOR]->(c:Company)
    RETURN d,
           collect(DISTINCT {
             id: s.id,
             name: s.name,
             category: s.category,
             level: k.level,
             since: k.since
           }) AS skills,
           collect(DISTINCT {
             id: p.id,
             name: p.name,
             description: p.description,
             url: p.url,
             year: p.year,
             role: b.role,
             company: c,
             technologies: collect(DISTINCT t)
           }) AS rawProjects
  `;

  const result = await executeQuery(cypher, { id });
  if (result.records.length === 0) return null;

  const rec = result.records[0];
  const dNode = rec.get('d');
  if (!dNode) return null;

  const developer: Developer = {
    id: String(dNode.properties.id),
    name: String(dNode.properties.name),
    bio: String(dNode.properties.bio),
    location: String(dNode.properties.location),
    avatarUrl: String(dNode.properties.avatarUrl),
    yearsExp: extractInteger(dNode.properties.yearsExp),
  };

  const skillsResult = await executeQuery(
    `MATCH (d:Developer {id: $id})-[k:KNOWS]->(s:Skill)
     RETURN s.id AS id, s.name AS name, s.category AS category, k.level AS level, k.since AS since
     ORDER BY s.name ASC`,
    { id }
  );

  const skills: DeveloperSkill[] = skillsResult.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    category: r.get('category'),
    level: r.get('level'),
    since: extractInteger(r.get('since')),
  }));

  const projectsResult = await executeQuery(
    `MATCH (d:Developer {id: $id})-[b:BUILT]->(p:Project)
     OPTIONAL MATCH (p)-[:FOR]->(c:Company)
     OPTIONAL MATCH (p)-[u:USES]->(t:Technology)
     RETURN p.id AS id, p.name AS name, p.description AS description, p.url AS url, p.year AS year, b.role AS role,
            c.id AS compId, c.name AS compName, c.industry AS compIndustry,
            collect(DISTINCT { id: t.id, name: t.name, domain: t.domain }) AS techs
     ORDER BY p.year DESC`,
    { id }
  );

  const projects: DeveloperProject[] = projectsResult.records.map((r) => {
    const compId = r.get('compId');
    const company = compId
      ? {
          id: String(compId),
          name: String(r.get('compName')),
          industry: String(r.get('compIndustry')),
        }
      : null;

    const rawTechs = (r.get('techs') || []) as { id?: string; name?: string; domain?: 'frontend' | 'backend' | 'infra' | 'data' }[];
    const technologies = rawTechs
      .filter((t) => t && t.id)
      .map((t) => ({
        id: String(t.id),
        name: String(t.name),
        domain: t.domain || 'backend',
      }));

    return {
      id: String(r.get('id')),
      name: String(r.get('name')),
      description: String(r.get('description')),
      url: String(r.get('url')),
      year: extractInteger(r.get('year')),
      role: r.get('role'),
      company,
      technologies,
    };
  });

  return { developer, skills, projects };
}

export async function getRelatedDevelopers(
  id: string
): Promise<RelatedDevelopersResponse> {
  const skillPeersResult = await executeQuery(
    `MATCH (d:Developer {id: $id})-[:KNOWS]->(s:Skill)<-[:KNOWS]-(peer:Developer)
     WHERE peer.id <> $id
     WITH peer, collect(DISTINCT s.name) AS sharedSkills, count(DISTINCT s) AS sharedCount
     RETURN peer.id AS id, peer.name AS name, peer.bio AS bio, peer.location AS location,
            peer.avatarUrl AS avatarUrl, peer.yearsExp AS yearsExp, sharedSkills, sharedCount
     ORDER BY sharedCount DESC LIMIT 5`,
    { id }
  );

  const skillPeers = skillPeersResult.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    bio: String(r.get('bio')),
    location: String(r.get('location')),
    avatarUrl: String(r.get('avatarUrl')),
    yearsExp: extractInteger(r.get('yearsExp')),
    sharedSkills: (r.get('sharedSkills') || []) as string[],
    sharedCount: extractInteger(r.get('sharedCount')),
  }));

  const techPeersResult = await executeQuery(
    `MATCH (d:Developer {id: $id})-[:BUILT]->(:Project)-[:USES]->(t:Technology)
            -[:RELATED_TO]->(adj:Technology)<-[:USES]-(:Project)<-[:BUILT]-(peer:Developer)
     WHERE peer.id <> $id
     WITH peer, collect(DISTINCT adj.name) AS bridgeTechs, count(DISTINCT adj) AS relevance
     RETURN peer.id AS id, peer.name AS name, peer.bio AS bio, peer.location AS location,
            peer.avatarUrl AS avatarUrl, peer.yearsExp AS yearsExp, bridgeTechs, relevance
     ORDER BY relevance DESC LIMIT 5`,
    { id }
  );

  const techPeers = techPeersResult.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    bio: String(r.get('bio')),
    location: String(r.get('location')),
    avatarUrl: String(r.get('avatarUrl')),
    yearsExp: extractInteger(r.get('yearsExp')),
    bridgeTechs: (r.get('bridgeTechs') || []) as string[],
    relevance: extractInteger(r.get('relevance')),
  }));

  return { skillPeers, techPeers };
}
