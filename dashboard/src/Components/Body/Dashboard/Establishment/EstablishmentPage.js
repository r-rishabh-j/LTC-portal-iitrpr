import React from 'react'
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, Grid, Paper } from "@material-ui/core";
import Navbar from "../../../Header/Navbar";
import SideNav from "../../../Header/SideNav";
import { useStyles } from "../../../Header/HeaderStyles";
import Home from "../Home";
import Pending from "./Pending"
import Past from './Past';
import Review from './Review';
import UploadOfficeOrder from './UploadOfficeOrder';
import { ProfilePage } from '../Profile/ProfilePage';

export default function EstablishmentPage(props){
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
        userType="establishment"
      />
      <Box className={classes.wrapper}>
        <Routes>
          <Route
            path="/new"
            element={<Pending permission={props.profileInfo.permission} />}
          ></Route>
          <Route path="/past" element={<Past />}></Route>
          <Route
            path="/review"
            element={<Review permission={props.profileInfo.permission} />}
          ></Route>
          <Route path="/office_orders" element={<UploadOfficeOrder />}></Route>
          <Route
            path="/profile"
            element={<ProfilePage profile={props.profileInfo} />}
          ></Route>
          <Route path="/logout" element={<Navigate to="/" />}></Route>
          <Route path="*" element={<Home />}></Route>
        </Routes>
      </Box>
    </div>
  );
}

