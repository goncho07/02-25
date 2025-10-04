<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1T6bOnyTHtEtekq8YCL6GT4kZDQpH50O1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Frontend architecture overview

The frontend now follows a configuration-driven architecture that removes hardcoded values and centralises cross-cutting concerns:

- **Routing:** All route paths and role-based route collections live under [`config/routes.ts`](config/routes.ts) and [`config/appRoutes.tsx`](config/appRoutes.tsx). Pages are registered once and consumed by `App.tsx`, ensuring HashRouter navigation stays declarative.
- **Navigation:** Sidebar items are defined via translation keys in [`config/navigation.ts`](config/navigation.ts) and resolved at runtime with the [`useNavigationItems`](hooks/useNavigationItems.ts) hook. This eliminates duplicated menu definitions and enables i18n-ready labels.
- **Branding & environment:** Branding assets, institution metadata, and API endpoints are configurable through environment variables exposed in [`config/environment.ts`](config/environment.ts) and [`config/branding.ts`](config/branding.ts). Default values are documented in [`.env.example`](.env.example).
- **Theme management:** A theme contract powered by [`config/theme.ts`](config/theme.ts) feeds the global UI store to synchronise light/dark modes, media queries, and design tokens.
- **Authentication:** Role constants, labels, and mock credentials are centralised in [`config/roles.ts`](config/roles.ts) and [`config/auth.ts`](config/auth.ts), allowing the auth store to emit strongly typed user profiles with translation-friendly display names.
- **Internationalisation:** The project uses `i18next`/`react-i18next` bootstrapped in [`config/i18n.ts`](config/i18n.ts) with English and Spanish resources under the `locales/` directory. Layout, navigation, and auth flows now consume translations instead of raw JSX strings.

## Conventions

- Use the configuration exports from `config/index.ts` instead of hardcoding strings in components.
- Add new copy to `locales/es/translation.json` and `locales/en/translation.json` when introducing user-facing text.
- Prefer hooks (e.g. `useNavigationItems`, `useOfflineStatus`) to share logic between feature modules.
- Define new environment-driven values in `.env.example` and surface them through `config/environment.ts`.
