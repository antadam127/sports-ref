## Sports Reference

### Directions

- clone repo
- npm i
- change .env.template to .env
- npm run dev
- npx drizzle-kit studio (to view database)

### Exact steps done

(no ai used)

1. NEXT.js
   (https://nextjs.org/docs/app/getting-started/installation)

npx create-next-app@latest .

2. DRIZZLE
   (https://orm.drizzle.team/docs/get-started/sqlite-new)

(Decide to use drizzle to showcase database knowlege especially considering sports ref doesn't use Next)

npm i drizzle-orm @libsql/client dotenv
npm i -D drizzle-kit tsx

create .env and .env.template

copy data over into data.ts

make schema.ts file

CREATE AND APPLY DB MIGRATIONS

npx drizzle-kit generate
npx drizzle-kit migrate

create seed file with for loops and seeded database

npx tsx src/db/seed.ts

check all good with

npx drizzle-kit studio

3. SHADCN
   (https://ui.shadcn.com/docs/components/table)

npx shadcn@latest add table

4. Create table without DB

Create table/page.tsx

5. Create table with DB

Create table2/page.tsx
(https://orm.drizzle.team/docs/select)
