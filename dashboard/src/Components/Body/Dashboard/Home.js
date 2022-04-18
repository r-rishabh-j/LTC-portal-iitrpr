import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Paper, Typography, Box, Button } from '@material-ui/core'
import { useStyles } from "../../Header/HeaderStyles.js";
import NotificationsPausedIcon from "@material-ui/icons/NotificationsPaused";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { margin, typography } from '@mui/system';

export default function Home() {
  const classes = useStyles();
  const sizeRef = useRef();
  
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
      // const notif = [
      //   {time: "100", content: "this is an extremely big big big big big bignotification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      //   {time: "100", content: "this is an extremely big notification message"},
      // ]
      // setNotifications(notif)
      
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
      <Box ref={sizeRef}
      style={{display: "flex", flexFlow: "column", height: "100%" }}
      // justifyContent="space-between"
      >
        <Box style={{flex: "0 1 auto"}}>
          <center>
            <img
              src={profileInfo.picture}
              alt="Profile image"
              style={{ width: "10vw", borderRadius: "50%" }}
              referrerPolicy={"no-referrer"}
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
        <Paper
          // elevation={10}
          style={{
            margin: "0 0 0 3vw",
            // height: calc(`100vh - ${sizeRef.current.offsetHeight}`),
            height: "100vh",
            width: "80vw",
            backgroundColor: "#efefef",
            overflowY: "scroll",
            flex: "1 1 auto"
            
          }}
        >
          
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5" style={{ visibility: "hidden" }}>
              Notifications
            </Typography>
            {/* <Typography variant="h5">Notifications</Typography> */}
            <Button
              variant="contained"
              color="primary"
              onClick={clearNotifications}
            >
              Clear
            </Button>
          </Box>
          

          {notifications.length !== 0 ? (
            <center>
            <div style={{ listStyle: "none" }}>
              {notifications.map((item, i) => (
                <li key={i}>
                  <Box display="flex" justifyContent="center" text-overflow="ellipsis">
                    <Paper
                      elevation={0}
                      style={{
                        height: "10vh",
                        width: "100%",
                        margin: "1vw",
                        textAlign: "center",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis"
                        }}
                    >
                      <NotificationsActiveIcon />
                      <div style = {{textOverflow: "ellipsis"}}>
                      <Typography variant="body1" style={{ padding: "0.5vh" }}>
                        {item.content}
                      </Typography>
                      </div>
                    </Paper>
                  </Box>
                </li>
              ))}
            </div>
            </center>
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
                <Box style={{ margin: "5vh" }}>
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
      </Box>
    </>
  );
}
