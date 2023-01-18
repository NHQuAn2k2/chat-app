import { Box, Grid } from "@mui/material";
import React from "react";
import Messages from "../components/Messages";
import Chats from "../components/Chats";

const HomePage = () => {
  return (
    <Box sx={{ width: "1500px", marginX: "auto", marginTop: 3 }}>
      <Grid container spacing={2}>
        <Grid item lg={4}>
          <Messages />
        </Grid>
        <Grid item lg={8}>
          <Chats />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
