import React, { FC, ReactNode } from "react";
import Box from "@mui/material/Box";
import Drawer, { DrawerProps } from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CloseIcon from "@mui/icons-material/Close";
import { Divider } from "@mui/material";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent";

type SideBarProps = {
  children?: ReactNode;
} & DrawerProps;

const SideBar: FC<SideBarProps> = ({ open, onClose, children, ...rest }) => {
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem className="!justify-between">
          <RealEstateAgentIcon titleAccess="LOGO" />
          {/* ✅ Fixed: was `() => onClose` (never called) */}
          <div
            className="cursor-pointer"
            onClick={() => onClose?.({}, "backdropClick")}
          >
            <CloseIcon />
          </div>
        </ListItem>
      </List>
      <Divider />
      <List>
        {[
          "Search for Sale",
          "Search for Lease",
          "Search for Auctions",
          "Search for Business",
        ].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => onClose?.({}, "backdropClick")}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      open={open}
      onClose={onClose}
      // ✅ Ensures it stays above navbar but doesn't fight footer
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 1 }}
      {...rest}
    >
      {DrawerList}
      {children}
    </Drawer>
  );
};

export default SideBar;
