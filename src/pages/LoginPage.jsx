import { Button, Link, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  // state ----------------------------------------------//
  const navigate = useNavigate();
  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  // firebase --------------------------------------------//
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, dataForm.email, dataForm.password);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  //-----------------------------------------------------//

  return (
    <div>
      <Paper sx={{ width: 500, padding: 3, marginX: "auto", marginTop: 10 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Chat App
        </Typography>
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
          onClick={handleLogin}
          variant="contained"
          fullWidth
          sx={{ marginTop: 3 }}
        >
          Login
        </Button>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          you don't have an account?{" "}
          <Link href="/register" underline="hover">
            Register
          </Link>
        </Typography>
      </Paper>
    </div>
  );
};

export default LoginPage;
