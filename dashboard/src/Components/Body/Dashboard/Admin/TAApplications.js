import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Paper } from "@material-ui/core";
import { Button } from "@mui/material";
import axios from "axios";
import DataGridToolbar from "../DataGridToolbar";
import { useStyles } from "../DataGridStyles";
import {
  Dialog,
  DialogActions,
} from "@material-ui/core";
import TADialogBox from "../TADialogBox";
const moment = require('moment');


function TAApplications({ permission }) {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("/api/ta/get-form-meta")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setTableData(data.data);
      });
  }, []);

  const handleCellClick = (param, event) => {
    event.stopPropagation();
  };

  const handleRowClick = (param, event) => {
    event.stopPropagation();
  };

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [id, setId] = useState(-1);

  const handleClickOpen = (event, cellValues) => {
    setOpen(true);
    setId(cellValues.row.request_id);
    setStatus(cellValues.row.stage);
  };

  const handleClose = () => {
    setOpen(false);
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

  function formatDate(date) {
    const d = moment(date).format("DD/MM/YYYY");
    return d;
  }

  const timeElement = (cellValues) => {
    const time = formatDate(cellValues.formattedValue);
    return (
      <div title={time} style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
        {time}
      </div>
    );
  }

  const columns = [
    { field: "request_id", headerName: "Application ID", minWidth: 50, flex: 1, renderCell: cellElement },
    { field: "ltc_id", headerName: "LTC ID", minWidth: 50, flex: 1, renderCell: cellElement },
    { field: "user", headerName: "User Email", minWidth: 150, flex: 1, renderCell: cellElement },
    { field: "name", headerName: "Name", minWidth: 150, flex: 1, renderCell: cellElement },
    {
      field: "created_on", headerName: "Created on", minWidth: 150, flex: 1, renderCell: timeElement, type: "date",
      valueGetter: (cellValues) => {
        return cellValues.value+"+530";
      }
    },
    { field: "stage", headerName: "Stage", flex: 1, minWidth: 150, renderCell: cellElement },
    {
      field: "form",
      headerName: "Form",
      flex: 1,
      minWidth: 150,
      disableExport: true,
      sortable: false,
      filterable: false,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClickOpen(event, cellValues);
            }}
          >
            View
          </Button>
        );
      },
    },
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
              sorting: { sortModel: [{ field: "request_id", sort: "desc" }] },
            }}
            columns={columns}
            rows={tableData}
            getRowId={(row) => row.request_id}
            onCellClick={handleCellClick}
            onRowClick={handleRowClick}
            components={{ Toolbar: DataGridToolbar }}
          />
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          classes={{ paper: classes.dialogPaper }}
        >
          <TADialogBox request_id={id} showCommentSection={true} permission={permission} />
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}

export default TAApplications