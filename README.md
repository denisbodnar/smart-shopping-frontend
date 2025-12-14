# Smart-Shopping frontend

Vue 3 + Vite SPA for SmartShopping.

The app talks to the SmartShopping API via Axios and supports Google OAuth login.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

## Environment variables

Vite env vars are **build-time**. For local development create a `.env` file in the project root:

```sh
VITE_API_BASE_URL='your-api-base-url'
```

Notes:

- `.env` is gitignored.
- If you change env vars, restart `npm run dev`.

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Routes

- `/sign-in` - Login page
- `/sign-up` - Register page
- `/oauth/callback` - Google OAuth callback handler (expects `?token=...`)
- `/hello` - Displays the current user profile

## Google OAuth flow (frontend)

1. User clicks "Login with Google" on `/sign-in`.
2. Browser redirects to the backend OAuth endpoint:
   - `GET {VITE_API_BASE_URL}/auth/google_oauth2`
3. Backend redirects back to the frontend:
   - `/oauth/callback?token=...`
4. `OAuthCallback.vue` stores the token in `localStorage` and calls `GET /api/v1/user` to load the profile.
5. App redirects to `/hello`.

## Netlify deployment

### Build settings

- **Build command**
  - `npm ci && npm run build`
- **Publish directory**
  - `dist`

### SPA routing

This repo includes `public/_redirects` so Netlify serves `index.html` for SPA routes:

```
/*    /index.html   200
```

### Netlify env var

In Netlify site settings add:

- `VITE_API_BASE_URL='your-api-base-url'`

Then redeploy (env vars are applied at build time).
