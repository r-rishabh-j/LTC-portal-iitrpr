import { Grid, Paper, Avatar, TextField, Button, Typography} from '@material-ui/core'
import React from 'react'
import { useStyles } from './LoginStyles';
import LockIcon from "@material-ui/icons/Lock";
import {Link} from 'react-router-dom';
import {useForm, Controller} from 'react-hook-form';
import axios from "axios"

function Login(props) {
  const classes = useStyles();
  const {handleSubmit, control} = useForm();

  const onSubmit = (data) => {
    axios({
      method: "POST",
      url:"/api/login",
      data:{
        email: data.email,
        password: data.password
       }
    })
    .then((response) => {
      props.setToken(response.data.access_token)
    }).catch((error) => {
      if (error.response) {
        console.log(error.response)
        console.log(error.response.status)
        console.log(error.response.headers)
        }
    })
    console.log(data);
  }

  return (
    <Grid>
      <Paper elevation={10} className={classes.loginPage}>
        <Grid align="center">
          <h2>LTC PORTAL IIT ROPAR</h2>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <h3>Sign In</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextField
                  label="Username"
                  placeholder="Enter username"
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  fullWidth
                  required
                  className={classes.textFieldLogin}
                />
              )}
            />
            <Controller name="password" control={control} defaultValue="" render={({ field: {onChange, value}, fieldState: {error}}) => (
              <TextField
              label="Password"
              value={value}
              onChange={onChange}
              error={!!error}
              placeholder="Enter password"
              type="password"
              fullWidth
              required
              className={classes.textFieldPass}
            />
            )}
            />
            
            <div>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className={classes.btn}
              >
                Sign In
              </Button>
            </div>
          </form>
          <Typography>
            {" "}
            New User?
            <Link to="/register"> Sign Up</Link>
          </Typography>
        </Grid>
      </Paper>
    </Grid>
  );
}

export default Login