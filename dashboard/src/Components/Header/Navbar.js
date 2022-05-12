import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Profile from './Navtabs/Profile';
import Notification from './Navtabs/Notification';
import Hidden from "@material-ui/core/Hidden";
import MenuIcon from "@material-ui/icons/Menu";
import { Avatar, IconButton } from '@material-ui/core';
import { useStyles } from './HeaderStyles';

import image from './cover.jpg';

export default function Navbar({ handleDrawerToggle, profileInfo }) {
  const classes = useStyles();

  return (
    <AppBar position="sticky" style={{ background: '#263238' }}>
      <Toolbar>
        <Avatar src={image} />
        <Typography variant="h6" className={classes.title}>
          &nbsp; LTC Portal: {profileInfo.designation}
        </Typography>
        <Hidden smDown>
          <Profile picture={profileInfo.picture} />
        </Hidden>
        <Hidden mdUp>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon style={{color: "white"}}/>
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}
