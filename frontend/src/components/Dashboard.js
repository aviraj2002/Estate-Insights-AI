import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import DataTable from "./DataTable";

export default function Dashboard({ result, loading }) {
  if (loading) return <Typography>Loading analysis...</Typography>;
  if (!result) return <Typography sx={{ textAlign: "center", p: 6 }}>Upload an Excel dataset and run analysis.</Typography>;

  const { primary, comparison } = result.summaryInput || {};
  const p = result.primary || { priceTrend: [], demandTrend: [], rows: [] };
  const c = result.comparison || { priceTrend: [], demandTrend: [], rows: [] };

  const years = Array.from(new Set([...(p.priceTrend || []).map(x => x.year), ...(c.priceTrend || []).map(x => x.year)])).sort((a,b)=>a-b);
  const chartData = years.map(y => {
    const py = (p.priceTrend || []).find(pt => pt.year === y);
    const cy = (c.priceTrend || []).find(pt => pt.year === y);
    return { year: y, primary: py ? py.avgPrice : null, comparison: cy ? cy.avgPrice : null };
  });

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">AI (Mock) Summary</Typography>
            <Typography sx={{ mt: 1 }}>
              <strong>Primary:</strong> {primary} <br/>
              <strong>Comparison:</strong> {comparison}
            </Typography>
            <Typography sx={{ mt: 1 }}>
              {`The average price in ${primary} has shown a steady trend over the years. ${comparison} has comparatively lower prices but gradually increasing demand.`}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6">Demand Trends (Primary)</Typography>
            <Box sx={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={(p.demandTrend || []).map(d => ({ year: d.year, demand: d.avgDemand }))}>
                  <XAxis dataKey="year"/>
                  <YAxis/>
                  <Tooltip/>
                  <Line dataKey="demand" stroke="#2ca02c" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Price Trends</Typography>
            <Box sx={{ width: "100%", height: 360 }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(v) => (v ? v.toLocaleString() : "N/A")} />
                  <Legend />
                  <Line type="monotone" dataKey="primary" name={primary} stroke="#1f77b4" />
                  <Line type="monotone" dataKey="comparison" name={comparison} stroke="#ff7f0e" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Filtered Table — Primary Location Rows</Typography>
            <Box sx={{ mt: 1 }}>
              <DataTable rows={p.rows || []} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
