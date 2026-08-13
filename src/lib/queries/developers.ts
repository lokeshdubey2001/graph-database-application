import { executeQuery } from '@/lib/neo4j';
import { extractInteger } from '@/lib/utils/record';
import type {
  Developer,
  DeveloperSkill,
  DeveloperProject,
  DeveloperProfileResponse,
  RelatedDevelopersResponse,
  CompanyPeersResponse,
} from '@/lib/types';

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
  const devResult = await executeQuery(
    `MATCH (d:Developer {id: $id})
     RETURN d.id AS id, d.name AS name, d.bio AS bio, d.location AS location,
            d.avatarUrl AS avatarUrl, d.yearsExp AS yearsExp`,
    { id }
  );

  if (devResult.records.length === 0) return null;
  const devRec = devResult.records[0];

  const developer: Developer = {
    id: String(devRec.get('id')),
    name: String(devRec.get('name')),
    bio: String(devRec.get('bio')),
    location: String(devRec.get('location')),
    avatarUrl: String(devRec.get('avatarUrl')),
    yearsExp: extractInteger(devRec.get('yearsExp')),
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
     OPTIONAL MATCH (p)-[:USES]->(t:Technology)
     WITH p, b, c, collect(DISTINCT {id: t.id, name: t.name, domain: t.domain}) AS technologies
     RETURN p.id AS id, p.name AS name, p.description AS description, p.url AS url,
            p.year AS year, b.role AS role,
            c.id AS compId, c.name AS compName, c.industry AS compIndustry,
            technologies
     ORDER BY p.year DESC`,
    { id }
  );

  const projects: DeveloperProject[] = projectsResult.records.map((r) => {
    const compId = r.get('compId');
    const rawTechs: Array<{ id: unknown; name: unknown; domain: unknown }> = r.get('technologies') ?? [];

    return {
      id: String(r.get('id')),
      name: String(r.get('name')),
      description: String(r.get('description')),
      url: String(r.get('url')),
      year: extractInteger(r.get('year')),
      role: r.get('role'),
      company: compId
        ? {
            id: String(compId),
            name: String(r.get('compName')),
            industry: String(r.get('compIndustry')),
          }
        : null,
      technologies: rawTechs
        .filter((t) => t.id !== null && t.id !== undefined)
        .map((t) => ({
          id: String(t.id),
          name: String(t.name),
          domain: t.domain as 'frontend' | 'backend' | 'infra' | 'data',
        })),
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
     RETURN peer.id AS id, peer.name AS name, peer.bio AS bio, peer.location AS location,
            peer.avatarUrl AS avatarUrl, peer.yearsExp AS yearsExp, s.name AS skillName`,
    { id }
  );

  const skillPeersMap = new Map<string, { peer: Developer; sharedSkills: Set<string> }>();
  for (const r of skillPeersResult.records) {
    const peerId = String(r.get('id'));
    if (!skillPeersMap.has(peerId)) {
      skillPeersMap.set(peerId, {
        peer: {
          id: peerId,
          name: String(r.get('name')),
          bio: String(r.get('bio')),
          location: String(r.get('location')),
          avatarUrl: String(r.get('avatarUrl')),
          yearsExp: extractInteger(r.get('yearsExp')),
        },
        sharedSkills: new Set(),
      });
    }
    skillPeersMap.get(peerId)?.sharedSkills.add(String(r.get('skillName')));
  }

  const skillPeers = Array.from(skillPeersMap.values())
    .map((item) => ({
      ...item.peer,
      sharedSkills: Array.from(item.sharedSkills),
      sharedCount: item.sharedSkills.size,
    }))
    .sort((a, b) => b.sharedCount - a.sharedCount)
    .slice(0, 5);

  const techPeersResult = await executeQuery(
    `MATCH (d:Developer {id: $id})-[:BUILT]->(:Project)-[:USES]->(t:Technology)
            -[:RELATED_TO]->(adj:Technology)<-[:USES]-(:Project)<-[:BUILT]-(peer:Developer)
     WHERE peer.id <> $id
     RETURN peer.id AS id, peer.name AS name, peer.bio AS bio, peer.location AS location,
            peer.avatarUrl AS avatarUrl, peer.yearsExp AS yearsExp, adj.name AS bridgeTech`,
    { id }
  );

  const techPeersMap = new Map<string, { peer: Developer; bridgeTechs: Set<string> }>();
  for (const r of techPeersResult.records) {
    const peerId = String(r.get('id'));
    if (!techPeersMap.has(peerId)) {
      techPeersMap.set(peerId, {
        peer: {
          id: peerId,
          name: String(r.get('name')),
          bio: String(r.get('bio')),
          location: String(r.get('location')),
          avatarUrl: String(r.get('avatarUrl')),
          yearsExp: extractInteger(r.get('yearsExp')),
        },
        bridgeTechs: new Set(),
      });
    }
    techPeersMap.get(peerId)?.bridgeTechs.add(String(r.get('bridgeTech')));
  }

  const techPeers = Array.from(techPeersMap.values())
    .map((item) => ({
      ...item.peer,
      bridgeTechs: Array.from(item.bridgeTechs),
      relevance: item.bridgeTechs.size,
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);

  return { skillPeers, techPeers };
}

export async function getCompanyPeers(id: string): Promise<CompanyPeersResponse> {
  const result = await executeQuery(
    `MATCH (d:Developer {id: $id})-[:BUILT]->(:Project)-[:FOR]->(c:Company)<-[:FOR]-(:Project)<-[:BUILT]-(peer:Developer)
     WHERE peer.id <> $id
     RETURN peer.id AS id, peer.name AS name, peer.bio AS bio, peer.location AS location,
            peer.avatarUrl AS avatarUrl, peer.yearsExp AS yearsExp, c.name AS companyName
     ORDER BY peer.name ASC`,
    { id }
  );

  const peersMap = new Map<string, { peer: Developer; companies: Set<string> }>();
  for (const r of result.records) {
    const peerId = String(r.get('id'));
    if (!peersMap.has(peerId)) {
      peersMap.set(peerId, {
        peer: {
          id: peerId,
          name: String(r.get('name')),
          bio: String(r.get('bio')),
          location: String(r.get('location')),
          avatarUrl: String(r.get('avatarUrl')),
          yearsExp: extractInteger(r.get('yearsExp')),
        },
        companies: new Set(),
      });
    }
    peersMap.get(peerId)?.companies.add(String(r.get('companyName')));
  }

  const peers = Array.from(peersMap.values())
    .map((item) => ({
      ...item.peer,
      sharedCompanies: Array.from(item.companies),
      sharedCount: item.companies.size,
    }))
    .sort((a, b) => b.sharedCount - a.sharedCount)
    .slice(0, 5);

  return { companyPeers: peers };
}
