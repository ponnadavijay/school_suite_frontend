import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Card,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import classRoom from "../../../assets/class_room.jpeg";
import "./LoginPage.css";
import { useLogin } from "./loginApi/LoginApi";
import { useAuth } from "../../context/AuthContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [signInError, setSignInError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData({
      ...signInData,
      [name]: value,
    });
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignInError("");

    loginMutation.mutate(signInData, {
      onSuccess: (data) => {
        setAuthData(data.user, data.access, data.refresh);
        navigate("/dashboard");
      },
      onError: (error: any) => {
        setSignInError("Login failed. Please check your credentials.");
        console.error(error);
      },
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${classRoom})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card>
        <Box className="login">
          <div className="login-title">
            Welcome user! Please login to continue.
          </div>
          <Box component="form" onSubmit={handleLogin} noValidate className="login-forms">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={signInData.email}
              onChange={handleChange}
              className="login-input"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={signInData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="login-input"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {signInError && <Alert severity="error">{signInError}</Alert>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="login-button"
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Box className="login-links">
              <Link to="/register">{"Don't have an account? Sign Up"}</Link>
            </Box>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default LoginPage;
