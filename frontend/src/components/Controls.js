import React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Controls({
  areas,
  primary,
  setPrimary,
  comparison,
  setComparison,
  onAnalyze,
  loading,
}) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Controls</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="primary-label">Primary Locality</InputLabel>
        <Select
          labelId="primary-label"
          value={primary || ""}
          label="Primary Locality"
          onChange={(e) => setPrimary(e.target.value)}
        >
          {areas.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="comparison-label">Comparison</InputLabel>
        <Select
          labelId="comparison-label"
          value={comparison || ""}
          label="Comparison"
          onChange={(e) => setComparison(e.target.value)}
        >
          {areas.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onAnalyze}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </Button>
    </Box>
  );
}
