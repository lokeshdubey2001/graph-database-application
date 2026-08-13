import type {
  DeveloperListResponse,
  DeveloperProfileResponse,
  RelatedDevelopersResponse,
  SkillsListResponse,
  SkillEcosystemResponse,
  SearchResponse,
} from './types';

const BASE = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  developers: {
    list: (params?: { skill?: string; tech?: string }) => {
      const qs = new URLSearchParams();
      if (params?.skill) qs.set('skill', params.skill);
      if (params?.tech) qs.set('tech', params.tech);
      const query = qs.toString() ? `?${qs}` : '';
      return fetchJson<DeveloperListResponse>(`${BASE}/developers${query}`);
    },
    get: (id: string) =>
      fetchJson<DeveloperProfileResponse>(`${BASE}/developers/${id}`),
    related: (id: string) =>
      fetchJson<RelatedDevelopersResponse>(`${BASE}/developers/${id}/related`),
  },
  skills: {
    list: () => fetchJson<SkillsListResponse>(`${BASE}/skills`),
    ecosystem: (id: string) =>
      fetchJson<SkillEcosystemResponse>(`${BASE}/skills/${id}/ecosystem`),
  },
  search: (q: string) =>
    fetchJson<SearchResponse>(`${BASE}/search?q=${encodeURIComponent(q)}`),
};
