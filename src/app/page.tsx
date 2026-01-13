import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { data } from "@/db/data";
import Link from "next/link";

const TablePage = () => {
  const teams = Object.keys(data);

  const headerCells = [];
  const footerCells = [];
  const bodyRows = [];

  headerCells.push(<TableHead key="tm">tm</TableHead>);
  footerCells.push(<TableHead key="tm-footer">tm</TableHead>);
  for (const team of teams) {
    headerCells.push(<TableHead key={team}>{team}</TableHead>);
    footerCells.push(<TableHead key={`${team}-footer`}>{team}</TableHead>);
  }

  for (const team of teams) {
    const rowCells = [];

    rowCells.push(
      <TableCell key={`${team}-label`} className="font-medium">
        {team}
      </TableCell>
    );
    for (const opponent of teams) {
      const record = data[team][opponent];
      const cellText = record ? `${record.W}-${record.L}` : "-";
      rowCells.push(<TableCell key={`${team}-${opponent}`}>{cellText}</TableCell>);
    }

    bodyRows.push(<TableRow key={team}>{rowCells}</TableRow>);
  }

  return (
    <>
      <h2 className="mb-4 text-2xl font-semibold tracking-tight">Table</h2>
      <Table>
        <TableHeader>
          <TableRow>{headerCells}</TableRow>
        </TableHeader>
        <TableBody>{bodyRows}</TableBody>
        <TableFooter>
          <TableRow>{footerCells}</TableRow>
        </TableFooter>
      </Table>
      <Link href="/table2" className="mt-4 inline-block text-sm underline hover:no-underline">
        Table 2
      </Link>
    </>
  );
};

export default TablePage;
