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
import EditUser from './EditUser';
import DropUser from './DropUser';

const { REACT_APP_BASE_BACKEND_URL } = process.env;

function Charts() {
  const classes = useStyles();
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openDropUser, setOpenDropUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
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
  const handleCloseEditUser = () => {
    setOpenEditUser(false);
  };
  const handleCloseDropUser = () => {
    setOpenDropUser(false);
  };




  
  return (
    <>
      <Box
        style={{ overflowX: "hidden", overflowY: "hidden", minHeight: "calc(100vh - 81px" }}
      >
        <Grid container spacing={4} style={{ margin: "2vh 3vh 0 3vh" }}>
          <Grid item xs={4}>
            <MediaCard
              image={require("./analytics.png")}
              alt="View API analytics"
              action="View API analytics"
              url={REACT_APP_BASE_BACKEND_URL + "/analytics"}
              setOpen={() => {}}
            />
          </Grid>
          <Grid item xs={4}>
            <MediaCard
              image={require("./edit_user.png")}
              alt="Edit User"
              action="Edit User"
              setOpen={setOpenEditUser}
            />
          </Grid>
          <Grid item xs={4}>
            <MediaCard
              image={require("./add_user.png")}
              alt="Add User"
              action="Add New User"
              setOpen={setOpenAddUser}
            />
          </Grid>
          <Grid item xs={4}>
            <MediaCard
              image={require("./add_users.png")}
              alt="Add Users in bulk"
              action="Add Users in Bulk"
              setOpen={setOpenAddUserCsv}
            />
          </Grid>
          <Grid item xs={4}>
            <MediaCard
              image={require("./view_users.png")}
              alt="Add Department"
              action="Add Department"
              setOpen={setOpenAddDept}
            />
          </Grid>
          <Grid item xs={4}>
            <MediaCard
              image={require("./drop_user.png")}
              alt="Drop User"
              action="Drop User"
              setOpen={setOpenDropUser}
            />
          </Grid>
          {/* <Grid item xs={4}>
            <MediaCard
              image={require("./add_user.png")}
              alt="Add Users in bulk"
              action="Add Users in Bulk"
              setOpen={setOpenAddUserCsv}
            />
          </Grid> */}
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
          classes={{ paper: classes.addDepartmentDialogPaper }}
          style={{ minWidth: "80vw" }}
        >
          <AddDepartment />
          <DialogActions>
            <Button onClick={handleCloseAddDept} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openEditUser}
          onClose={handleCloseEditUser}
          classes={{ paper: classes.editUserDialogPaper }}
        >
          <EditUser />
          <DialogActions>
            <Button onClick={handleCloseEditUser} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDropUser}
          onClose={handleCloseDropUser}
          classes={{ paper: classes.editUserDialogPaper }}
        >
          <DropUser />
          <DialogActions>
            <Button onClick={handleCloseDropUser} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        
      </Box>
    </>
  );
}

export default Charts