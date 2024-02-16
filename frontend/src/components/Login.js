import {useContext, useState} from "react";
import {jwtDecode} from "jwt-decode";
import AuthContext from "./contexts/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {axiosInstance} from "./axios";
import Cookies from "js-cookie";
import {useToast} from "./contexts/ToastContext";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
//import "react-toastify/dist/ReactToastify.css";

const HEADER_HEIGHT = 64;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const showToast = useToast();
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassw, setErrorPassw] = useState("");

  const handleEmailCheck = async () => {
    try {
      setErrorEmail("");
      const response = await axiosInstance.post(
        'http://localhost:8000/user/email-check',
        {
          email: email,
        },
      );

      if (response.data.status === true) {
        return true;
      } else {
        setErrorEmail("Invalid email address!")
        return false;
      }
    } catch (error) {
      showToast("Internal Server Error");
      return false;
    }
  };

   const handleErrorFocus = () => {
  if (errorEmail) {
    setErrorEmail("");
  }
  if (errorPassw) {
    setErrorPassw("");
  }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorEmail("Email is required");
      return;
    }

    if (!password) {
      setErrorPassw("Password is required");
      return;
    }

    const isEmailValid = await handleEmailCheck();
    if (!isEmailValid) {
      return;
    }
    const user = {
      email: email,
      password: password,
    }
    try {
      const { data } = await axiosInstance.post("http://localhost:8000/user/login", user);
      const refreshTokenExpiration = 7; // 7 days
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + refreshTokenExpiration);

      Cookies.set("access_token", data.access_token);
      Cookies.set("refresh_token", data.refresh_token, {
        expires: expirationDate,
      });
      const tokenData = jwtDecode(data.access_token);

      const LoggedInUser = {
        user_id: tokenData.user_id,
        first_name: tokenData.first_name,
        email: tokenData.email,
      };

      setUser(LoggedInUser);
      navigate("/");
      showToast("Logged in successfully!", 280);

    } catch (error) {
      if (error.response || error.response) {
        setErrorPassw("Wrong password!");
      }
      else {
        showToast("An error occurred during authentication.");
      }
    }
  };

  const errorStyles = {
  '&.error-text-field .MuiInputLabel-root': {
    color: 'red',
  },
  '&.error-text-field .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: 'red',
  },
  '& .MuiFormHelperText-root': {
    color: 'red',
  },
};

  return (
    <Box
      component="form"
      sx={{
        maxWidth: "500px",
        margin: "auto",
        marginTop: `${HEADER_HEIGHT}px`,
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "white",
      }}
      onSubmit={submit}
    >
      <Typography variant="h3">Sign In</Typography>
      <div>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={handleErrorFocus}
          helperText={errorEmail}
          margin="normal"
          className={errorEmail ? 'error-text-field' : ''}
          sx={errorStyles}
        />
      </div>
      <div>
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={handleErrorFocus}
          helperText={errorPassw}
          margin="normal"
          className={errorPassw ? 'error-text-field' : ''}
          sx={errorStyles}
        />
      </div>
      <div>
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Box mt={1}>
          <Link to="/register" variant="body2">
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Box>
      </div>
    </Box>
  );

};
export default Login;