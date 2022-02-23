import React from 'react'
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useStyles } from '../../Login/LoginStyles';

export default function CreateApplication() {
  const classes = useStyles();
  const { handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  }
  return (
    <>
    <div>CreateApplication</div>
     <Grid>
      <Paper elevation={10} className={classes.loginPage}>
        <Grid align="center">
         
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
                Submit
              </Button>
            </div>
          </form>
          
        </Grid>
      </Paper>
    </Grid>
    </>
  )
}
