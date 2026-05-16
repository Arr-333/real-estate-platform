"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { TextField, Button, Box, Typography } from "@mui/material";
import { toast } from "react-toastify";

export default function EditBrokerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [broker, setBroker] = useState({
    name: "",
    email: "",
    location: "",
    phoneOffice: "",
    phoneMobile: "",
    about: "",
    language: "",
    bio: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch broker
  useEffect(() => {
    if (id) fetchBroker();
  }, [id]);

  const fetchBroker = async () => {
    try {
      const res = await axios.get(`/api/broker/${id}`);
      setBroker(res.data);
    } catch (error) {
      toast.error("Failed to fetch broker");
    }
  };

  const handleChange = (e) => {
    setBroker({ ...broker, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();

      Object.keys(broker).forEach((key) => {
        formData.append(key, broker[key]);
      });

      if (image) {
        formData.append("image", image);
      }

      await axios.put(`/api/broker/${id}`, formData);

      toast.success("Broker updated successfully");

      router.push("/broker");
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Typography variant="h5" mb={3}>
        Update Broker
      </Typography>

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={broker.name || ""}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Email"
        name="email"
        value={broker.email || ""}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Location"
        name="location"
        value={broker.location || ""}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Office Phone"
        name="phoneOffice"
        value={broker.phoneOffice || ""}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Mobile Phone"
        name="phoneMobile"
        value={broker.phoneMobile || ""}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="Language"
        name="language"
        value={broker.language || ""}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        label="About"
        name="about"
        value={broker.about || ""}
        onChange={handleChange}
        margin="normal"
      />

      <TextField
        fullWidth
        multiline
        rows={4}
        label="Bio"
        name="bio"
        value={broker.bio || ""}
        onChange={handleChange}
        margin="normal"
      />

      <Box mt={2}>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 3 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Broker"}
      </Button>
    </Box>
  );
}
