import React from "react";
import { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { ListItem, List, ListItemText} from "@mui/material";


export default function Notification() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dropDownData = [
    { label: "Lorem" , desc:"submiited LTC Application"},
    { label: "Ipsum", desc:"requires Office Order" },
    { label: "Dolor", desc:"requires advance payment processing" },
  ];

  return (
    <Box>
      <IconButton
        aria-controls="notification"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Badge badgeContent={4} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="notification"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      ><List>
        {dropDownData.map((item, i) => (
          <ListItem key={i} component={ListItem} onClick={handleClose}>
            {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
            <ListItemText
              primary={item.label}
              secondary={item.desc}
            > </ListItemText>
          </ListItem>
        ))}
        </List>
      </Menu>
    </Box>
  );
}
