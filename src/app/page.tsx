'use client'
import { Box, Button, Typography } from "@mui/material";
import { ResizableBox } from "react-resizable";

export default function Home() {
  return (
    <main>
      <Box>
        <Typography variant="h1">Website Heading</Typography>
        <Button variant="contained" onClick={() => window.alert('clicked')}>
          Test
        </Button>
      </Box>
    </main>
  );
}
