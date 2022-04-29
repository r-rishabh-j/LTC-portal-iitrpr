import { Box, Paper } from '@material-ui/core'
import React from 'react'
import { useRef } from 'react';
import { Typography } from '@material-ui/core';

export const ProfilePage = ({ profile }) => {
    const sizeRef = useRef();

    return (
        <>
            <Box ref={sizeRef}
                style={{ display: "flex", flexFlow: "column" }}>
                <Paper style={{
                    margin: "0 0.5vw 0 3vw",
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
                    <Box >
                        Signature
                    </Box>
                </Paper>
                <Box minHeight="2vh"></Box>
            </Box>
        </>
    )
}
