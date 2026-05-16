"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";
import SideBar from "../SideBar";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LetterAvatar from "../LetterAvatar";

const Header: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // const [openLogin, setOpenLogin] = useState(false);
  // const [openSignup, setOpenSignup] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show toast when user logs in via Google
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const hasShownToast = sessionStorage.getItem("loginToastShown");
      if (!hasShownToast) {
        toast.success(`Welcome, ${session.user.name || session.user.email}!`);
        sessionStorage.setItem("loginToastShown", "true");
      }
    }
    if (status === "unauthenticated") {
      sessionStorage.removeItem("loginToastShown");
    }
  }, [status, session]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    signOut();
    toast.success("Logged out successfully!");
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        elevation={isScrolled ? 4 : 0}
        sx={{
          backgroundColor: isScrolled ? "white" : "transparent",
          color: isScrolled ? "black" : "inherit",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <Toolbar className="flex items-center justify-between">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <SideBar open={open} onClose={() => setOpen(false)} />

          {/* Brand Logo */}
          <Typography
            variant="h6"
            component="div"
            className="flex gap-x-2 items-center"
          >
            <RealEstateAgentIcon /> LOGO
          </Typography>

          {/* Desktop Buttons */}
          <div className="flex gap-x-4 max-sm:hidden">
            {session?.user ? (
              <>
                <IconButton onClick={handleMenuClick}>
                  <LetterAvatar
                    name={session.user.name || undefined}
                    email={session.user.email || undefined}
                    image={session.user.image || undefined}
                    size={36}
                  />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">
                      {session.user.email}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                className="!bg-[#cf0000] !text-white !px-4"
                onClick={() => router.push("/auth/login")}
              >
                Log in
              </Button>
            )}
          </div>

          {/* Mobile Icon */}
          <div
            className="max-sm:flex sm:hidden"
            onClick={
              session?.user ? handleMenuClick : () => router.push("/auth/login")
            }
          >
            {session?.user ? (
              <LetterAvatar
                name={session.user.name || undefined}
                email={session.user.email || undefined}
                image={session.user.image || undefined}
                size={32}
              />
            ) : (
              <AccountCircleOutlinedIcon />
            )}
          </div>

          {/* <LoginDialog
            open={authType === "login"}
            onClose={() => router.push("/")}
            onOpenSignUp={() => {
              router.push("/?auth=signup");
            }}
          />
          <SignUpDialog
            open={authType === "signup"}
            onClose={() => router.push("/")}
            onOpenLogin={() => {
              router.push("/?auth=login");
            }}
          />*/}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
