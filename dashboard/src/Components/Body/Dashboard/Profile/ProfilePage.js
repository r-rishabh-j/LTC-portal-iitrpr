import { Box, Button, Dialog, Paper, requirePropFactory, DialogActions } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Typography } from '@material-ui/core';
import axios from 'axios';
import { Divider } from '@mui/material';
import { Switch } from '@material-ui/core';
import SignatureUploadDialog from './SignatureUploadDialog';
import { useStyles } from '../DataGridStyles';

export const ProfilePage = ({ profile }) => {
    const classes = useStyles();
    const [signature, setSignature] = useState('default');
    const [dialogOpen, setDialogOpen] = useState(false);

    function handleDialogClose() {
        setDialogOpen(false);
    }

    function handleDialogOpen() {
        setDialogOpen(true);
    }


    const [switchState, setSwitchState] = useState(false);

    const handleChange = (event) => {
        setSwitchState(event.target.checked);
        axios({
            method: "POST",
            url: "/api/set-email-pref",
            data: {
                pref: event.target.checked
            }
        })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });

    };

    useEffect(() => {
        axios({
            method: "POST",
            url: "/api/get-signature",
        })
            .then((response) => {
                setSignature(response.data.signature);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    }, []);

    useEffect(() => {
        return axios({
            method: "GET",
            url: "/api/get-email-pref",
        })
            .then((response) => {
                setSwitchState(response.data.pref);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
            });
    }, []);

    return (
        <>
            <Box style={{ display: "flex", flexFlow: "column" }}>
                <Paper
                    elevation={5}
                    style={{
                        display: "flex", backgroundColor: '#263238', flex: "1 1 auto",
                        width: "auto", margin: "0 17.5vw 0 20vw",
                    }}
                    width="auto"
                >
                    <Typography variant="body1" style={{ margin: "auto", fontSize: "25px", color: "white" }}>
                        Profile
                    </Typography>
                </Paper>
                <Paper style={{
                    margin: "0 17.5vw 0 20vw",
                    minHeight: "calc(98vh - 118px)",
                    flex: "1 1 auto",
                    width: "auto",
                    overflowX: "scroll"
                }} >
                    <center>
                        <Box>
                            <Box margin={"3vh 0 0 0vh"}>
                                <Typography variant='h6' style={{ fontWeight: "bold" }}>
                                    Signature
                                </Typography>
                            </Box>
                            <Box margin={"0 0 0 0vh"}>
                                {signature!=='default'?
                                signature !== null && signature !== undefined ?
                                    <img src={`data:image/jpeg;base64,${(signature.slice(2, -1))}`} height="150vh" 
                                    style={{ borderWidth: "1px", borderColor: "black", borderStyle: "solid", marginTop: "2vh" }} /> : 
                                    <div><h5><br></br>No signature!</h5></div>:<div><h5><br></br>Loading.....</h5></div>}
                            </Box>
                            <Button style={{ margin: "2vh 0 0 0vw" }} color="primary" variant="contained" onClick={handleDialogOpen}>
                                Upload Signature
                            </Button>
                        </Box>
                        <Divider style={{ marginTop: "3vh" }} variant="middle" />
                        <Box margin={"3vh 0 0 0vh"}>
                            <Typography variant='h6' style={{ fontWeight: "bold" }}>
                                Email Preferences
                            </Typography>
                            <div style={{ margin: "3vh 0 3vh 0" }}>
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
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                classes={{ paper: classes.signatureUploadDialogPaper }}
            >
                <SignatureUploadDialog profile={profile} />
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
