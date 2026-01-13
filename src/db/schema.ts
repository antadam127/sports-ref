import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const dataTable = sqliteTable(
  "team_matchups",
  {
    team_id: text().notNull(),
    team2_id: text().notNull(),
    wins: int().notNull(),
    losses: int().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.team_id, table.team2_id] }),
  })
);
