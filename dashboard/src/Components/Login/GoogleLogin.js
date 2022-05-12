import { Grid, Paper, Avatar, TextField, Button, Typography } from '@material-ui/core'
import React, { useCallback } from 'react'
import { useStyles } from './LoginStyles';
import LockIcon from "@material-ui/icons/Lock";
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import axios from "axios";
import GoogleButton from 'react-google-button';


const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_BASE_BACKEND_URL, REACT_APP_DEVELOPMENT } = process.env;

function GoogleLogin() {
    const classes = useStyles();
    const { handleSubmit, control } = useForm();

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
        <Grid style={{ backgroundColor: "#cfd8dc", height: "100vh", display: "flex" }}>
            <Paper elevation={10} className={classes.loginPage}>
                <Grid align="center">
                    <h2>LTC PORTAL IIT ROPAR</h2>
                    <Avatar className={classes.avatar}>
                        <LockIcon />
                    </Avatar>
                    <h3>Sign In</h3>

                    {REACT_APP_DEVELOPMENT === "true" ?
                        (<form onSubmit={handleSubmit(onSubmit)}>
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
                            <Controller name="password" control={control} defaultValue="" render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                        </form>) : (<></>)}
                    <GoogleButton
                        onClick={openGoogleLoginPage}
                        label="Sign in with Google"
                        disabled={!REACT_APP_GOOGLE_CLIENT_ID}
                    />
                </Grid>
            </Paper>
        </Grid>
    );
}

export default GoogleLogin