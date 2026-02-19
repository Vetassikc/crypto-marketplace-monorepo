# Project Context & Rules (`gemini.md`)

## 🌟 Project Identity
**Name:** Marketplace V2 (Crypto Marketplace)
**Vision:** "Amazon 3.0" - A premium, AI-powered hybrid marketplace combining Web2 speed with Web3 transparency.
**Primary Vibe:** Professional, Trustworthy, Innovative, Glassmorphism, Aurora Theme.

## 🛠 Tech Stack
- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend:** NestJS, Prisma ORM, PostgreSQL.
- **AI Core:** Google Gemini 2.0 Flash Exp (Smart Search, Magic Write).
- **Monorepo:** TurboRepo.
- **Structure**:
  - `apps/web`: Next.js Frontend
  - `apps/api`: NestJS Backend
  - `packages/database`: Prisma Schema & Client
  - `.agent/skills/`: AI Skills.
  - `docs/`: Global Documentation.
  - `_archive/`: Legacy projects (reference only).
- **Language:** TypeScript (Strict Mode).

## 🔄 Development Workflow (Local-First)
We strictly follow this cycle for every task:
1.  **Develop Locally**: Write code and test basic functionality on `localhost`.
2.  **Test**: Verified build (`npx turbo run build`) and manual check.
3.  **Update Docs**: Review `docs/` folder. Add new features or update existing docs to match code.
    - *Rule*: Code and Docs must always constitute a "Single Source of Truth".
4.  **Confirm**: Ask the user: "Everything works, docs are updated. Ready to push?".
5.  **Push**: Only after user approval, run `git push`.

## 🗣️ Communication Rules
1.  **Chat Language**: Ukrainian (Українська). Always respond to the user in Ukrainian.
2.  **Tech Terms**: Keep technical terms in English where appropriate (e.g., "Request", "Build", "Deploy").

## 📝 Documentation Rules
1.  **Language:** English (US) - Professional, Technical.
2.  **Location:** All docs go into `docs/`.
3.  **Format:** Markdown with clear headers, code blocks, and reliable links.
4.  **Maintenance:** Update docs *immediately* when code changes.

## 🤖 AI Workflow Rules
1.  **Skills**: Use available skills in `.agent/skills/` for specialized tasks (UI/UX, Planning).
2.  **Planning**: Always start complex tasks by updating `task.md` and `implementation_plan.md`.
3.  **Consistency**: Check existing patterns (e.g., `apps/web/components/ui`) before creating new ones.
4.  **No Placeholders**: Never leave "TODO" or mock data in final code unless explicitly requested. Use AI tools to generate realistic content.

## 🚀 Best Practices
- **Components**: Functional, Stateless (use Hooks), Typed Props.
- **API**: RESTful, predictable endpoints, robust error handling.
- **Git**: Semantic Commit Messages (`feat:`, `fix:`, `docs:`, `chore:`).
