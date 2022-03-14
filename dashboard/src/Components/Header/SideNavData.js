import React from 'react'
import { Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HistoryIcon from "@material-ui/icons/History";
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { NavLink } from 'react-router-dom';
import { useStyles } from './HeaderStyles';
import useToken from '../Tokens/useToken';
import Logout from '../Body/Dashboard/Logout';



export default function SideNavData({handleDrawerClose, userType}) {
    
    const classes = useStyles();
    const { token, removeToken, setToken } = useToken();

    const applicantList = [
      { label: "Home", link: "/home", icon: <HomeIcon /> },
      { label: "New Application", link: "/create", icon: <AddIcon /> },
      { label: "Past Applications", link: "/past", icon: <HistoryIcon /> },
      {
        label: "Notifications",
        link: "/notifications",
        icon: <NotificationsIcon />,
      },
      //{ label: "Logout", link: "/logout", icon: <ExitToAppIcon /> },
    ];

    const adminList = [
      { label: "Home", link: "/home", icon: <HomeIcon /> },
      { label: "Users", link: "/users", icon: <AddIcon /> },
      { label: "Current Applications", link: "/current", icon: <HistoryIcon /> },
      {
        label: "Previous Applications",
        link: "/previous",
        icon: <NotificationsIcon />,
      },
      //{ label: "Logout", link: "/logout", icon: <ExitToAppIcon /> },
    ];
    let listItemData;
    if(userType === "admin"){
      listItemData = adminList;
    }
    else{
      listItemData = applicantList;
    }
    
    
  return (
    <>
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
            // activeClassName={classes.activeNavlinks}
            sx = {{width: "100%", textTransform: "capitalize"}}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </ListItem>
        </Button>
        
      ))}
    </List>
    <Logout removeToken={removeToken} token={token} setToken={setToken}/>
    </>
  );
}
