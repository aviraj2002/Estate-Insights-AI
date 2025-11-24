import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { getAreas, analyze } from "./api";
import UploadForm from "./components/UploadForm";
import Controls from "./components/Controls";
import Dashboard from "./components/Dashboard";

const drawerWidth = 300;

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [areas, setAreas] = useState([]);
  const [primary, setPrimary] = useState("");
  const [comparison, setComparison] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAreas = async () => {
    try {
      const res = await getAreas();
      setAreas(res.data.areas || []);
      if ((res.data.areas || []).length > 0) {
        setPrimary(res.data.areas[0]);
        setComparison(res.data.areas[1] || res.data.areas[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    setAnalysisResult(null);
    try {
      const res = await analyze(primary, comparison);
      setAnalysisResult(res.data);
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Estate Insights</Typography>
      <UploadForm onUploaded={fetchAreas} />
      <Box sx={{ mt: 3 }}>
        <Controls
          areas={areas}
          primary={primary}
          setPrimary={setPrimary}
          comparison={comparison}
          setComparison={setComparison}
          onAnalyze={handleAnalyze}
          loading={loading}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Estate Insights AI
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer for desktop */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        open
      >
        <Toolbar />
        {drawer}
      </Drawer>

      {/* Drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Dashboard result={analysisResult} loading={loading} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
