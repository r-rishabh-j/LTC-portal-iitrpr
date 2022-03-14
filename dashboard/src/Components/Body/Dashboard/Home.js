import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {Grid, Paper, Typography, Box} from '@material-ui/core'

export default function Home() {

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
    <Grid container>
      <Grid item xs={4}>
        <Box style={{ margin: "3vw 0 0 5vw" }}>
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
        </Box>
      </Grid>
      <Grid item xs={8}>
        <Paper
          elevation={10}
          style={{ margin: "0 0.5vw 0 0", height: "100vh", width: "100%" }}
        >
          <Box style={{ margin: "0 0 0 30vw" }}>
            <Typography variant="h4" style={{ fontWeight: "bold" }}>
              Welcome
            </Typography>
          </Box>
        </Paper>
      </Grid>
      {/* <Paper
        elevation={10}
        style={{ margin: "3vh 0.5vw 0 3vw", height: "50vh", width: "100%" }}
      >
        <Typography>Recent</Typography>
      </Paper> */}
    </Grid>
  );
}
