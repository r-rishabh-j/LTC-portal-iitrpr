import React from 'react'
import { Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import HistoryIcon from "@material-ui/icons/History";
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import RateReviewIcon from "@material-ui/icons/RateReview";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import { NavLink } from 'react-router-dom';
import { useStyles } from './HeaderStyles';
import Logout from '../Body/Dashboard/Logout';



export default function SideNavData({handleDrawerClose, userType}) {
    
    const classes = useStyles();

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
      {
        label: "Current Applications",
        link: "/current",
        icon: <NotificationsIcon />,
      },
      {
        label: "Past Applications",
        link: "/previous",
        icon: <HistoryIcon />,
      },
    ];

    const establishmentList = [
      { label: "Home", link: "/home", icon: <HomeIcon /> },
      { label: "New Applications", link: "/new", icon: <NewReleasesIcon /> },
      {
        label: "Past Applications",
        link: "/past",
        icon: <HistoryIcon />,
      },
      {
        label: "For Review",
        link: "/review",
        icon: <RateReviewIcon />,
      },
      {
        label: "Office Orders",
        link: "/office_orders",
        icon: <AttachFileIcon />,
      },
    ];

    const accountsList = [
      { label: "Home", link: "/home", icon: <HomeIcon /> },

      { label: "New Applications", link: "/new", icon: <NewReleasesIcon /> },
      {
        label: "Past Applications",
        link: "/past",
        icon: <HistoryIcon />,
      },
      {
        label: "Payment History",
        link: "/payment",
        icon: <AccountBalanceIcon />,
      },
    ];

    const deanfaList = [
      { label: "Home", link: "/home", icon: <HomeIcon /> },

      { label: "New Applications", link: "/new", icon: <NewReleasesIcon /> },
      {
        label: "Past Applications",
        link: "/past",
        icon: <HistoryIcon />,
      },
     
    ];

    const auditList = [
      { label: "Home", link: "/home", icon: <HomeIcon /> },

      { label: "New Applications", link: "/new", icon: <NewReleasesIcon /> },
      {
        label: "Past Applications",
        link: "/past",
        icon: <HistoryIcon />,
      },
    ];

    const registrarList = [
      { label: "Home", link: "/home", icon: <HomeIcon /> },

      { label: "New Applications", link: "/new", icon: <NewReleasesIcon /> },
      {
        label: "Past Applications",
        link: "/past",
        icon: <HistoryIcon />,
      },
    ];

    let listItemData;
    switch (userType) {
      case "admin":
        listItemData = adminList;
        break;
      case "establishment":
        listItemData = establishmentList;
        break;
      case "accounts":
        listItemData = accountsList;
        break;
      case "audit":
        listItemData = auditList;
        break;
      case "registrar":
        listItemData = registrarList;
        break;
      case "deanfa":
        listItemData = deanfaList;
        break;
      default:
        listItemData = applicantList;
        break;
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
    <Logout/>
    </>
  );
}
