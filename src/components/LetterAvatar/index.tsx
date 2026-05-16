"use client";

import Avatar from "@mui/material/Avatar";
import { useMemo } from "react";

type LetterAvatarProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  size?: number;
  sx?: any;
};

const LetterAvatar = ({
  name,
  email,
  image,
  size = 40,
  sx,
}: LetterAvatarProps) => {
  const initials = useMemo(() => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "?";
  }, [name, email]);

  const backgroundColor = useMemo(() => {
    const colors = [
      "#FF6B6B", // Red
      "#4ECDC4", // Teal
      "#45B7D1", // Blue
      "#FFA07A", // Light Salmon
      "#98D8C8", // Mint
      "#F7DC6F", // Yellow
      "#BB8FCE", // Purple
      "#85C1E2", // Sky Blue
      "#F8B739", // Orange
      "#52BE80", // Green
    ];
    const index = (name || email || "").charCodeAt(0) % colors.length;
    return colors[index];
  }, [name, email]);

  return (
    <Avatar
      src={image || undefined}
      alt={name || email || "User"}
      sx={{
        width: size,
        height: size,
        backgroundColor: image ? undefined : backgroundColor,
        color: image ? undefined : "white",
        fontWeight: 600,
        fontSize: size * 0.4,
        ...sx,
      }}
    >
      {initials}
    </Avatar>
  );
};

export default LetterAvatar;
