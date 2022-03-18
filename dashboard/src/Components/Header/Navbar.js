import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Profile from './Navtabs/Profile';
import Notification from './Navtabs/Notification';
import Hidden from "@material-ui/core/Hidden";
import MenuIcon from "@material-ui/icons/Menu";
import { IconButton } from '@material-ui/core';
import { useStyles } from './HeaderStyles';


export default function Navbar({ handleDrawerToggle }) {
  const classes = useStyles();

  return (
    <AppBar position="sticky" style={{ background: '#0c979c' }}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          LTC Portal
        </Typography>
        <Hidden smDown>
          <Notification />
          <Profile />
        </Hidden>
        <Hidden mdUp>
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}
