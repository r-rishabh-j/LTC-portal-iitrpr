import React from 'react'
import { useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Box,
  Dialog,
  DialogActions,
  Button
} from "@material-ui/core";

import MediaCard from '../../../Utilities/MediaCard';
import { useStyles } from "../DataGridStyles";
import AddUser from './AddUser';
import AddUserCsv from './AddUserCsv';
import AddDepartment from './AddDepartment';

const { REACT_APP_BASE_BACKEND_URL } = process.env;

function Charts() {
  const classes = useStyles();
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openAddUserCsv, setOpenAddUserCsv] = useState(false);
  const [openAddDept, setOpenAddDept] = useState(false);
  const handleCloseAddUser = () => {
    setOpenAddUser(false);
  };
  const handleCloseAddUserCsv = () => {
    setOpenAddUserCsv(false);
  };
  const handleCloseAddDept = () => {
    setOpenAddDept(false);
  };




  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
  return (
    <>
      <Box
        style={{ overflowX: "hidden", overflowY: "hidden", minHeight: "89vh" }}
      >
        <Grid
          container
          spacing={3}
          style={{ margin: "2vh 3vh 0 3vh", height: "50vh" }}
        >
          <Grid item xs maxWidth="30px">
            <MediaCard
              image={require("./view_users.png")}
              alt="View API analytics"
              action="View API analytics"
              url={REACT_APP_BASE_BACKEND_URL + "/analytics"}
              setOpen={() => { }}
            />
          </Grid>
          <Grid item xs>
            <MediaCard
              image={require("./edit_user.png")}
              alt="Edit User"
              action="Edit User"
              setOpen={() => { }}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          style={{ margin: "2vh 3vh 0 3vh", height: "50vh" }}
        >
          <Grid item xs>
            <MediaCard
              image={require("./add_user.png")}
              alt="Add User"
              action="Add New User"
              setOpen={setOpenAddUser}
            />
          </Grid>
          <Grid item xs>
            <MediaCard
              image={require("./add_user.png")}
              alt="Add Users in bulk"
              action="Add Users in Bulk"
              setOpen={setOpenAddUserCsv}
            />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          style={{ margin: "0vh 3vh 0 3vh", height: "50vh" }}
        >
          <Grid item xs>
            <MediaCard
              image={require("./add_user.png")}
              alt="Add Department"
              action="Add Department"
              setOpen={setOpenAddDept}
            />
          </Grid>
          <Grid item xs>
            <MediaCard
              image={require("./add_user.png")}
              alt="Add Users in bulk"
              action="Add Users in Bulk"
              setOpen={setOpenAddUserCsv}
            />
          </Grid>
        </Grid>
        <Dialog
          open={openAddUser}
          onClose={handleCloseAddUser}
          classes={{ paper: classes.addUserDialogPaper }}
          style={{ minWidth: "80vw" }}
        >
          <AddUser />
          <DialogActions>
            <Button onClick={handleCloseAddUser} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openAddUserCsv}
          onClose={handleCloseAddUserCsv}
          classes={{ paper: classes.addUserDialogPaper }}
          style={{ minWidth: "80vw" }}
        >
          <AddUserCsv />
          <DialogActions>
            <Button onClick={handleCloseAddUserCsv} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openAddDept}
          onClose={handleCloseAddDept}
          classes={{ paper: classes.addUserDialogPaper }}
          style={{ minWidth: "80vw" }}
        >
          <AddDepartment />
          <DialogActions>
            <Button onClick={handleCloseAddDept} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}

export default Charts