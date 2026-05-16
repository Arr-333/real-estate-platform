"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function BrokerDashboard() {
  const router = useRouter();

  const [broker, setBroker] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⚠️ Replace with logged-in broker id if needed
  const brokerId = 1;

  useEffect(() => {
    fetchBroker();
  }, []);

  const fetchBroker = async () => {
    try {
      const res = await axios.get(`/api/broker/${brokerId}`);
      setBroker(res.data);
    } catch (error) {
      toast.error("Failed to load broker profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography align="center">Loading...</Typography>;
  }

  if (!broker) {
    return <Typography align="center">Broker not found</Typography>;
  }

  return (
    <>
      <br />
      <br />
      <br />
      <br />

      <Box maxWidth={800} mx="auto" mt={5}>
        <Typography variant="h4" mb={3}>
          Broker Dashboard
        </Typography>

        <Card>
          <CardContent>
            <Typography variant="h6">Name</Typography>
            <Typography mb={2}>{broker.name}</Typography>

            <Typography variant="h6">Email</Typography>
            <Typography mb={2}>{broker.email}</Typography>

            <Typography variant="h6">Location</Typography>
            <Typography mb={2}>{broker.location || "N/A"}</Typography>

            <Typography variant="h6">Mobile Phone</Typography>
            <Typography mb={2}>{broker.phoneMobile || "N/A"}</Typography>

            <Typography variant="h6">Office Phone</Typography>
            <Typography mb={2}>{broker.phoneOffice || "N/A"}</Typography>

            <Typography variant="h6">Language</Typography>
            <Typography mb={2}>{broker.language || "N/A"}</Typography>

            <Typography variant="h6">About</Typography>
            <Typography mb={2}>{broker.about || "N/A"}</Typography>

            <Typography variant="h6">Bio</Typography>
            <Typography mb={3}>{broker.bio || "N/A"}</Typography>

            <Button
              variant="contained"
              onClick={() => router.push(`/broker/edit/${broker.id}`)}
            >
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
