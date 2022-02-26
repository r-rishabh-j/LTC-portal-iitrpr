import React from 'react'
import axios from 'axios';
import { useStyles } from '../../Header/HeaderStyles';

import {
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

export default function Logout(props) {
  const classes = useStyles();
  const logout = () => {
    console.log("Logout");
    window.location.reload();
  }
  function logOut() {

    // axios({
    //   method: "POST",
    //   url: "/api/logout",
    //   data: {
    //     Authorization: "Bearer " + props.token,
    //   },
    // })
    axios({
      method: "POST",
      url: "/api/test",
      headers: {
        Authorization: "Bearer " + props.token,
      },
    })
      .then((response) => {
        // const res = response.data;
        // console.log(res);
        // res.access_token && props.setToken(res.access_token);
        props.removeToken();
        logout();
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
    <>
      <Button
        onClick={logOut}
        sx={{
          backgroundColor: "transparent",
          width: "100%",
          textTransform: "capitalize",
          justifyContent: "flex-start",
        }}
      >
        <List>
          <ListItem
            className={classes.navlinks}
            sx={{ width: "100%", textTransform: "capitalize" }}
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </ListItem>
        </List>
      </Button>
    </>
  );
}
