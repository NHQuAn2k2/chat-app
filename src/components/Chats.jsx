import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import InfoIcon from "@mui/icons-material/Info";
import Message from "./Message";
import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/chatContext";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../context/authContext";
import SendIcon from "@mui/icons-material/Send";

// css -----------------------------------------------------//
const BoxStyled = styled(Box)(({ theme }) => ({
  position: "relative",
}));
const ButtonStyled = styled(Button)(({ theme }) => ({
  position: "absolute",
  right: "20px",
  top: "50%",
  transform: "translateY(-50%)",
}));
//----------------------------------------------------------//

const Chats = () => {
  // state ---------------------------------------------------//
  const { state } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [chats, setChats] = useState(null);
  const [text, setText] = useState("");

  // firebase ------------------------------------------------//
  useEffect(() => {
    if (state.chatId) {
      onSnapshot(doc(db, "chats", state.chatId), (user) => {
        setChats(user.data().messages);
      });
    }
  }, [state.chatId]);
  const handleSend = async (e) => {
    if (text === "") return;
    await updateDoc(doc(db, "chats", state.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser?.uid,
        date: Timestamp.now(),
      }),
    });
    setText("");
  };
  // ---------------------------------------------------------//

  return (
    <Paper
      sx={{
        height: 700,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {!chats && (
        <Typography sx={{ textAlign: "center" }} variant="h4">
          No Room Chat
        </Typography>
      )}
      {chats && state.user && (
        <>
          <Box
            sx={{
              padding: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar />
              <Typography variant="body2">{state.user.displayName}</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton>
                <CallIcon />
              </IconButton>
              <IconButton>
                <VideocamIcon />
              </IconButton>
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Stack>
          </Box>
          <Divider />
        </>
      )}
      {chats && (
        <Box
          sx={{
            flex: 1,
            paddingY: 3,
            paddingX: 2,
            display: "flex",
            flexDirection: "column",
            rowGap: 3,
            overflow: "auto",
          }}
        >
          {chats.map((chat) => (
            <Message
              owner={currentUser?.uid === chat.senderId}
              key={chat.id}
              chat={chat}
            />
          ))}
        </Box>
      )}

      {chats && (
        <BoxStyled>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="messages"
            variant="filled"
            fullWidth
          />
          <ButtonStyled
            onClick={handleSend}
            endIcon={<SendIcon />}
            variant="contained"
            size="small"
          >
            Send
          </ButtonStyled>
        </BoxStyled>
      )}
    </Paper>
  );
};

export default Chats;
