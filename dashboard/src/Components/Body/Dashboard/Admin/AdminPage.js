import React from 'react'
import { useState } from 'react'
import {Routes, Route, Navigate} from  'react-router-dom'
import { Box, Grid, Paper } from '@material-ui/core';
import Navbar from '../../../Header/Navbar';
import SideNav from '../../../Header/SideNav';
import { useStyles } from "../../../Header/HeaderStyles"
import Home from "../Home"
import Charts from './Charts';
import PreviousApplications from './PreviousApplications';

export default function AdminPage(props) {

    const classes = useStyles();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
    };

    const handleDrawerClose = (i) => {
      setMobileOpen(false);
     
    };


  return (
    <div>
      <Navbar handleDrawerToggle={handleDrawerToggle} profileInfo={props.profileInfo}/>
      <SideNav
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleDrawerClose={handleDrawerClose}
        profileInfo={props.profileInfo}
        userType="admin"
      />
      <Box className={classes.wrapper}>
        {/* <button onClick={getData}>Profile</button> */}

        <Routes>
          <Route path="/users" element={<Charts />}></Route>
          {/* <Route
            path="/create"
            element={<CreateApplication token={token} setToken={setToken} />}
          ></Route> */}
          <Route path="/previous" element={<PreviousApplications />}></Route>
          {/* <Route
            path="/notifica"
            element={<Notifications token={token} setToken={setToken} />}
          ></Route> */}
          <Route path="/logout" element={<Navigate to="/#/" />}></Route>
          <Route path="*" element={<Home />}></Route>
        </Routes>
        
      </Box>
    </div>
  );
}
