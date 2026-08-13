export interface Developer {
  id: string;
  name: string;
  bio: string;
  location: string;
  avatarUrl: string;
  yearsExp: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'concept';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  year: number;
}

export interface Technology {
  id: string;
  name: string;
  domain: 'frontend' | 'backend' | 'infra' | 'data';
}

export interface Company {
  id: string;
  name: string;
  industry: string;
}

export interface DeveloperSkill extends Skill {
  level: 'beginner' | 'intermediate' | 'expert';
  since: number;
}

export interface DeveloperProject extends Project {
  role: 'solo' | 'lead' | 'contributor';
  company: Company | null;
  technologies: Technology[];
}

export interface DeveloperListResponse {
  developers: Developer[];
}

export interface DeveloperProfileResponse {
  developer: Developer;
  skills: DeveloperSkill[];
  projects: DeveloperProject[];
}

export interface RelatedDevelopersResponse {
  skillPeers: (Developer & { sharedSkills: string[]; sharedCount: number })[];
  techPeers: (Developer & { bridgeTechs: string[]; relevance: number })[];
}

export interface SkillsListResponse {
  skills: Skill[];
}

export interface SkillEcosystemResponse {
  skill: Skill;
  developers: (Developer & { level: string })[];
  technologies: (Technology & { devCount: number })[];
  relatedTechnologies: (Technology & { weight: number })[];
}

export interface SearchResponse {
  query: string;
  developers: Developer[];
  skills: Skill[];
  technologies: Technology[];
}

export type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
