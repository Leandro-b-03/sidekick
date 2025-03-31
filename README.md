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

### NPC Attributes in Appwrite

The `NPCS` collection in Appwrite contains the following attributes:

| Attribute         | Type         | Description                                                                 |
|-------------------|--------------|-----------------------------------------------------------------------------|
| `name`            | `string`     | The name of the NPC.                                                       |
| `race`            | `string`     | The race of the NPC.                                                       |
| `class`           | `string`     | The class or role of the NPC.                                              |
| `job`             | `string`     | The job or occupation of the NPC.                                          |
| `armour_class`    | `integer`    | The armor class value of the NPC.                                          |
| `initiative`      | `string`     | The initiative value of the NPC.                                           |
| `speed`           | `string`     | The speed or movement capability of the NPC.                               |
| `hit_points`      | `string`     | The hit points of the NPC.                                                 |
| `hit_dice`        | `string`     | The hit dice used for the NPC.                                             |
| `description`     | `string`     | A brief description of the NPC.                                            |
| `appearance`      | `string`     | The physical appearance of the NPC.                                        |
| `languages`       | `string`     | The languages spoken by the NPC.                                           |
| `saving_throws`   | `string`     | The saving throws associated with the NPC.                                 |
| `attr`            | `string[]`   | A list of attributes or abilities of the NPC.                              |
| `sex_orientation` | `string`     | The sexual orientation of the NPC.                                         |
| `affiliation`     | `string`     | The affiliation or group the NPC belongs to.                               |
| `alignment`       | `string`     | The alignment of the NPC (e.g., lawful good, chaotic evil).                |
| `background`      | `string`     | The background or history of the NPC.                                      |
| `backstory`       | `string`     | The detailed backstory of the NPC.                                         |
| `gender`          | `string`     | The gender of the NPC.                                                     |
| `goal`            | `string`     | The goal or objective of the NPC.                                          |
| `personality`     | `string`     | The personality traits of the NPC.                                         |
| `items`           | `string[]`   | A list of items the NPC possesses.                                         |
| `enemy`           | `boolean`    | Indicates whether the NPC is an enemy.                                     |
| `secret_plot`     | `string`     | Any secret plot or hidden agenda of the NPC.                               |
| `spells`          | `string[]`   | A list of spells the NPC can cast.                                         |
| `difficult`       | `string`     | The difficulty level associated with the NPC.                              |
| `age`             | `integer`    | The age of the NPC.                                                        |
| `level`           | `integer`    | The level of the NPC.                                                      |

These attributes define the structure of the `NPCS` collection and are used to store and manage data related to non-player characters in the RPG.

### ITEM Attributes in Appwrite

The `ITEMS` collection in Appwrite contains the following attributes:

| Attribute         | Type       | Description                                                                 |
|-------------------|------------|-----------------------------------------------------------------------------|
| `name`            | `string`   | The name of the ITEM.                                                       |
| `class`           | `string`   | The class or role of the ITEM.                                              |
| `description`     | `string`   | A brief description of the ITEM.                                            |
| `weapon_type`     | `string`   | The type of weapon the ITEM uses.                                           |
| `requirements`    | `string`   | Any specific requirements related to the ITEM.                              |
| `type`            | `string`   | The type or category of the ITEM.                                           |
| `wondrous_item`   | `string`   | Indicates if the ITEM possesses a wondrous item.                            |
| `rarity`          | `string`   | The rarity level of the ITEM.                                               |
| `evolution_level` | `string[]` | A list of evolution levels for the ITEM.                                    |
| `notes`           | `string[]` | Additional notes about the ITEM.                                            |
| `evolution_notes` | `string[]` | Notes related to the ITEM's evolution.                                      |
| `damage`          | `string[]` | A list of damage values associated with the ITEM.                           |
| `item_tier`       | `string`   | The tier of items the ITEM can use or possess.                              |
| `damage_type`     | `string`   | The type of damage the ITEM can inflict.                                    |

These attributes define the structure of the `ITEMS` collection and are used to store and manage data related to non-player characters in the RPG.

### COMBAT Attributes in Appwrite

The `COMBATS` collection in Appwrite contains the following attributes:

| Attribute   | Type       | Default  | Description                                                                       |
|-------------|------------|----------|-----------------------------------------------------------------------------------|
| `combat_id` | `string`   | -        | A unique identifier for the combat.                                               |
| `monsters`  | `integer`  | `0`      | The number of monsters involved in the combat.                                    |
| `players`   | `integer`  | `0`      | The number of players participating in the combat.                                |
| `turns`     | `integer`  | `1`      | The current turn number in the combat.                                            |
| `status`    | `enum`     | `running`| The status of the combat (`running`, `finished`).                                 |
| `won`       | `enum`     | `none`   | Who have won the combat, players or npc or still running (`running`, `finished`). |

These attributes define the structure of the `COMBATS` collection and are used to manage and track combat scenarios in the RPG.

### INITIATIVE Attributes in Appwrite

The `INITIATIVE` collection in Appwrite contains the following attributes:

| Attribute       | Type         | Description                                                                 |
|-----------------|--------------|-----------------------------------------------------------------------------|
| `current_hp`    | `integer`    | The current hit points of the entity.                                       |
| `id`            | `string`     | A unique identifier for the entity.                                         |
| `initiative`    | `integer`    | The initiative value of the entity.                                         |
| `max_hp`        | `integer`    | The maximum hit points of the entity.                                       |
| `name`          | `string`     | The name of the entity.                                                     |
| `status`        | `string`     | The current status of the entity (e.g., active, unconscious).               |
| `turn_history`  | `string[]`   | A list of actions or events associated with the entity's turns.             |
| `type`          | `string`     | The type of entity (e.g., player, NPC, monster).                            |
| `combat_id`     | `string`     | The identifier of the combat this entity is associated with.                |

These attributes define the structure of the `INITIATIVE` collection and are used to manage turn order and related data during combat scenarios in the RPG.

### Deepseek Usage

Deepseek is integrated into this project to provide advanced search and data analysis capabilities. It is used to:

- Perform complex searches across the game's data, such as finding specific NPCs, and items.
- Analyze data to provide insights or recommendations based on user queries.

The `DEEPSEEK_URL` and `DEEPSEEK_API_KEY` environment variables are configured to authenticate and interact with the Deepseek API, enabling efficient and powerful search functionality within the application.