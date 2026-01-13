import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { dataTable } from "./schema";
import { data } from "./data";

const db = drizzle(process.env.DB_FILE_NAME!);

type MatchupRecord = { W: number; L: number };
type SeedData = Record<string, Record<string, MatchupRecord>>;

async function main() {
  const seedData: SeedData = data;
  const rows: (typeof dataTable.$inferInsert)[] = [];

  for (const team_id of Object.keys(seedData)) {
    const opponents = seedData[team_id];
    for (const team2_id of Object.keys(opponents)) {
      const record = opponents[team2_id];
      rows.push({
        team_id,
        team2_id,
        wins: record.W,
        losses: record.L,
      });
    }
  }

  await db.delete(dataTable);
  await db.insert(dataTable).values(rows);
  console.log(`Seeded data.`);
}

main();
