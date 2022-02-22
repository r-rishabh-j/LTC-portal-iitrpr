import React from 'react'
import { useState } from 'react';
import Navbar from './Navbar'
import SideNav from './SideNav'
import {Routes, Route} from 'react-router-dom';
import Home from '../Body/Dashboard/Home';
import CreateApplication from '../Body/Dashboard/CreateApplication';
import PastApplications from '../Body/Dashboard/PastApplications';
import Notifications from '../Body/Dashboard/Notifications';
import Logout from '../Body/Dashboard/Logout';
import { Box } from "@material-ui/core";
import {useStyles} from './HeaderStyles';


export default function HeaderComponent(props) {
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleDrawerClose = () => {
    setMobileOpen(false);
  }

  const [profileData, setProfileData] = useState(null);
  function getData() {
    axios({
      method: "GET",
      url: "/profile",
      headers: {
        Authorization: "Bearer " + props.token,
      },
    })
      .then((response) => {
        const res = response.data;
        res.access_token && props.setToken(res.access_token);
        setProfileData({
          profile_name: res.email,
          about_me: res.password,
        });
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
    <div>
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <SideNav
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleDrawerClose={handleDrawerClose}
      />
      <Box className={classes.wrapper}>
        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/create" element={<CreateApplication />}></Route>
          <Route path="/past" element={<PastApplications />}></Route>
          <Route path="/notifications" element={<Notifications />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route index element={<Home />}></Route>
        </Routes>
      </Box>
      <p>{profileData.email}</p>
    </div>
  );
}

