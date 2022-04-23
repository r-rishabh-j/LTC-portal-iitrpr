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
import { NavLink, Link } from 'react-router-dom';
import { useStyles } from './HeaderStyles';
import Logout from '../Body/Dashboard/Logout';
import { Box, Typography } from '@material-ui/core';
import DomainIcon from '@material-ui/icons/Domain';
import { blueGrey, blue } from "@material-ui/core/colors";
import EmailIcon from '@material-ui/icons/Email';
import Divider from '@mui/material/Divider';


export default function SideNavData({ handleDrawerClose, userType, profileInfo }) {


  const classes = useStyles();

  const applicantList = [
    { label: "Home", link: "/home", icon: <HomeIcon /> },
    { label: "New Application", link: "/create", icon: <AddIcon /> },
    { label: "Past Applications", link: "/past", icon: <HistoryIcon /> },

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
      label: "Advance Payments",
      link: "/advance-payment",
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
      <Box style={{ height: "auto", margin: "2vh 0 0 0" }}>
        <center>
          <img
            src={(profileInfo.picture===null)?require("./Navtabs/avatar.png"):profileInfo.picture}
            alt={"Profile Image"}
            style={{ width: "8vw", borderRadius: "50%" }}
            referrerPolicy={"no-referrer"}
          ></img>
          <div style={{ margin: "2vh 0 0 0" }}>
            <Typography
              variant="body1"
              style={{ fontWeight: "bold", margin: "auto", color: blueGrey["A700"] }}
            >
              {" "}
              {profileInfo.name}
            </Typography>
          </div>

          <Box>
            <div style={{ margin: "2vh 0 0 0vw" }}>
              <Typography variant="body1" style={{ margin: "auto", color: blueGrey["A700"] }}>
                {" "}
                <DomainIcon />
                &nbsp;
                {profileInfo.department}
              </Typography>
            </div>

            <div>
              <Typography variant="body1" style={{ margin: "auto", color: blueGrey["A700"] }}>
                <EmailIcon />
                {" "}
                &nbsp;
                {profileInfo.email}
              </Typography>
            </div>
          </Box>
        </center>
      </Box>
      <Divider style={{marginTop: "2vh"}} variant="middle" />
      <List style={{ margin: "0vh 0 0 0" }}>
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
              sx={{ width: "100%", textTransform: "capitalize" }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </ListItem>
          </Button>
        ))}
      </List>
      <Link to='/' style={{ textDecoration: "none" }}>
        <Logout />
      </Link>
    </>
  );
}
