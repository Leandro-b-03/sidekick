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

## Explanation of Appwrite and Deepseek

### Appwrite

[Appwrite](https://appwrite.io/) is an open-source backend-as-a-service (BaaS) platform designed to simplify and accelerate the development of web, mobile, and server-side applications. It provides developers with a set of APIs and tools to manage databases, authentication, file storage, cloud functions, and more. In this project, Appwrite is used to manage collections such as `NPCS`, `COMBATS`, `INITIATIVE`, and `ITEMS`.

### Deepseek

[Deepseek](https://deepseek.com/) is an API-based service that provides advanced search and data analysis capabilities. It allows developers to integrate powerful search functionality into their applications. In this project, Deepseek is used to perform searches and data queries, with the `DEEPSEEK_URL` and `DEEPSEEK_API_KEY` environment variables enabling access to its API.

## How This Project Uses Appwrite and Deepseek

### Appwrite Usage

This project leverages Appwrite to manage and store data in collections. The following collections are utilized:

- **NPCS**: Stores data related to non-player characters (NPCs) in the RPG.
- **COMBATS**: Tracks combat scenarios and their associated details.
- **INITIATIVE**: Manages the initiative order for characters during combat.
- **ITEMS**: Contains information about items available in the game.

Appwrite's APIs are used for CRUD operations on these collections, ensuring seamless data management and integration with the application.

### Deepseek Usage

Deepseek is integrated into this project to provide advanced search and data analysis capabilities. It is used to:

- Perform complex searches across the game's data, such as finding specific NPCs, items, or combat scenarios.
- Analyze data to provide insights or recommendations based on user queries.

The `DEEPSEEK_URL` and `DEEPSEEK_API_KEY` environment variables are configured to authenticate and interact with the Deepseek API, enabling efficient and powerful search functionality within the application.