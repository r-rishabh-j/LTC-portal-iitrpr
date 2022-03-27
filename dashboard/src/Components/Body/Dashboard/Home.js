import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Paper, Typography, Box, Button } from '@material-ui/core'
import { useStyles } from "../../Header/HeaderStyles.js";
import NotificationsPausedIcon from "@material-ui/icons/NotificationsPaused";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { margin, typography } from '@mui/system';

export default function Home() {
  const classes = useStyles();

  
  const [profileInfo, setProfileInfo] = useState({});
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/is-logged-in",
      data: {},
    })
      .then((response) => {
        //console.log(response.data.claims);
        setProfileInfo(response.data.claims);
        //console.log("status " + isLoggedIn);    //updated outside of useEffect
        //console.log(profileInfo)
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

    axios({
      method: "GET",
      url: "/api/getnotifications",
      data:{}
    })
    .then((response) => {
      console.log(response.data.notifications)
      setNotifications(response.data.notifications)
    })
    .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }, []);

  const clearNotifications = () => {
    //setNotifications([]);
    axios({
      method: "GET",
      url: "/api/clearnotifications",
      data: {},
    })
      .then((response) => {
        console.log(response.data);
        setNotifications([]);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });

  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "1vh 0 0 0" }}
      >
        <Paper
          // elevation={10}
          style={{
            margin: "0 0 0 3vw",
            height: "100vh",
            width: "70vw",
            backgroundColor: "#efefef",
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5" style={{ visibility: "hidden" }}>
              Notifications
            </Typography>
            <Typography variant="h5">Notifications</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={clearNotifications}
            >
              Clear
            </Button>
          </Box>

          {notifications.length !== 0 ? (
            <div style={{ listStyle: "none" }}>
              {notifications.map((item, i) => (
                <li key={i}>
                  <Box display="flex" justifyContent="center">
                    <Paper
                      elevation={0}
                      style={{
                        height: "10vh",
                        width: "100%",
                        margin: "1vw",
                        textAlign: "center",
                      }}
                    >
                      <NotificationsActiveIcon />
                      <Typography variant="body1" style={{ padding: "0.5vh" }}>
                        {item.content}
                      </Typography>
                    </Paper>
                  </Box>
                </li>
              ))}
            </div>
          ) : (
            <Box display="flex" justifyContent="center">
              <Paper
                elevation={0}
                style={{
                  height: "30vh",
                  width: "100%",
                  margin: "1vw",
                  textAlign: "center",
                }}
              > 
                <Box style={{margin: "5vh"}}>
                <NotificationsPausedIcon />
                <Typography variant="h5" style={{ padding: "0.5vh" }}>
                  No New Notifications!
                </Typography>
                <Typography>Nothing to show...</Typography>
                </Box>
              </Paper>

            </Box>
          )}
        </Paper>
        <Box>
          <center>
            <img
              src={profileInfo.picture}
              alt="Profile image"
              style={{ width: "10vw" }}
            ></img>
            <Typography
              variant="h5"
              style={{ fontWeight: "bold", margin: "auto" }}
            >
              {" "}
              {profileInfo.name}
            </Typography>
            <Typography variant="h6" style={{ margin: "auto" }}>
              {" "}
              {profileInfo.department}
            </Typography>
            <Typography variant="h6" style={{ margin: "auto" }}>
              {" "}
              {profileInfo.email}
            </Typography>
          </center>
        </Box>
      </Box>
    </>
  );
}
