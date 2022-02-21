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


export default function HeaderComponent() {
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleDrawerClose = () => {
    setMobileOpen(false);
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
          <Route path="/" element={<Home />}></Route>
          <Route path="/create" element={<CreateApplication />}></Route>
          <Route path="/past" element={<PastApplications />}></Route>
          <Route path="/notifications" element={<Notifications />}></Route>
          <Route path="/logout" element={<Logout />}></Route>
          <Route index element={<Home />}></Route>
        </Routes>
      </Box>
    </div>
  );
}

