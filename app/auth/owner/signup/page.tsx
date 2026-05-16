"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  useMediaQuery,
  useTheme,
  Box,
  Typography,
  MenuItem,
} from "@mui/material";
import { validateEmail } from "../../../../src/components/validations";
// import CloseIcon from "@mui/icons-material/Close";

const accountTypes = [
  { value: "customer", label: "Customer" },
  { value: "broker", label: "Broker" },
  { value: "admin", label: "Admin" },
];

const COMMON_PASSWORDS = ["Passw0rd", "Password123"];

export default function SignupPage() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("OWNER");
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    accountType: false,
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    accountType: "",
  });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    "";
    let valid = true;
    const newErrors = { email: "", password: "", accountType: "" };

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,30}$/;

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and number";
      valid = false;
    } else if (COMMON_PASSWORDS.includes(password)) {
      newErrors.password = "This password is too common. Choose another.";
      valid = false;
    }

    if (!accountType) {
      newErrors.accountType = "Account type is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    setTouched({ email: true, password: true, accountType: true });
    if (!validate()) return;
    setLoading(true);
    console.log(
      "i am sending email:",
      email,
      "and role:",
      accountType,
      password
    );

    try {
      await axios.post("/api/user/registration", {
        email,
        password,
        role: accountType,
      });

      toast.success("Account created! Check your email for verification.");

      router.push(`/verification/mail?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    signIn("google", { callbackUrl: "/test" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f2f2",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3}>
          Create Account
        </Typography>

        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          {/* <Typography fontWeight={600}>Account Type</Typography> */}

          <Typography fontWeight={600}>Email Address</Typography>
          <TextField
            required
            fullWidth
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setTouched((t) => ({ ...t, email: true }));
            }}
            error={Boolean(errors.email) && touched.email}
            helperText={touched.email && errors.email}
          />

          <Typography fontWeight={600}>Password</Typography>
          <TextField
            required
            fullWidth
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setTouched((t) => ({ ...t, password: true }));
            }}
            error={Boolean(errors.password) && touched.password}
            helperText={touched.password && errors.password}
          />
        </Box>

        <Box mt={3}>
          <Button
            onClick={handleSignup}
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ fontWeight: "bold", fontSize: 18, py: 1.3 }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Box>

        <Typography align="center" mt={3}>
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            style={{ color: "#ff9000", cursor: "pointer", fontWeight: 600 }}
          >
            Login here
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
