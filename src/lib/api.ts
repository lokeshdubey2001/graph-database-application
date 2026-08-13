import type {
  DeveloperListResponse,
  DeveloperProfileResponse,
  RelatedDevelopersResponse,
  CompanyPeersResponse,
  SkillsListResponse,
  TechnologiesListResponse,
  SkillEcosystemResponse,
  TechEcosystemResponse,
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
    companyPeers: (id: string) =>
      fetchJson<CompanyPeersResponse>(`${BASE}/developers/${id}/companies`),
  },
  skills: {
    list: () => fetchJson<SkillsListResponse>(`${BASE}/skills`),
    ecosystem: (id: string) =>
      fetchJson<SkillEcosystemResponse>(`${BASE}/skills/${id}/ecosystem`),
  },
  technologies: {
    list: () => fetchJson<TechnologiesListResponse>(`${BASE}/technologies`),
    ecosystem: (id: string) =>
      fetchJson<TechEcosystemResponse>(`${BASE}/technologies/${id}/ecosystem`),
  },
};
