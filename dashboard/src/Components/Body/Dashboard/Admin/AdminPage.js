import React from 'react'
import { useState } from 'react'
import {Routes, Route, Navigate} from  'react-router-dom'
import { Box, Grid, Paper } from '@material-ui/core';
import Navbar from '../../../Header/Navbar';
import SideNav from '../../../Header/SideNav';
import { useStyles } from "../../../Header/HeaderStyles"
import Home from "../Home"
import Charts from './Charts';
import { ProfilePage } from '../Profile/ProfilePage';
import Database from './Database'

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
        <Routes>
          <Route path="/users" element={<Charts />}></Route>
          <Route path="/previous" element={<Database />}></Route>
          <Route path="/logout" element={<Navigate to="/#/" />}></Route>
          <Route path="/profile" element={<ProfilePage profile = {props.profileInfo}/>}></Route>
          <Route path="*" element={<Home />}></Route>
        </Routes>
        
      </Box>
    </div>
  );
}
