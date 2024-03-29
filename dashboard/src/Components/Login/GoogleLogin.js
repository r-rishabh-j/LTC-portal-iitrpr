import { Grid, Paper, Avatar, TextField, Button, Typography, Box } from '@material-ui/core'
import React, { useCallback } from 'react'
import { useStyles } from './LoginStyles';
import LockIcon from "@material-ui/icons/Lock";
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import axios from "axios";
import GoogleButton from 'react-google-button';
import image from './spiraliitropar.jpg'


const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_BASE_BACKEND_URL, REACT_APP_DEVELOPMENT } = process.env;

function GoogleLogin() {
  const classes = useStyles();
  const { handleSubmit, control } = useForm();
  const { handleSubmit: handleSubmitEmail, control: controlEmail, formState: { isSubmitting } } = useForm();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('auth', JSON.stringify(data))
    axios({
      method: "POST",
      url: "/api/login",
      data: formData
    }).then((response) => {
      window.location = response.request.responseURL;
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
    });
  }

  const onSubmitEmail = (data) => {
    const form = new FormData();
    form.append('email', data.email);
    console.log(data);
    return axios({
      method: "POST",
      url: "/api/otp-login",
      data: data
    })
      .then((response) => {
        alert(response.data.success);
        window.location.reload();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          alert(error.response.data.error);
        }
      });

  }
  const openGoogleLoginPage = useCallback(() => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectUri = 'api/login';

    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const params = {
      response_type: 'code',
      client_id: REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
      prompt: 'select_account',
      access_type: 'offline',
      scope
    };

    const urlParams = new URLSearchParams(params).toString();

    window.location = `${googleAuthUrl}?${urlParams}`;
  }, []);

  return (
    <Grid
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundImage: `url(${image})`,
        height: "100%",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Box elevation={10} className={classes.loginPage} display="flex">
        <Grid container>
          <Grid item xs={6}>
            <Box style={{ padding: "5vh" }}>
              <center>
                <h2>LTC PORTAL IIT ROPAR</h2>
                <Avatar className={classes.avatar}>
                  <LockIcon />
                </Avatar>
                <h3>Sign In</h3>

                {REACT_APP_DEVELOPMENT === "tru" ? (
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
                    <Controller
                      name="password"
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
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
                        Sign In (demo)
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Box minHeight={"8vh"}></Box>
                )}
                {/* <Typography>
                        {" "}
                        New User?
                        <Link to="/register"> Sign Up</Link>
                    </Typography>

                    {/* google login here */}
                {/* <h2 className={classes.btnHeader}>Login with Google</h2> */}
                <GoogleButton
                  onClick={openGoogleLoginPage}
                  label="Sign in with Google"
                  disabled={!REACT_APP_GOOGLE_CLIENT_ID}
                />
              </center>
            </Box>
          </Grid>

          <Grid item xs={6} style={{ backgroundColor: "rgba(38,50,56,0.8)" }}>
            <Box
              // display="flex"
              // justifyContent="center"
              style={{
                margin: "10vh 0 0 0",
                padding: "5vh",
              }}
            >
              <center>
                <Typography variant="h5" style={{ color: "white" }}>
                  Sign In through OTP
                </Typography>
                <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
                  <Controller
                    name="email"
                    control={controlEmail}
                    defaultValue=""
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <TextField
                        label="Email"
                        placeholder="Enter email"
                        variant="outlined"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        fullWidth
                        required
                        className={classes.textFieldLogin}
                        InputProps={{
                          style: { backgroundColor: "white" },
                        }}
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <span className="spinner-grow spinner-grow-sm"></span>
                      )}
                      Send OTP
                    </Button>
                  </div>
                </form>
              </center>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Grid>
  );
}

export default GoogleLogin