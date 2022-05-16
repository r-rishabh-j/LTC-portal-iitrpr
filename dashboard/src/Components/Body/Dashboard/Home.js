import React from 'react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Paper, Typography, Box, Button } from '@material-ui/core'
import { useStyles } from "../../Header/HeaderStyles.js";
import NotificationsPausedIcon from "@material-ui/icons/NotificationsPaused";
import ClearIcon from '@material-ui/icons/Clear';
import { Alert, AlertTitle } from '@mui/material';
const moment = require('moment');
/**
 * 
 * @description: Home page. 
 * @returns 
 */

export default function Home() {
  const classes = useStyles();
  const sizeRef = useRef();

  const [profileInfo, setProfileInfo] = useState({});
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/is-logged-in",
      data: {},
    })
      .then((response) => {
        setProfileInfo(response.data.claims);
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
        // console.log(response.data.notifications)
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

  function formatDate(date) {
    const d = moment(date).format("MMMM Do YYYY, h:mm a");
    return d;
  }

  return (
    <>
      <Box ref={sizeRef}
        style={{ display: "flex", flexFlow: "column" }}
      >
        <Box
          style={{
            margin: "0 0 0 3vw",
            minHeight: "calc(100vh - 81px)",
            flex: "1 1 auto",
            width: "auto"
          }}
        >

          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5" style={{ visibility: "hidden" }}>
              Notifications
            </Typography>
            <Button
              title='Clear Notifications'
              variant="contained"
              style={{ borderRadius: "35%", marginRight: "1vw" }}
              onClick={clearNotifications}
            >
              <ClearIcon />
            </Button>
          </Box>
          {notifications === null ?
           (
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
                    Loading......
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )
           :
            (notifications.length !== 0 ? (
              // <center>
              <div style={{ listStyle: "none" }}>
                {notifications.map((item, i) => (
                  <li key={i}>
                    <Box display="flex" text-overflow="ellipsis" title={item.content}>
                      <Alert severity={item.level === undefined ? "info" : item.level} style={{
                        height: "auto",
                        width: "100%",
                        margin: "1vw",
                        overflowX: "wrap",
                      }}>
                        <AlertTitle justifyContent="center">{formatDate(item.time)}</AlertTitle>
                        <div style={{ textOverflow: "ellipsis" }}>
                          <Typography variant="body1" style={{ padding: "0.5vh" }}>
                            {item.content}
                          </Typography>
                        </div>
                      </Alert>
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
            ))}
        </Box>
      </Box>
    </>
  );
}
