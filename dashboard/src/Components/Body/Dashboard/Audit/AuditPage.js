import React from 'react'
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Grid, Paper } from "@material-ui/core";
import Navbar from "../../../Header/Navbar";
import SideNav from "../../../Header/SideNav";
import { useStyles } from "../../../Header/HeaderStyles";
import Home from "../Home";
import Pending from '../Establishment/Pending';
import Past from "../Establishment/Past";
import { ProfilePage } from '../Profile/ProfilePage';
import PastTaApplications from '../Establishment/PastTaApplications';
import PendingTAApplications from '../Establishment/PendingTAApplications';


function AuditPage(props) {
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
      <Navbar
        handleDrawerToggle={handleDrawerToggle}
        profileInfo={props.profileInfo}
      />
      <SideNav
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        handleDrawerClose={handleDrawerClose}
        profileInfo={props.profileInfo}

        userType="audit"
      />
      <Box className={classes.wrapper}>
        <Routes>
          <Route path="/new" element={<Pending />}></Route>
          <Route path="/past" element={<Past />}></Route>
          {/*<Route path="/payment" element={<Payment />}></Route> */}
          <Route path="/profile" element={<ProfilePage profile = {props.profileInfo}/>}></Route>
          <Route path="/logout" element={<Navigate to="/" />}></Route>
          <Route path="/past-ta" element={<PastTaApplications permission={props.profileInfo.permission} />}></Route>
          <Route path="/new-ta" element={<PendingTAApplications permission={props.profileInfo.permission} />}></Route>
          <Route path="*" element={<Home />}></Route>
        </Routes>
      </Box>
    </div>
  );
}

export default AuditPage