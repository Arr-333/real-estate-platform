"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { validateEmail } from "../../../src/components/validations";

export default function EmailVerificationPage() {
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const storedEmail = localStorage.getItem("verificationEmail");
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleSendVerification = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setEmailError("");

    try {
      await axios.post("/api/verifyEmail/resend-verification", { email });
      toast.success("Verification email sent!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to send verification email"
      );
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
      maxWidth={400}
      mx="auto"
      mt={8}
    >
      <Typography variant="h5">Verify Your Email</Typography>

      {/* <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      /> */}

      <TextField
        label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError(""); // clear error while typing
        }}
        error={!!emailError}
        helperText={emailError}
        fullWidth
      />

      <Button variant="contained" onClick={handleSendVerification}>
        Send Verification Link
      </Button>
    </Box>
  );
}
