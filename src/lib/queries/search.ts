import { executeQuery } from '@/lib/neo4j';
import type { SearchResponse } from '@/lib/types';

function extractInteger(val: unknown): number {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'object' && 'toNumber' in val && typeof (val as { toNumber: () => number }).toNumber === 'function') {
    return (val as { toNumber: () => number }).toNumber();
  }
  return Number(val) || 0;
}

export async function searchGraph(q: string): Promise<SearchResponse> {
  const sanitized = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const queryParam = `(?i).*${sanitized}.*`;

  const devsRes = await executeQuery(
    `MATCH (d:Developer)
     WHERE d.name =~ $queryParam OR d.bio =~ $queryParam OR d.location =~ $queryParam
     RETURN d.id AS id, d.name AS name, d.bio AS bio, d.location AS location,
            d.avatarUrl AS avatarUrl, d.yearsExp AS yearsExp
     ORDER BY d.name ASC LIMIT 10`,
    { queryParam }
  );

  const developers = devsRes.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    bio: String(r.get('bio')),
    location: String(r.get('location')),
    avatarUrl: String(r.get('avatarUrl')),
    yearsExp: extractInteger(r.get('yearsExp')),
  }));

  const skillsRes = await executeQuery(
    `MATCH (s:Skill)
     WHERE s.name =~ $queryParam OR s.category =~ $queryParam
     RETURN s.id AS id, s.name AS name, s.category AS category
     ORDER BY s.name ASC LIMIT 10`,
    { queryParam }
  );

  const skills = skillsRes.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    category: r.get('category'),
  }));

  const techsRes = await executeQuery(
    `MATCH (t:Technology)
     WHERE t.name =~ $queryParam OR t.domain =~ $queryParam
     RETURN t.id AS id, t.name AS name, t.domain AS domain
     ORDER BY t.name ASC LIMIT 10`,
    { queryParam }
  );

  const technologies = techsRes.records.map((r) => ({
    id: String(r.get('id')),
    name: String(r.get('name')),
    domain: r.get('domain'),
  }));

  return {
    query: q,
    developers,
    skills,
    technologies,
  };
}
