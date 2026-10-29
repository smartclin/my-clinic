## Migrating to Relational Queries version 2

npm

yarn

pnpm

bun

```
bun add drizzle-orm@rc
bun add drizzle-kit@rc -D
```

This guide assumes familiarity with:

- **Relations Fundamentals** - [read here](https://orm.drizzle.team/docs/relations-schema-declaration)
- **drizzle-kit pull** - [read here](https://orm.drizzle.team/docs/drizzle-kit-pull)

### API changes[](https://orm.drizzle.team/docs/relations-v1-v2#api-changes)

#### What is working differently from v1[](https://orm.drizzle.team/docs/relations-v1-v2#what-is-working-differently-from-v1)

One of the biggest updates were in **Relations Schema definition**

The first difference is that you no longer need to specify `relations` for each table separately in different objects and then pass them all to `drizzle()` along with your schema. In Relational Queries v2, you now have one dedicated place to specify all the relations for all the tables you need.

The `r` parameter in the callback provides comprehensive autocomplete functionality - including all tables from your schema and functions such as `one`, `many`, and `through` - essentially offering everything you need to specify your relations.

```
// relations.ts
import * as schema from "./schema"
import { defineRelations } from "drizzle-orm"

export const relations = defineRelations(schema, (r) => ({
    ...
}));
```

```
// index.ts
import { relations } from "./relations"
import { drizzle } from "drizzle-orm/..."

const db = drizzle(process.env.DATABASE_URL, { relations })
```

##### What is different?[](https://orm.drizzle.team/docs/relations-v1-v2#what-is-different)

Schema Definition

**One place for all your relations**

❌ v1

```
import { relations } from "drizzle-orm/_relations";
import { users, posts } from './schema';

export const usersRelation = relations(users, ({ one, many }) => ({
  invitee: one(users, {
    fields: [users.invitedBy],
    references: [users.id],
  }),
  posts: many(posts),
}));

export const postsRelation = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

✅ v2

```
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    invitee: r.one.users({
      from: r.users.invitedBy,
      to: r.users.id,
    }),
    posts: r.many.posts(),
  },
  posts: {
    author: r.one.users({
      from: r.posts.authorId,
      to: r.users.id,
    }),
  },
}));
```

You can still separate it into different `parts`, and you can make the parts any size you want

```
import { defineRelations, defineRelationsPart } from 'drizzle-orm';
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    invitee: r.one.users({
      from: r.users.invitedBy,
      to: r.users.id,
    }),
    posts: r.many.posts(),
  }
}));

export const part = defineRelationsPart(schema, (r) => ({
  posts: {
    author: r.one.users({
      from: r.posts.authorId,
      to: r.users.id,
    }),
  }
}));
```

and then you can provide it to the db instance

```
const db = drizzle(process.env.DB_URL, { relations: { ...relations, ...part } })
```

**Define `many` without `one`**

In v1, if you wanted only the `many` side of a relationship, you had to specify the `one` side on the other end, which made for a poor developer experience.

In v2, you can simply use the `many` side without any additional steps

❌ v1

```
import { relations } from "drizzle-orm/_relations";
import { users, posts } from './schema';

export const usersRelation = relations(users, ({ one, many }) => ({
  posts: many(posts),
}));

export const postsRelation = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}));
```

✅ v2

```
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    posts: r.many.posts({
      from: r.users.id,
      to: r.posts.authorId,
    }),
  },
}));
```

**New `optional` option**

`optional: false` at the type level makes the `author` key in the `posts` object required. This should be used when you are certain that this specific entity will always exist.

❌ v1

Was not supported in v1

✅ v2

```
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    posts: r.one.posts({
      from: r.users.id,
      to: r.posts.authorId,
      optional: false,
    }),
  },
}));
```

**No modes in `drizzle()`**

We found a way to use the same strategy for all MySQL dialects, so there’s no need to specify them

❌ v1

```
import * as schema from './schema'

const db = drizzle(process.env.DATABASE_URL, { mode: "planetscale", schema });
// or
const db = drizzle(process.env.DATABASE_URL, { mode: "default", schema });
```

✅ v2

```
import { relations } from './relations'

const db = drizzle(process.env.DATABASE_URL, { relations });
```

**`from` and `to` upgrades**

We’ve renamed `fields` to `from` and `references` to `to`, and we made both accept either a single value or an array

❌ v1

```
...
author: one(users, {
  fields: [posts.authorId],
  references: [users.id],
}),
...
```

✅ v2

```
...
author: r.one.users({
  from: r.posts.authorId,
  to: r.users.id,
}),
...
```

```
...
author: r.one.users({
  from: [r.posts.authorId],
  to: [r.users.id],
}),
...
```

**`relationName` -> `alias`**

❌ v1

```
import { relations } from "drizzle-orm/_relations";
import { users, posts } from './schema';

export const postsRelation = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
	  relationName: "author_post",
  }),
}));
```

✅ v2

```
import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  posts: {
    author: r.one.users({
      from: r.posts.authorId,
      to: r.users.id,
      alias: "author_post",
    }),
  },
}));
```

**`custom types` new function**

There is a new [codec](https://orm.drizzle.team/docs/codecs) function was added to custom types, so you can control how data is mapped

You can find out more [here](https://orm.drizzle.team/docs/custom-types#ts-doc-for-type-definitions)

✅ v2

```
const customBytes = customType<{
  data: Buffer;
  driverData: Buffer;
  jsonData: string;
}>({
  dataType: () => "bytea",
  codec: "bytea",
});
```

##### What is new?[](https://orm.drizzle.team/docs/relations-v1-v2#what-is-new)

**`through` for many-to-many relations**

Previously, you would need to query through a junction table and then map it out for every response

You don’t need to do it now!

Schema

❌ v1

```
export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  usersToGroups: many(usersToGroups),
}));

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groups, {
    fields: [usersToGroups.groupId],
    references: [groups.id],
  }),
  user: one(users, {
    fields: [usersToGroups.userId],
    references: [users.id],
  }),
}));
```

```
// Query example
const response = await db.query.users.findMany({
  with: {
    usersToGroups: {
      columns: {},
      with: {
        group: true,
      },
    },
  },
});
```

✅ v2

```
import * as schema from './schema';
import { defineRelations } from 'drizzle-orm';

export const relations = defineRelations(schema, (r) => ({
  users: {
    groups: r.many.groups({
      from: r.users.id.through(r.usersToGroups.userId),
      to: r.groups.id.through(r.usersToGroups.groupId),
    }),
  },
  groups: {
    participants: r.many.users(),
  },
}));
```

```
// Query example
const response = await db.query.users.findMany({
  with: {
    groups: true,
  },
});
```

**Predefined filters**

❌ v1

Was not supported in v1

✅ v2

```
import * as schema from './schema';
import { defineRelations } from 'drizzle-orm';

export const relations = defineRelations(schema,
  (r) => ({
    groups: {
      verifiedUsers: r.many.users({
        from: r.groups.id.through(r.usersToGroups.groupId),
        to: r.users.id.through(r.usersToGroups.userId),
        where: {
          verified: true,
        },
      }),
    },
  })
);
```

```
// Query example: get groups with all verified users
const response = await db.query.groups.findMany({
  with: {
    verifiedUsers: true,
  },
});
```

##### `where` is now object[](https://orm.drizzle.team/docs/relations-v1-v2#where-is-now-object)

❌ v1

```
const response = db._query.users.findMany({
  where: (users, { eq }) => eq(users.id, 1),
});
```

✅ v2

```
const response = db.query.users.findMany({
  where: {
    id: 1,
  },
});
```

For a complete API Reference please check our [Select Filters docs](https://orm.drizzle.team/docs/rqb#select-filters)

Complex filter example using RAW

##### `orderBy` is now object[](https://orm.drizzle.team/docs/relations-v1-v2#orderby-is-now-object)

❌ v1

```
const response = db._query.users.findMany({
  orderBy: (users, { asc }) => [asc(users.id)],
});
```

✅ v2

```
const response = db.query.users.findMany({
  orderBy: { id: "asc" },
});
```

##### Filtering by relations[](https://orm.drizzle.team/docs/relations-v1-v2#filtering-by-relations)

❌ v1

Was not supported in v1

✅ v2

Example: Get all users whose ID>10 and who have at least one post with content starting with “M”

```
const usersWithPosts = await db.query.usersTable.findMany({
  where: {
    id: {
      gt: 10
    },
    posts: {
      content: {
        like: 'M%'
      }
    }
  },
});
```

❌ v1

Was not supported in v1

✅ v2

```
await db.query.posts.findMany({
	limit: 5,
	offset: 2, // correct ✅
	with: {
		comments: {
			offset: 3, // correct ✅
			limit: 3,
		},
	},
});
```

#### How to migrate relations schema definition from v1 to v2[](https://orm.drizzle.team/docs/relations-v1-v2#how-to-migrate-relations-schema-definition-from-v1-to-v2)

##### **Option 1**: Using `drizzle-kit pull`[](https://orm.drizzle.team/docs/relations-v1-v2#option-1-using-drizzle-kit-pull)

In new version `drizzle-kit pull` supports pulling `relations.ts` file in a new syntax:

##### Step 1[](https://orm.drizzle.team/docs/relations-v1-v2#step-1)

npm

yarn

pnpm

bun

```
bunx drizzle-kit pull
```

#### Step 2[](https://orm.drizzle.team/docs/relations-v1-v2#step-2)

Transfer generated relations code from `drizzle/relations.ts` to the file you are using to specify your relations

```
 ├ 📂 drizzle
 │ ├ 📂 meta
 │ ├ 📜 migration.sql
 │ ├ 📜 relations.ts ────────┐
 │ └ 📜 schema.ts            |
 ├ 📂 src                    │
 │ ├ 📂 db                   │
 │ │ ├ 📜 relations.ts <─────┘
 │ │ └ 📜 schema.ts
 │ └ 📜 index.ts
 └ …
```

`drizzle/relations.ts` includes an import of all tables from `drizzle/schema.ts`, which looks like this:

```
import * as schema from './schema'
```

You may need to change this import to a file where ALL your schema tables are located.

If there are multiple schema files, you can do the following:

```
import * as schema1 from './schema1'
import * as schema2 from './schema2'
...
```

#### Step 3[](https://orm.drizzle.team/docs/relations-v1-v2#step-3)

Change drizzle database instance creation and provide `relations` object instead of `schema`

Before

```
import * as schema from './schema'
import { drizzle } from 'drizzle-orm/...'

const db = drizzle('<url>', { schema })
```

After

```
// should be imported from a file in Step 2
import { relations } from './relations'
import { drizzle } from 'drizzle-orm/...'

const db = drizzle('<url>', { relations })
```

If you had MySQL dialect, you can remove `mode` from `drizzle()` as long as it’s not needed in version 2

##### **Option 2**: Manual migration[](https://orm.drizzle.team/docs/relations-v1-v2#option-2-manual-migration)

If you want to migrate manually, you can check our [Drizzle Relations section](https://orm.drizzle.team/docs/relations) for the complete API reference and examples of one-to-one, one-to-many, and many-to-many relations.

#### How to migrate queries from v1 to v2[](https://orm.drizzle.team/docs/relations-v1-v2#how-to-migrate-queries-from-v1-to-v2)

##### Migrate `where` statements[](https://orm.drizzle.team/docs/relations-v1-v2#migrate-where-statements)

You can check our [Select Filters docs](https://orm.drizzle.team/docs/rqb#select-filters) to see examples and a complete API reference.

With the new syntax, you can use `AND`, `OR`, `NOT`, and `RAW`, plus all the filtering operators that were previously available in Relations v1.

**Examples**

simple eq

using AND

using OR

using NOT

complex example using RAW

```
const response = await db.query.users.findMany({
  where: {
    age: 15,
  },
});
```

```
select
  "d0"."id" as "id",
  "d0"."name" as "name",
  "d0"."age" as "age"
from
  "users" as "d0"
where
  "d0"."age" = 15
```

##### Migrate `orderBy` statements[](https://orm.drizzle.team/docs/relations-v1-v2#migrate-orderby-statements)

Order by was simplified to a single object, where you specify the column and the sort direction (`asc` or `desc`)

❌ v1

```
const response = db._query.users.findMany({
  orderBy: (users, { asc }) => [asc(users.id)],
});
```

✅ v2

```
const response = db.query.users.findMany({
  orderBy: { id: "asc" },
});
```

##### Migrate `many-to-many` queries[](https://orm.drizzle.team/docs/relations-v1-v2#migrate-many-to-many-queries)

Relational Queries v1 had a very complex way of managing many-to-many queries. You had to use junction tables to query through them explicitly, and then map those tables out, like this:

```
const response = await db.query.users.findMany({
  with: {
    usersToGroups: {
      columns: {},
      with: {
        group: true,
      },
    },
  },
});
```

After upgrading to Relational Queries v2, your many-to-many relation will look like this:

```
import * as schema from './schema';
import { defineRelations } from 'drizzle-orm';

export const relations = defineRelations(schema, (r) => ({
  users: {
    groups: r.many.groups({
      from: r.users.id.through(r.usersToGroups.userId),
      to: r.groups.id.through(r.usersToGroups.groupId),
    }),
  },
  groups: {
    participants: r.many.users(),
  },
}));
```

And when you migrate your query, it will become this:

```
// Query example
const response = await db.query.users.findMany({
  with: {
    groups: true,
  },
});
```

### Internal changes[](https://orm.drizzle.team/docs/relations-v1-v2#internal-changes)

1.  Every `drizzle` database, `session`, `migrator` and `transaction` instance updated with new generic arguments for RQB v2 queries

Examples

2.  Updated `DrizzleConfig` generic with `TRelations` argument and `relations: TRelations` field

Examples

3.  The following entities have been removed from `drizzle-orm` and `drizzle-orm/relations`. The original imports now include new types used by Relational Queries v2, so make sure to update your imports if you intend to use the older types:

A list of all removed entities

4.  In the same manner, `${dialect}-core/query-builders/query` files were updated with RQB v2’s alternatives

Examples
