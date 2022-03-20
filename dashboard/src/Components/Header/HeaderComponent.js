import React from 'react'
import { useState } from 'react';
import Navbar from './Navbar'
import SideNav from './SideNav'
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import Home from '../Body/Dashboard/Home';
import CreateApplication from '../Body/Dashboard/CreateApplication';
import PastApplications from '../Body/Dashboard/PastApplications';
import Notifications from '../Body/Dashboard/Notifications';
import { Box } from "@material-ui/core";
import { useStyles } from './HeaderStyles';
import axios from "axios";

export default function HeaderComponent(props) {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleDrawerClose = (i) => {
    setMobileOpen(false);

  }
  // const printProfile = () =>{
  //   console.log("in Header")
  //   //console.log(props.profileInfo)
  // }


  return (
    <div>
      <Navbar handleDrawerToggle={handleDrawerToggle} profileInfo={props.profileInfo} />
      <SideNav
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleDrawerClose={handleDrawerClose}
      />
      <Box className={classes.wrapper}>
        {/* <button onClick={getData}>Profile</button> */}


        <Routes>
          <Route path="/home" element={<Home profileInfo={props.profileInfo} />}></Route>
          <Route
            path="/create"
            element={<CreateApplication />}
          ></Route>
          <Route path="/past" element={<PastApplications />}></Route>
          <Route
            path="/notifications"
            element={<Notifications />}
          ></Route>
          <Route path="/logout" element={<Navigate to="/" />}></Route>
          <Route path="*" element={<Home />}></Route>
        </Routes>
      </Box>
    </div>
  );
}

