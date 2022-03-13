import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {Grid, Paper, Typography} from '@material-ui/core'

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
      <Paper
        elevation={10}
        style={{ margin: "0 0.5vw 0 3vw", height: "100vh", width: "100%" }}
      >
        <Typography style={{ fontWeight: "bold" }}>
          Welcome {profileInfo.name}, {profileInfo.department}
        </Typography>
        <img
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&w=1000&q=80"
          alt="Profile image" width = "100vw" 
        ></img>
      </Paper>
    </Grid>
  );
}
