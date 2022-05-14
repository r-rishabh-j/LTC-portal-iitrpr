import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Paper, Typography } from "@material-ui/core";
import DataGridToolbar from "../DataGridToolbar";


function Deparments() {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetch("/api/admin/getdepartments")
            .then((data) => data.json())
            .then((data) => {
                console.log(data);
                setTableData(data.departments);
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
        { field: "dept_id", headerName: "Dept. ID", minWidth: 50, flex: 1, renderCell: cellElement },
        { field: "department_name", headerName: "Dept. Name", minWidth: 150, flex: 1, renderCell: cellElement },
        { field: "head_email", headerName: "Head Email", minWidth: 150, flex: 1, renderCell: cellElement },
        { field: "is_stage", headerName: "Is Stage", flex: 1, minWidth: 180, renderCell: cellElement },
    ];

    return (
        <>
            <Paper
                elevation={10}
                style={{ display: "flex", height: "calc(100vh - 177px)", margin: "0 0 0 2vw" }}
            >
                <Grid container style={{ flexGrow: 1 }}>
                    <DataGrid
                        initialState={{
                            sorting: { sortModel: [{ field: "dept_id", sort: "asc" }] },
                        }}
                        columns={columns}
                        rows={tableData}
                        getRowId={(row) => row.dept_id}
                        onCellClick={handleCellClick}
                        onRowClick={handleRowClick}
                        components={{ Toolbar: DataGridToolbar }}
                    />
                </Grid>
            </Paper>
        </>
    );
}

export default Deparments