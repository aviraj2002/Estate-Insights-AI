import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function DataTable({ rows = [] }) {
  if (!rows.length) return <div>No rows to show.</div>;
  const keys = Object.keys(rows[0] || {});

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {keys.map((k) => <TableCell key={k} sx={{ fontWeight: "bold" }}>{k}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, idx) => (
            <TableRow key={idx}>
              {keys.map((k) => <TableCell key={k + idx}>{String(r[k] ?? "")}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
