import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {axiosInstance} from "./axios";
import {useToast} from "./contexts/ToastContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Register = () => {
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const navigate = useNavigate();
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassw, setErrorPassw] = useState("");
  const [errorConfirmPassw, setErrorConfirmPassw] = useState("");
  const [errorName, setErrorName] = useState("");
  const [loading, setLoading] = useState(false);

  const HEADER_HEIGHT = 64;
  // Email page
 const handleEmailCheck = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        'http://localhost:8000/user/email-availability',
        { email: email },
      );

      if (response.data === true) {
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        setErrorEmail("Email already taken!");
        return false;
      }
    } catch (error) {
      setLoading(false);
      showToast("Internal Server Error");
      return false;
    }
  };

   const handleEmailBlur = async () => {
    if (errorEmail) {
      setErrorEmail("");
    }
    await handleEmailCheck();
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setErrorPassw("Minimum length is 8");
      return false;
    } else {
      const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
      if (!specialChars.test(password)) {
        setErrorPassw("Password must contain at least one special character");
        return false;
      } else {
        setErrorPassw("");
        return true;
      }
    }
  };

  const handleErrorFocus = () => {
  if (errorEmail) {
    setErrorEmail("");
  }
  if (errorPassw) {
    setErrorPassw("");
  }
  if (errorConfirmPassw) {
    setErrorConfirmPassw("");
  }
  if (errorName) {
    setErrorName("");
  }
  };

  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!email) {
      setErrorEmail("Email is required");
      return;
    }

    if (!password) {
      setErrorPassw("Password is required");
      return;
    }

    if (!confirmPassword) {
      setErrorConfirmPassw("Password confirmation is required");
      return;
    }

    if (!first_name) {
      setErrorName("Name is required");
      return;
    }

    const isEmailAvailable = await handleEmailCheck();
    if (!isEmailAvailable) {
      setLoading(false);
      return;
    }

    const isPasswordValid = validatePassword(password);
    if (!isPasswordValid) {
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setLoading(false);
      setErrorConfirmPassw("Passwords do not match");
      return;
    }

    const user = {
      email: email,
      password: password,
      first_name: first_name,
    };
    try {
      const {data} = await axiosInstance.post(
          'http://localhost:8000/user/register',
          user,
      );
      if (data.success) {
        setLoading(false);
        showToast(data.message, data.status);
        navigate("/login");
      } else {
        setLoading(false);
        showToast(data.error, 500);
      }
    } catch (error) {
      setLoading(false);
      showToast("Internal server error", 500);
      console.error("Error: ", error);
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
      maxWidth: '500px',
      margin: 'auto',
      padding: '20px',
      borderRadius: '8px',
      marginTop: `${HEADER_HEIGHT}px`,
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      backgroundColor: 'white',
    }}
    onSubmit={submit}
  >
    <Typography variant="h3">Register</Typography>
    <div>
      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={handleEmailBlur}
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
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onFocus={handleErrorFocus}
        helperText={errorConfirmPassw}
        margin="normal"
        className={errorConfirmPassw ? 'error-text-field' : ''}
        sx={errorStyles}
      />
    </div>
    <div>
      <TextField
        fullWidth
        label="Name"
        type="text"
        value={first_name}
        onChange={(e) => setFirst_name(e.target.value)}
        onFocus={handleErrorFocus}
        helperText={errorName}
        margin="normal"
        className={errorName ? 'error-text-field' : ''}
        sx={errorStyles}
      />
    </div>
    <div>
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Register
      </Button>
    </div>
  </Box>
);
};
export default Register;