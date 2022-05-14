import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Paper, Typography } from "@material-ui/core";
import DataGridToolbar from "../DataGridToolbar";
import { useStyles } from "../DataGridStyles";
const moment = require('moment');


function Users() {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetch("/api/admin/getusers")
            .then((data) => data.json())
            .then((data) => {
                console.log(data);
                setTableData(data.users);
            });
    }, []);

    const handleCellClick = (param, event) => {
        event.stopPropagation();
    };

    const handleRowClick = (param, event) => {
        event.stopPropagation();
    };

    const cellElement = (cellValues) => {
        return (
            <div
                title={cellValues.formattedValue}
                style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                }}
            >
                {cellValues.formattedValue}
            </div>
        );
    };


    const columns = [
        /*
        id, email, created on, is active, stage, view form, download(button)*/
        { field: "user_id", headerName: "User ID", minWidth: 70, flex: 1, renderCell: cellElement },
        { field: "name", headerName: "Name", minWidth: 150, flex: 1, renderCell: cellElement },
        { field: "email", headerName: "User Email", minWidth: 200, flex: 1, renderCell: cellElement },
        { field: "department", headerName: "Department", flex: 1, minWidth: 180, renderCell: cellElement },
        { field: "designation", headerName: "Designation", flex: 1, minWidth: 150, renderCell: cellElement },
        { field: "employee_code", headerName: "Emp. Code", flex: 1, minWidth: 70, renderCell: cellElement },

    ];

    return (
        <>
            {/* <Paper
                elevation={10}
                style={{ display: "flex", backgroundColor: '#263238', margin: "0 0 0 2vw" }}
            >
                <Typography variant="body1" style={{ margin: "auto", fontSize: "25px", color: "white" }}>
                    Users
                </Typography>
            </Paper> */}
            <Paper
                elevation={10}
                style={{ display: "flex", height: "calc(100vh - 177px)", margin: "0 0 0 2vw" }}
            >
                <Grid container style={{ flexGrow: 1 }}>
                    <DataGrid
                        initialState={{
                            sorting: { sortModel: [{ field: "user_id", sort: "asc" }] },
                        }}
                        columns={columns}
                        rows={tableData}
                        getRowId={(row) => row.user_id}
                        onCellClick={handleCellClick}
                        onRowClick={handleRowClick}
                        components={{ Toolbar: DataGridToolbar }}
                    />
                </Grid>
            </Paper>
        </>
    );
}

export default Users