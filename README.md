# Bibliotheca React Monorepo

This repo contains the React UI for:

- Atlas
- Desiege

---

## Development

Copy .env and include your api keys

```bash
cp .env.sample .env
```

Install packages and run dev server

```bash
yarn && yarn dev
```

---

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Temporary

- Storybook fix (Webpack5 conflicts): add this to `package.json`

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Temporary

- Storybook fix (Webpack5 conflicts): add this to `package.json`

```
    "crypto": "npm:crypto-browserify",
    "stream": "npm:stream-browserify",
    "https": "npm:https-browserify",
    "http": "npm:stream-http",
    "os": "npm:os-browserify"
```
