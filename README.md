# Standard instalation
## Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

### Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

### Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Master App config
## Environment Variables

Create a `.env` file in the root of your project and add the following variables:

```env
URL=http://localhost:3000/
DATABASE=Appwrite database id
NPCS=NPC collection id
COMBATS=Combat collection id
INITIATIVE=Initiative collection id
ITEMS=Item collection id
DEEPSEEK_URL=https://api.deepseek.com
DEEPSEEK_API_KEY=Deepseek Api Key
```

Make sure to keep your `.env` file secure and avoid committing it to version control.