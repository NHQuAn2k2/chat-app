import { Button, Link, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  // state ------------------------------------------------//
  const navigate = useNavigate();
  const [dataForm, setDataForm] = useState({
    displayName: "",
    email: "",
    password: "",
  });

  // firebase -------------------------------------------//
  const handleRegister = async () => {
    try {
      const userDoc = await createUserWithEmailAndPassword(
        auth,
        dataForm.email,
        dataForm.password
      );
      const { user } = userDoc;
      await updateProfile(user, { displayName: dataForm.displayName });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      });
      await setDoc(doc(db, "userChats", user.uid), {});
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  //------------------------------------------------------//

  return (
    <div>
      <Paper sx={{ width: 500, padding: 3, marginX: "auto", marginTop: 10 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Chat App
        </Typography>
        <TextField
          onChange={(e) =>
            setDataForm({ ...dataForm, displayName: e.target.value })
          }
          fullWidth
          variant="outlined"
          label="DisplayName"
        />
        <TextField
          onChange={(e) => setDataForm({ ...dataForm, email: e.target.value })}
          sx={{ marginY: 3 }}
          fullWidth
          variant="outlined"
          label="Email"
        />
        <TextField
          onChange={(e) =>
            setDataForm({ ...dataForm, password: e.target.value })
          }
          fullWidth
          variant="outlined"
          label="Password"
        />
        <Button
          onClick={handleRegister}
          variant="contained"
          fullWidth
          sx={{ marginTop: 3 }}
        >
          Register
        </Button>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          you do have an account?{" "}
          <Link href="/login" underline="hover">
            Login
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default RegisterPage;
