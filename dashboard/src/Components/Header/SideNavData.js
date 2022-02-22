import React from 'react'
import { Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HistoryIcon from "@material-ui/icons/History";
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AddIcon from "@material-ui/icons/Add";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { NavLink } from 'react-router-dom';
import { useStyles } from './HeaderStyles';


export default function SideNavData({handleDrawerClose}) {
    const classes = useStyles();
    const listItemData = [
      { label: "Home", link: "/home", icon: <HomeIcon /> },
      { label: "New Application", link: "/create", icon: <AddIcon /> },
      { label: "Past Applications", link: "/past", icon: <HistoryIcon /> },
      { label: "Notifications", link: "/notifications", icon: <NotificationsIcon /> },
      { label: "Logout", link: "/logout", icon: <ExitToAppIcon /> },
    ];
  return (
    <List>
      {listItemData.map((item, i) => (
        <Button
          key={i}
          size="small"
          className={classes.navButton}
          onClick={handleDrawerClose}
          
        >
          <ListItem
            component={NavLink}
            to={item.link}
            className={classes.navlinks}
            activeClassName={classes.activeNavlinks}
            sx = {{width: "100%", textTransform: "capitalize"}}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </ListItem>
        </Button>
      ))}
    </List>
  );
}
