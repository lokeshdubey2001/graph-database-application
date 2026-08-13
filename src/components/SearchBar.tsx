'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  selectedSkill: string;
  onSkillChange: (skill: string) => void;
  selectedTech: string;
  onTechChange: (tech: string) => void;
  skills: string[];
  techs: string[];
}

export function SearchBar({
  query,
  onQueryChange,
  selectedSkill,
  onSkillChange,
  selectedTech,
  onTechChange,
  skills,
  techs,
}: SearchBarProps) {
  const hasFilter = selectedSkill || selectedTech;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Input
          value={query}
          onChange={onQueryChange}
          placeholder="Search by name, bio, or location…"
          icon={<Search size={14} />}
          aria-label="Search developers"
        />

        <Select
          value={selectedSkill}
          onChange={(val) => {
            onSkillChange(val);
            if (val) onTechChange('');
          }}
          placeholder="Skill (KNOWS)"
          options={skills}
          style={{ flex: '0 1 auto', minWidth: '160px' }}
          aria-label="Filter by skill"
        />

        <Select
          value={selectedTech}
          onChange={(val) => {
            onTechChange(val);
            if (val) onSkillChange('');
          }}
          placeholder="Technology (USES)"
          options={techs}
          style={{ flex: '0 1 auto', minWidth: '180px' }}
          aria-label="Filter by technology"
        />
      </div>

      {hasFilter && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Active filter:</span>
            {selectedSkill && (
              <code className="mono" style={{ color: 'var(--accent)' }}>
                {'(Developer)-[:KNOWS]->(:Skill {"name":"' + selectedSkill + '"})'}
              </code>
            )}
            {selectedTech && (
              <code className="mono" style={{ color: '#34d399' }}>
                {'(Developer)-[:BUILT]->(:Project)-[:USES]->(:Technology {"name":"' + selectedTech + '"})'}
              </code>
            )}
          </span>
          <Button
            variant="ghost"
            onClick={() => { onSkillChange(''); onTechChange(''); }}
            style={{ padding: '3px 8px', fontSize: '12px' }}
            aria-label="Clear filter"
          >
            <X size={12} />
            <span>Clear</span>
          </Button>
        </div>
      )}
    </div>
  );
}
