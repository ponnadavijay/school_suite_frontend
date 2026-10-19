import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
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
      onSuccess: async (data) => {
        if (data?.message && data.message !== "User does not exist") {
          const accessToken = (data as any).access_token || (data as any).token || "";
          const refreshToken = (data as any).refresh_token || "";
          
          let userObj = null;
          if (accessToken) {
            try {
              const payloadBase64 = accessToken.split('.')[1];
              const payloadDecoded = JSON.parse(atob(payloadBase64));
              userObj = payloadDecoded.user || payloadDecoded;
              
              // Map old AuthContext expectations to new user schema
              userObj = {
                ...userObj,
                role: { role_id: userObj.role_id, role_name: userObj.role_name },
                organization: { org_id: userObj.tenant_id, org_name: "Tech Patashala" }
              };
            } catch (e) {
              console.error("Failed to parse JWT", e);
            }
          }

          await setAuthData(userObj, accessToken, refreshToken);
          navigate("/dashboard");
        } else if (data?.message === "User does not exist") {
          setSignInError("User does not exist. Please check your credentials.");
        } else {
          navigate("/dashboard");
        }
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
            <div className="login-button-container">
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
            </div>
            <Box className="login-links">
              <Link to="/register" className="registher-link">{"Don't have an account? Sign Up"}</Link>
            </Box>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default LoginPage;
