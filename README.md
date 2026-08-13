# DevGraph — Developer Knowledge & Skill Explorer

> A web application backed by CognoDB to model and explore relationships between developers, their skills, projects, and technologies.

## Why a Graph Database?

Graph databases are a natural fit for this domain because developer data is inherently relational in a **many-to-many, multi-hop traversal** pattern:

- A developer knows many skills; a skill is known by many developers.
- A project uses many technologies; technologies are related to each other.
- Finding "developers with similar tech stack trajectories" requires traversing multi-hop relationships across nodes.

In a relational database, multi-hop queries require multiple `JOIN` statements across bridge tables and self-referencing tables. In CognoDB via openCypher, graph traversals are concise and natural:

```cypher
MATCH (d:Developer {id: $id})-[:BUILT]->(:Project)-[:USES]->(t:Technology)
      -[:RELATED_TO]->(adj:Technology)<-[:USES]-(:Project)<-[:BUILT]-(expert:Developer)
WHERE expert.id <> $id
RETURN expert, collect(DISTINCT adj.name) AS bridgeTechs
ORDER BY count(*) DESC LIMIT 5
```

## Graph Model

### Node Labels

| Label | Key Properties |
|---|---|
| `Developer` | `id`, `name`, `bio`, `location`, `avatarUrl`, `yearsExp` |
| `Skill` | `id`, `name`, `category` (`language` \| `framework` \| `tool` \| `concept`) |
| `Project` | `id`, `name`, `description`, `url`, `year` |
| `Technology` | `id`, `name`, `domain` (`frontend` \| `backend` \| `infra` \| `data`) |
| `Company` | `id`, `name`, `industry` |

### Relationship Types

| Relationship | Direction | Properties |
|---|---|---|
| `KNOWS` | Developer → Skill | `level` (beginner/intermediate/expert), `since` (year) |
| `BUILT` | Developer → Project | `role` (solo/lead/contributor), `year` |
| `USES` | Project → Technology | `primary` (boolean) |
| `FOR` | Project → Company | — |
| `RELATED_TO` | Technology → Technology | `strength` (0–1) |

```
(Developer)-[:KNOWS]──>(Skill)
(Developer)-[:BUILT]──>(Project)-[:USES]──>(Technology)
                       (Project)-[:FOR]───>(Company)
                    (Technology)-[:RELATED_TO]──>(Technology)
```

## Important Queries

### 1. Developer Profile (2-hop traversal)

Fetches a developer with all their skills and projects including each project's technologies in a single Cypher query.

### 2. Similar Developers via Shared Skills (3-hop)

`Developer → Skill ← Developer` — finds peers by counting shared skill nodes.

### 3. "Who Works Like Me?" (5-hop — graph showcase)

`Developer → Project → Technology → RELATED_TO → Technology ← Project ← Developer` — finds developers who use technologies adjacent to yours.

### 4. Skill Ecosystem (variable-length traversal)

`RELATED_TO*1..2` — walks up to two hops across related technologies from a skill's ecosystem.

## Setup

### Prerequisites

- Node.js 18+
- CognoDB instance exposing openCypher over Bolt

### Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
COGNODB_URI=bolt://localhost:7687
COGNODB_USERNAME=neo4j
COGNODB_PASSWORD=your_password_here
```

### Install Dependencies

```bash
npm install
```

### Seed the Database

```bash
npm run seed
```

This creates uniqueness constraints and loads nodes and relationships into CognoDB. Safe to re-run (uses `MERGE`).

### Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | CognoDB (openCypher over Bolt) |
| DB Driver | `neo4j-driver` (official Bolt driver) |

## Project Structure

```
src/
├── app/
│   ├── api/                    # Server-only route handlers
│   │   ├── developers/         # GET /api/developers
│   │   │   └── [id]/           # GET /api/developers/:id
│   │   │       └── related/    # GET /api/developers/:id/related
│   │   ├── skills/             # GET /api/skills
│   │   │   └── [id]/ecosystem/ # GET /api/skills/:id/ecosystem
│   │   └── search/             # GET /api/search?q=
│   ├── developers/[id]/        # Profile page
│   ├── explore/                # Skill ecosystem explorer
│   ├── globals.css             # Design system
│   ├── layout.tsx              # Root layout + nav
│   └── page.tsx                # Developer list page
├── components/                 # React UI components
├── hooks/                      # useFetch hook
└── lib/
    ├── api.ts                  # Client-side fetch helpers
    ├── neo4j.ts                # CognoDB driver singleton (server-only)
    └── types.ts                # Shared TypeScript interfaces
scripts/
└── seed.ts                     # CognoDB seed script
```
