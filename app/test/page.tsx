"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import {
  CheckCircle,
  Email,
  Person,
  VpnKey,
  Image as ImageIcon,
  Logout,
  Home,
  Code,
} from "@mui/icons-material";
import LetterAvatar from "@/components/LetterAvatar";

export default function TestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading session...
        </Typography>
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingTop: "100px",
        paddingBottom: "40px",
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            marginBottom: 4,
            background: "white",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: 4,
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <LetterAvatar
              name={session?.user?.name || undefined}
              email={session?.user?.email || undefined}
              image={session?.user?.image || undefined}
              size={80}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome Back! 🎉
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Your authentication was successful
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={handleGoHome}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
                }}
              >
                Home
              </Button>
              <Button
                variant="contained"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.3)" },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Status Card */}
        <Grid container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid item xs={12} md={4}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CheckCircle sx={{ fontSize: 48 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Status
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      Authenticated
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                background:
                  session?.user?.provider === "credentials"
                    ? "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                    : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                color: "white",
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <VpnKey sx={{ fontSize: 48 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Login Method
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      textTransform="capitalize"
                    >
                      {session?.user?.provider === "credentials"
                        ? "Email/Password"
                        : session?.user?.provider || "N/A"}
                    </Typography>
                    {session?.user?.provider === "credentials" && (
                      <Chip
                        label="✓ Verified"
                        size="small"
                        sx={{
                          mt: 1,
                          backgroundColor: "rgba(255, 255, 255, 0.3)",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                color: "white",
                height: "100%",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Person sx={{ fontSize: 48 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      User ID
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {session?.user?.id || "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* User Information Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ padding: 3 }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  User Information
                </Typography>
                <Stack spacing={2.5}>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Person color="primary" />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        Name
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="500">
                      {session?.user?.name || "Not provided"}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Email color="primary" />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        Email Address
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="500">
                      {session?.user?.email || "Not provided"}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <ImageIcon color="primary" />
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        fontWeight="bold"
                      >
                        Profile Picture
                      </Typography>
                    </Box>
                    {session?.user?.image ? (
                      <Box sx={{ mt: 1 }}>
                        <LetterAvatar
                          name={session.user.name || undefined}
                          email={session.user.email || undefined}
                          image={session.user.image}
                          size={60}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No profile picture available
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card elevation={4} sx={{ borderRadius: 3, height: "100%" }}>
              <CardContent sx={{ padding: 3 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
                >
                  <Code color="primary" />
                  <Typography variant="h5" fontWeight="bold">
                    Session Data
                  </Typography>
                </Box>
                <Paper
                  variant="outlined"
                  sx={{
                    padding: 2,
                    backgroundColor: "#f8f9fa",
                    borderRadius: 2,
                    maxHeight: "400px",
                    overflow: "auto",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      fontFamily: "monospace",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {JSON.stringify(session, null, 2)}
                  </pre>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Email/Password Login Status */}
        {session?.user?.provider === "credentials" && (
          <Paper
            elevation={4}
            sx={{
              borderRadius: 3,
              padding: 3,
              marginTop: 4,
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Email sx={{ fontSize: 40 }} />
              <Typography variant="h5" fontWeight="bold">
                Email/Password Authentication Confirmed
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ opacity: 0.95 }}>
              You have successfully logged in using your email and password
              credentials. This authentication method provides secure access to
              your account.
            </Typography>
          </Paper>
        )}

        {/* Footer Info */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
            This is a test page to verify your authentication status
            {session?.user?.provider === "credentials" &&
              " - Email/Password login detected"}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
