# Copilot Memory

These are important details about the project that you maintain and refer to when working on the codebase.

- Never do raw CSS only use tailwind, customize with tailwind config
- Header component requires null safety for `data?.nav` access to prevent undefined errors
- Blogs listing component supports client-side sorting (Newest default, plus Oldest and Title A–Z) with TypeScript typings.
- Blog pages use `fallback: false` for static generation; missing posts hit the in-page 404 branch in `pages/blogs/[filename].tsx`.
- TinaCMS has a CommonJS/ESM interop quirk with `color-string`. Worked around by `scripts/patch-tinacms.js` (postinstall), `next.config.ts` `serverExternalPackages`, and webpack `externals`. Re-test the need for these on every Tina upgrade.
