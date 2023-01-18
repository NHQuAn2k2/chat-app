import { Avatar, Box, Stack, Typography } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import React from "react";

// css ----------------------------------------//

//---------------------------------------------//

const Message = ({ owner, chat }) => {
  return (
    <Stack
      direction={owner ? "row-reverse" : "row"}
      alignItems="flex-end"
      spacing={1}
    >
      <Avatar />
      <Box
        sx={{
          bgcolor: owner ? blue[500] : grey[300],
          padding: 1,
          borderRadius: owner ? "12px 12px 0 12px" : "12px 12px 12px 0",
          display: "inline-block",
        }}
      >
        <Typography sx={{ color: owner ? "white" : "black" }} variant="h6">
          {chat.text}
        </Typography>
      </Box>
    </Stack>
  );
};

export default Message;
