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

const { REACT_APP_BASE_BACKEND_URL } = process.env;

function Charts() {
  const classes = useStyles();
  const [openAddUser, setOpenAddUser] = useState(false);
  const handleCloseAddUser = () => {
    setOpenAddUser(false);
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
        {/* <Grid container>
          

          <Paper
            elevation={10}
            style={{
              margin: "1vw 0.5vw 0 3vw",
              height: "50vh",
              width: "100%",
              overflowX: "hidden",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pv"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid> */}

        <Grid
          container
          spacing={8}
          style={{ margin: "2vh 0 0 10vw", height: "50vh" }}
        >
          <Grid item xs={3}>
            <MediaCard
              image={require("./view_users.png")}
              alt="View API analytics"
              action="View API analytics"
              url={REACT_APP_BASE_BACKEND_URL + "/analytics"}
              setOpen={()=>{}}
            />
          </Grid>
          <Grid item xs={3}>
            <MediaCard
              image={require("./edit_user.png")}
              alt="Edit User"
              action="Edit User"
              setOpen={()=>{}}
            />
          </Grid>
          <Grid item xs={3}>
            <MediaCard
              image={require("./add_user.png")}
              alt="Add User"
              action="Add New User"
              setOpen={setOpenAddUser}
            />
          </Grid>
          <Dialog
            open={openAddUser}
            onClose={handleCloseAddUser}
            classes={{ paper: classes.addUserDialogPaper }}
            style={{minWidth:"80vw"}}
          >
            <AddUser/>
            <DialogActions>
              <Button onClick={handleCloseAddUser} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Box>
    </>
  );
}

export default Charts