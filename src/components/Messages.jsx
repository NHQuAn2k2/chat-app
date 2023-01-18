import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import React, { useCallback, useContext, useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { grey } from "@mui/material/colors";
import { AuthContext } from "../context/authContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { ChatContext } from "../context/chatContext";
import { useNavigate } from "react-router-dom";

// css -------------------------------------//
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));
//----------------------------------------------------------//

const Messages = () => {
  // state -------------------------------------------------//
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [querySearch, setQuerySearch] = useState("");
  const [userFriend, setUserFriend] = useState([]);
  const [userChat, setUserChat] = useState([]);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // firebase ---------------------------------------------//
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
    setAnchorEl(null);
  };
  const handleSearch = useCallback(
    async (e) => {
      let listSearch = [];
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("displayName", ">=", querySearch),
        where("displayName", "<=", querySearch + "utf8")
      );
      if (e.code === "Enter") {
        try {
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            listSearch.push(doc.data());
            setUserFriend(listSearch);
          });
        } catch (error) {
          console.log(error);
        }
      }
      if (querySearch === "") {
        setUserFriend([]);
        listSearch = [];
      }
    },
    [querySearch]
  );
  const handleSelect = useCallback(
    async (user) => {
      const combinedId =
        currentUser?.uid > user.uid
          ? currentUser?.uid + user.uid
          : user.uid + currentUser?.uid;
      try {
        const res = await getDoc(doc(db, "chats", combinedId));

        if (!res.exists()) {
          //create a chat in chats collection
          await setDoc(doc(db, "chats", combinedId), { messages: [] });

          //create user chats
          await updateDoc(doc(db, "userChats", currentUser?.uid), {
            [combinedId + ".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });

          await updateDoc(doc(db, "userChats", user.uid), {
            [combinedId + ".userInfo"]: {
              uid: currentUser?.uid,
              displayName: currentUser?.displayName,
            },
            [combinedId + ".date"]: serverTimestamp(),
          });
        }
        setUserFriend([]);
      } catch (err) {
        console.log(err);
      }
    },
    [currentUser?.displayName, currentUser?.uid]
  );
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser?.uid),
        (doc) => {
          setUserChat(Object.entries(doc.data()));
        }
      );
      return () => {
        unsub();
      };
    };
    currentUser?.uid && getChats();
  }, [currentUser?.uid]);
  const handleSelectChat = (user) => {
    dispatch({ type: "CHANGE-USER", payload: user });
  };
  //----------------------------------------------------------//

  return (
    <Paper sx={{ height: 600 }}>
      <Box
        sx={{
          padding: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Avatar />
          <Typography variant="body2">{currentUser?.displayName}</Typography>
        </Stack>
        <div>
          <IconButton onClick={handleClick}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem onClick={handleSignOut}>Logout</MenuItem>
          </Menu>
        </div>
      </Box>
      <Box sx={{ padding: 2, bgcolor: grey[600] }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon sx={{ color: "white" }} />
          </SearchIconWrapper>
          <StyledInputBase
            onKeyUp={handleSearch}
            onChange={(e) => setQuerySearch(e.target.value)}
            placeholder="Find Friends..."
          />
        </Search>
      </Box>
      {userFriend.length > 0 && (
        <>
          <Box sx={{ paddingY: 1 }}>
            <List>
              {userFriend.map((user) => (
                <ListItemButton
                  onClick={() => handleSelect(user)}
                  key={user.uid}
                >
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user?.displayName}
                    secondary="Hello World!!!"
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>
          <Divider />
        </>
      )}
      <Box sx={{ paddingY: 1 }}>
        <List>
          {userChat.length > 0 &&
            userChat.map((user) => (
              <ListItemButton
                onClick={() => handleSelectChat(user[1].userInfo)}
                key={user[0]}
              >
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText primary={user[1].userInfo.displayName} />
              </ListItemButton>
            ))}
        </List>
      </Box>
    </Paper>
  );
};

export default Messages;
