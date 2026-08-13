export default function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--color-text-primary)',
          marginBottom: '1rem',
        }}
      >
        Dev<span style={{ color: 'var(--color-accent-light)' }}>Graph</span>
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
        Scaffold verified ✅ — next step: seed data &amp; API routes.
      </p>
    </div>
  );
}
