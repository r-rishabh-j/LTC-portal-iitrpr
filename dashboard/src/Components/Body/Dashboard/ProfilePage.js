import { Box, Button, Paper, requirePropFactory } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useRef } from 'react';
import { Typography } from '@material-ui/core';
import axios from 'axios';
import { Divider } from '@mui/material';
import {Switch} from '@material-ui/core';

export const ProfilePage = ({ profile }) => {
    const [signature, setSignature] = useState(null);

    const [switchState, setSwitchState] = React.useState(false);

    const handleChange = (event) => {
        setSwitchState(event.target.checked);
    };

    useEffect(() => {
        axios({
            method: "POST",
            url: "/api/get-signature",
            responseType: "blob"
        })
            .then((response) => {
                console.log(response)
                const src = URL.createObjectURL(response.data)
                setSignature(src);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    }, [])

    return (
        <>
            <Box style={{ display: "flex", flexFlow: "column" }}>
                <Paper style={{
                    margin: "0 17.5vw 0 20vw",
                    minHeight: "calc(98vh - 81px)",
                    flex: "1 1 auto",
                    width: "auto"
                }} >
                    <Paper
                        elevation={5}
                        style={{ display: "flex", backgroundColor: '#263238' }}
                    >
                        <Typography variant="body1" style={{ margin: "auto", fontSize: "25px", color: "white" }}>
                            Profile
                        </Typography>
                    </Paper>
                    <center>
                        <Box>
                            <Box margin={"3vh 0 0 0vh"}>
                                <Typography variant='h6' style={{ fontWeight: "bold" }}>
                                    Signature
                                </Typography>
                            </Box>
                            <Box margin={"0 0 0 0vh"}>
                                <img src={signature} width="300px" height="300px" alt='No Signature' style={{ borderWidth: "1px", borderColor: "black", borderStyle: "solid", marginTop: "2vh" }}></img>
                            </Box>
                            <Button style={{ margin: "2vh 0 0 0vw" }} color="primary" variant="contained">
                                Upload Signature
                            </Button>
                        </Box>
                        <Divider style={{ marginTop: "3vh" }} variant="middle" />
                        <Box margin={"3vh 0 0 0vh"}>
                            <Typography variant='h6' style={{ fontWeight: "bold" }}>
                                Email Preferences
                            </Typography>
                            <div style={{margin:"3vh 0 3vh 0"}}>
                                Do you want to receive email notifications?
                            </div>
                            Off
                            <Switch
                                checked={switchState}
                                onChange={handleChange}
                                color="primary"
                                name="checkedB"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                            On
                        </Box>
                    </center>

                </Paper>
                <Box minHeight="2vh"></Box>
            </Box>
        </>
    )
}
