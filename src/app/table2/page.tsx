import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { data } from "@/db/data"; // Data comes from database this time
import { dataTable } from "@/db/schema";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function Table2Page() {
  //   const teams = Object.keys(data); // REPLACING THIS
  const teams = await db.selectDistinct({ team_id: dataTable.team_id }).from(dataTable);

  const headerCells = [];
  const footerCells = [];
  const bodyRows = [];

  headerCells.push(<TableHead key="tm">tm</TableHead>);
  footerCells.push(<TableHead key="tm-footer">tm</TableHead>);
  for (const team of teams) {
    headerCells.push(<TableHead key={team.team_id}>{team.team_id}</TableHead>);
    footerCells.push(<TableHead key={`${team.team_id}-footer`}>{team.team_id}</TableHead>);
  }

  let index = 0;
  for (const team of teams) {
    // console.log(team);
    const rowCells = [];

    rowCells.push(
      <TableCell key={`${team.team_id}-label`} className="font-medium">
        {team.team_id}
      </TableCell>
    );

    // SELECT all team_2 where team_1 == team_id
    const opponentTeams = await db.select({ team2_id: dataTable.team2_id, wins: dataTable.wins, losses: dataTable.losses }).from(dataTable).where(eq(dataTable.team_id, team.team_id));
    // Now have all opponent teams with record for the team
    let indexx = 0;
    for (const opponent of opponentTeams) {
      // console.log(opponent);
      const cellText = `${opponent.wins}-${opponent.losses}`;
      if (index == indexx) rowCells.push(<TableCell key={`${team.team_id}-self`}>-</TableCell>);
      rowCells.push(<TableCell key={`${team.team_id}-${opponent.team2_id}`}>{cellText}</TableCell>);
      indexx++;
    }

    // That replaces this, flattened data in db then unflattened to table
    // for (const opponent of teams) {
    //   const record = data[team][opponent];
    //   const cellText = record ? `${record.W}-${record.L}` : "-";
    //   rowCells.push(<TableCell key={`${team}-${opponent}`}>{cellText}</TableCell>);
    // }

    bodyRows.push(<TableRow key={team.team_id}>{rowCells}</TableRow>);
    index++;
    // Definetely better solutions than hardcoded indexes
  }

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Table using data from local database</h2>
      <Table className="mt-2">
        <TableHeader>
          <TableRow>{headerCells}</TableRow>
        </TableHeader>
        <TableBody>{bodyRows}</TableBody>
        <TableFooter>
          <TableRow>{footerCells}</TableRow>
        </TableFooter>
      </Table>
      <div className="flex justify-between w-full">
        <Link href="/" className="mt-4 inline-block text-sm underline hover:no-underline">
          Table 1
        </Link>
        <div>
          <Link href="https://local.drizzle.studio/" target="blank" className="mt-4 inline-block text-sm underline hover:no-underline">
            View DB
          </Link>
          <span> | </span>
          <Link href="/d3" target="blank" className="mt-4 inline-block text-sm underline hover:no-underline">
            View D3
          </Link>
        </div>
      </div>
    </>
  );
}
