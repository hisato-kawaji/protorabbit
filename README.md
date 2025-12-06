# My Next.js App

This is a simple boilerplate project for building web applications using Next.js. It includes a basic setup for TypeScript and Tailwind CSS.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech Stack

- [Next.js](https://nextjs.org/) - The React Framework for Production.
- [React](https://react.dev/) - A JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.

## Directory Structure

- `src/app`: Contains the application's routes and pages.
- `src/components`: Contains reusable UI components.
- `src/lib`: Contains utility functions and libraries.
- `public`: Contains static assets like images and fonts.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Configuration

### Environment Variables

To set up environment variables, create a `.env.local` file in the root of the project. You can copy the `.env.example` file.

```bash
cp .env.example .env.local
```

Add your environment-specific variables to this file.

#### Required
- `GEMINI_API_KEY`: Google Generative AI API key

#### GitHub modes
This app can create repositories either in an Organization (via GitHub App) or under a Personal account (via PAT).

- Auto mode: If `GITHUB_PERSONAL_ACCESS_TOKEN` is set, uses Personal mode; otherwise uses Organization mode. You can override via `GITHUB_MODE`.

- Organization mode (GitHub App):
  - `GITHUB_APP_ID`
  - `GITHUB_APP_PRIVATE_KEY` (PEM, escaped with `\n`)
  - `GITHUB_REPO_OWNER` (org login)

- Personal mode (PAT):
  - `GITHUB_PERSONAL_ACCESS_TOKEN` (must have `repo` scope)

### Key Configuration Files

- `next.config.ts`: Configuration file for Next.js. You can customize settings like redirects, rewrites, and build options here.
- `tailwind.config.mjs`: Configuration file for Tailwind CSS. Use this file to customize your design system, including colors, fonts, and spacing.
- `tsconfig.json`: The TypeScript compiler configuration file.
- `eslint.config.mjs`: Configuration file for ESLint, used for code linting.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in the development mode.
- `npm run build`: Builds the app for production to the `.next` folder.
- `npm run start`: Starts the application in production mode.
- `npm run lint`: Runs ESLint to find and fix problems in your code.

## Basic Usage

### Creating a New Page

To create a new page, add a new file to the `src/app` directory. For example, to create an "About" page accessible at `/about`, create a file named `src/app/about/page.tsx`.

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page.</p>
    </div>
  );
}
```

### Creating and Using Components

Create reusable components in the `src/components` directory. For example, you can create a `Button` component:

```tsx
// src/components/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

export function Button({ children, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {children}
    </button>
  );
}
```

Then, you can import and use this component in your pages:

```tsx
// src/app/page.tsx
import { Button } from '@/components/Button';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
      <Button onClick={() => alert('Clicked!')}>Click Me</Button>
    </div>
  );
}
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
## GitHub Personal Account Support

To create repositories under your personal account instead of an organization:

1. Create a Personal Access Token (classic) with `repo` scope.
2. Set `GITHUB_PERSONAL_ACCESS_TOKEN` in `.env.local`.
3. Optionally set `GITHUB_MODE=user` to force Personal mode.
4. Call `POST /api/github/create-repo` with `{ name, description? }`.

For organization repositories using a GitHub App, provide `GITHUB_APP_ID`, `GITHUB_APP_PRIVATE_KEY`, and `GITHUB_REPO_OWNER`, or set `GITHUB_MODE=org`.
### GitHub Authentication (Classic PAT recommended)

If you want to create repositories under your personal account, use a Classic Personal Access Token (PAT).

Steps:
- Generate a Classic PAT: Settings → Developer settings → Personal access tokens (classic)
- Scopes: include at least `repo` (for private repo creation). Grant SSO if prompted.
- Set `.env.local`:
  - `GITHUB_PERSONAL_ACCESS_TOKEN=<your-classic-pat>`
  - Optionally `GITHUB_MODE=user`

If you must use a fine-grained PAT, create the repo manually first and use the UI option “既存のリポジトリに適用” to push files and create issues.
