"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import {
  TextField,
  Button,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";

const ROLE_REDIRECT: Record<string, string> = {
  ADMIN: "/admin/dashboard",
  CUSTOMER: "/dashboard/customer",
  BROKER: "/dashboard/broker",
  OWNER: "/dashboard/owner",
};

export default function LoginPage() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    setTouched({ email: true, password: true });
    if (!validate()) return;

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "EMAIL_NOT_VERIFIED") {
          toast.error("Please verify your email first.");
          router.push("/verification/email");
        } else {
          toast.error("Invalid credentials.");
        }
      } else {
        toast.success("Login successful!");
        // Redirect based on role}

        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role as string;

        const redirectPath = ROLE_REDIRECT[role] ?? "/";
        router.push(redirectPath);
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fdfcfc",
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
        <Typography variant="h5" fontWeight={700} mb={3} align="center">
          Welcome Back
        </Typography>

        <Typography fontWeight={600}>Email</Typography>
        <TextField
          fullWidth
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setTouched((t) => ({ ...t, email: true }));
          }}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email}
          sx={{ mb: 2 }}
        />

        <Typography fontWeight={600}>Password</Typography>
        <TextField
          fullWidth
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setTouched((t) => ({ ...t, password: true }));
          }}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          sx={{ py: 1.3, fontWeight: 700 }}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Typography align="center" mt={3}>
          Don&apos;t have an account?{" "}
          <span
            style={{ color: "#ff9000", cursor: "pointer", fontWeight: 600 }}
            onClick={() => router.push("/auth/signup")}
          >
            Sign up
          </span>
        </Typography>

        <Typography align="center" mt={1}>
          Email not verified?{" "}
          <span
            style={{ color: "red", cursor: "pointer", fontWeight: 600 }}
            onClick={() => router.push("/verification/email")}
          >
            Verify here
          </span>
        </Typography>
      </Box>
    </Box>
  );
}
