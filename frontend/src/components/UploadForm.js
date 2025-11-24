import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Typography from "@mui/material/Typography";
import { uploadExcel } from "../api";

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an Excel file (.xlsx)");
    setUploading(true);
    try {
      const res = await uploadExcel(file);
      alert(`${res.data.message}. Rows: ${res.data.rows_count}`);
      if (onUploaded) onUploaded();
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check backend logs.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>Upload New Dataset</Typography>
      <Input type="file" inputProps={{ accept: ".xlsx,.xls" }} onChange={handleFile} />
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload & Process"}
        </Button>
      </Box>
    </Box>
  );
}
