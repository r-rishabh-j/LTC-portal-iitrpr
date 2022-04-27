import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Paper, Typography, Box, Button } from '@material-ui/core'
import { useStyles } from "../../Header/HeaderStyles.js";
import NotificationsPausedIcon from "@material-ui/icons/NotificationsPaused";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { margin, typography } from '@mui/system';
import ClearIcon from '@material-ui/icons/Clear';
import { Alert, AlertTitle } from '@mui/material';

export default function Home() {
  const classes = useStyles();
  const sizeRef = useRef();

  const [profileInfo, setProfileInfo] = useState({});
  const [notifications, setNotifications] = useState([])

  // var h = sizeRef.current.offsetHeight;

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
      data: {}
    })
      .then((response) => {
        console.log(response.data.notifications)
        setNotifications(response.data.notifications)
        // const notif = [
        //   { time: "100", content: "this is an extremely big big big big big bignotification message" },
        //   { time: "100", content: "this is an extremely big notificationmessagehhhhhhhhhhdhdhdhdhhdhdhdhdhdhhdbakcbkhebehfbhfbhebfhbrfkrbfhkrbfhkrbf khbrkfbrkhfbrkhfbrhkbfhkrbfhkrbfhkrbfhkbrhkfbrhkfbrhkfbrkhbfhkrb" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
        //   { time: "100", content: "this is an extremely big notification message" },
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
        style={{ display: "flex", flexFlow: "column" }}
      // justifyContent="space-between"
      >
        {/* <Box style={{ flex: "0 1 auto", height:"35vh" }}>
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
          
        </Box> */}



        {/* <Paper
          // elevation={10}
          style={{
            margin: "0 0 0 3vw",
            // height: "calc(`100vh - sizeRef.current.offsetHeight`)",
            minHeight: "91.5vh",
            width: "80vw",
            backgroundColor: "#efefef",
            // overflowY: "scroll",
            flex: "1 1 auto",
          }}
        > */}

        <Box
          style={{
            margin: "0 0 0 3vw",
            minHeight: "calc(100vh - 81px)",
            // minHeight: "89vh",
            // width: "80vw",
            // backgroundColor: "#efefef",
            // overflowY: "scroll",
            // overflow:"auto",
            flex: "1 1 auto",
            width: "auto"
          }}
        >

          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5" style={{ visibility: "hidden" }}>
              Notifications
            </Typography>
            {/* <Typography variant="h5">Notifications</Typography> */}

            <Button
              title='Clear Notifications'
              variant="contained"
              // color="primary"
              style={{ borderRadius: "35%" }}
              onClick={clearNotifications}
            >
              <ClearIcon />
            </Button>
          </Box>
          {notifications.length !== 0 ? (
            // <center>
              <div style={{ listStyle: "none" }}>
                {/* <Alert severity="info">
                <AlertTitle>Info</AlertTitle>
                This is an info alert — <strong>check it out!</strong>
              </Alert> */}
                {notifications.map((item, i) => (
                  <li key={i}>
                    <Box display="flex" text-overflow="ellipsis" title={item.content}>
                      <Alert severity={item.level===undefined ? "info": item.level} style={{
                          height: "auto",
                          width: "100%",
                          margin: "1vw",
                          // textAlign: "center",
                          overflowX: "wrap"
                          // overflow: "hidden",
                          // whiteSpace: "nowrap",
                          // textOverflow: "ellipsis"
                        }}>
                        <AlertTitle justifyContent="center">Info</AlertTitle>
                        <div style={{ textOverflow: "ellipsis" }}>
                          <Typography variant="body1" style={{ padding: "0.5vh" }}>
                            {item.time+': '+item.content}
                          </Typography>
                        </div>
                        {/* This is an info alert — <strong>check it out!</strong> */}
                      </Alert>
                      {/* <Paper
                        elevation={0}
                        style={{
                          height: "auto",
                          width: "100%",
                          margin: "1vw",
                          textAlign: "center",
                          overflowX: "wrap"
                          // overflow: "hidden",
                          // whiteSpace: "nowrap",
                          // textOverflow: "ellipsis"
                        }}
                      >
                        <NotificationsActiveIcon />
                        <div style={{ textOverflow: "ellipsis" }}>
                          <Typography variant="body1" style={{ padding: "0.5vh" }}>
                            {item.time+': '+item.content}
                          </Typography>
                        </div>
                      </Paper> */}
                    </Box>
                  </li>
                ))}
              </div>
            // </center>
          ) : (
            <Box display="flex" justifyContent="center">
              <Paper
                elevation={0}
                style={{
                  height: "auto",
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
          {/* </Paper> */}
        </Box>
      </Box>
    </>
  );
}
