import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Grid, Paper, Typography, Box, Drawer, Hidden } from '@material-ui/core'
import { useStyles } from "../../Header/HeaderStyles.js";

export default function Home() {
  const classes = useStyles();

  const loadingProfile = {}
  const [profileInfo, setProfileInfo] = useState(loadingProfile);

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
  }, []);

  return (
    <>
      {/* <Box style={{ margin: "3vw 0 0 5vw" }}> */}
      {/* <img
        src={profileInfo.picture}
        alt="Profile image"
        style={{ width: "10vw" }}
      ></img> */}
      {/* <Typography
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
            </Typography> */}
      {/* </Box> */}

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
          <Box display="flex" justifyContent="center">
            <Typography variant="h5">Notifications</Typography>
          </Box>
          <Box display="flex" justifyContent="center">
            {/* <Typography variant="h4" style={{ fontWeight: "bold" }}>
              Welcome
            </Typography> */}
            <Paper
              elevation={10}
              style={{ height: "20vh", width: "100%", margin: "1vw" }}
            ></Paper>
          </Box>
          <Box display="flex" justifyContent="center">
            {/* <Typography variant="h4" style={{ fontWeight: "bold" }}>
              Welcome
            </Typography> */}
            <Paper
              elevation={10}
              style={{ height: "20vh", width: "100%", margin: "1vw" }}
            ></Paper>
          </Box>
          <Box display="flex" justifyContent="center">
            {/* <Typography variant="h4" style={{ fontWeight: "bold" }}>
              Welcome
            </Typography> */}
            <Paper
              elevation={10}
              style={{ height: "20vh", width: "100%", margin: "1vw" }}
            ></Paper>
          </Box>
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
