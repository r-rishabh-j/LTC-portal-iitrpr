import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { ListItem, ListItemIcon, ListItemText, Avatar } from "@mui/material";
import { Link } from "react-router-dom";

import altImage from "./avatar.png";

export default function Profile(props) {

  const [anchorEl, setAnchorEl] = useState(null);
  // const image = JSON.parse(sessionStorage.getItem('profile')).picture;
  const image = props.picture;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    axios({
      method: "POST",
      url: "/api/logout",
    })
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  const dropDownData = [
    { label: "Logout", icon: <ExitToAppIcon />, link: "/" }
  ]

  return (
    <Box>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={<Avatar src={image} alt={altImage} referrerPolicy={"no-referrer"}></Avatar>}
      ></Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {dropDownData.map((item, i) => (
          <MenuItem key={i} component={Link} to={item.link} onClick={handleClose}>
            <Box
              display="flex"
              justifyContent="space-between"
              onClick={logOut}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
