export type ScaffoldFile = { path: string; content: string };

export function generateScaffold(params: {
  productName: string;
  requirementsMd: string;
  todosMd: string;
  readmeMd: string;
}): ScaffoldFile[] {
  const { productName, requirementsMd, todosMd, readmeMd } = params;

  const rootReadme = readmeMd || `# ${productName}\n\n${requirementsMd}\n\n${todosMd}`;

  const dockerCompose = `version: '3.8'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql+psycopg2://app:app@db:5432/app
      APP_ENV: development
      CORS_ORIGINS: http://localhost:3000
    depends_on:
      - db
    ports:
      - "8000:8000"

  migrate:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: bash -lc "alembic upgrade head"
    environment:
      DATABASE_URL: postgresql+psycopg2://app:app@db:5432/app
    depends_on:
      - db

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_BACKEND_URL: http://localhost:8000
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  db-data:
`;

  const ciWorkflow = `name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Frontend install+lint
        working-directory: frontend
        run: |
          npm ci || npm install
          npm run lint --if-present
      - name: Backend setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Backend install+test
        working-directory: backend
        run: |
          python -m venv .venv
          . .venv/bin/activate
          pip install -U pip
          pip install -r requirements.txt
          pytest -q
`;

  const fePackage = `{
  "name": "${productName.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase()}-frontend",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "eslint": "^9",
    "@storybook/nextjs": "^8",
    "storybook": "^8"
  }
}
`;

  const feDockerfile = `FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm install || true
COPY . .
EXPOSE 3000
CMD ["npm","run","dev"]
`;

  const feNextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
`;

  const fePage = `export default function Home(){
  return (<main style={{padding:20}}>
    <h1>${productName}</h1>
    <p>Frontend scaffold (Next.js + Storybook)。</p>
  </main>);
}
`;

  const feStorybookMain = `import type { StorybookConfig } from '@storybook/nextjs';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/nextjs',
    options: {}
  }
};
export default config;
`;

  const feStorybookPreview = `import type { Preview } from '@storybook/react';
const preview: Preview = { parameters: { layout: 'centered' } };
export default preview;
`;

  const beDockerfile = `FROM python:3.11-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY requirements.txt ./
RUN pip install -U pip && pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["bash","-lc","uvicorn app.main:app --host 0.0.0.0 --port 8000"]
`;

  const beRequirements = `fastapi==0.115.5
strawberry-graphql[fastapi]==0.246.1
uvicorn==0.32.0
SQLAlchemy==2.0.36
alembic==1.14.0
psycopg2-binary==2.9.10
pytest==8.3.3
`;

  const beMain = `from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from app.interfaces.graphql.schema import schema

app = FastAPI()
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

@app.get("/health")
def health():
    return {"status": "ok"}
`;

  const beSchema = `import strawberry

@strawberry.type
class Query:
    hello: str = "world"

schema = strawberry.Schema(query=Query)
`;

  const beDDDInit = '';

  const beAlembicIni = `[alembic]
script_location = alembic
sqlalchemy.url = ${process.env.DATABASE_URL || 'postgresql+psycopg2://app:app@db:5432/app'}
`; // placeholder, Alembic env.py overrides

  const beAlembicEnv = `from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
import os

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = None

def get_url():
    return os.getenv('DATABASE_URL', 'postgresql+psycopg2://app:app@db:5432/app')

def run_migrations_offline():
    url = get_url()
    context.configure(url=url, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config({}, prefix="sqlalchemy.", poolclass=pool.NullPool, url=get_url())
    with connectable.connect() as connection:
        context.configure(connection=connection)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
`;

  const beTest = `def test_health():
    assert True
`;

  const envExample = `# Root env
APP_NAME=${productName}
`;

  const files: ScaffoldFile[] = [
    { path: 'README.md', content: rootReadme },
    { path: 'docker-compose.yml', content: dockerCompose },
    { path: '.github/workflows/ci.yml', content: ciWorkflow },
    { path: '.env.example', content: envExample },

    // frontend
    { path: 'frontend/package.json', content: fePackage },
    { path: 'frontend/Dockerfile', content: feDockerfile },
    { path: 'frontend/next.config.mjs', content: feNextConfig },
    { path: 'frontend/src/app/page.tsx', content: fePage },
    { path: 'frontend/.storybook/main.ts', content: feStorybookMain },
    { path: 'frontend/.storybook/preview.ts', content: feStorybookPreview },

    // backend
    { path: 'backend/Dockerfile', content: beDockerfile },
    { path: 'backend/requirements.txt', content: beRequirements },
    { path: 'backend/app/main.py', content: beMain },
    { path: 'backend/app/interfaces/graphql/schema.py', content: beSchema },
    { path: 'backend/app/domain/__init__.py', content: beDDDInit },
    { path: 'backend/app/application/__init__.py', content: beDDDInit },
    { path: 'backend/app/infrastructure/__init__.py', content: beDDDInit },
    { path: 'backend/app/interfaces/__init__.py', content: beDDDInit },
    { path: 'backend/alembic.ini', content: beAlembicIni },
    { path: 'backend/alembic/env.py', content: beAlembicEnv },
    { path: 'backend/alembic/versions/.keep', content: '' },
    { path: 'backend/tests/test_health.py', content: beTest },
  ];

  return files;
}

