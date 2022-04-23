import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Button,
  Dialog,
  DialogActions,
  Typography,
} from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
// import { useStyles } from "./UploadDialogBoxStyles";
import { useStyles } from "../DataGridStyles";
import UploadDialogBox from "./UploadDialogBox";
import DialogBox from "../DialogBox";

const UploadOfficeOrder = ({ permission }) => {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    fetch("/api/get-pending-office-order-req")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setTableData(data.pending);
      });
  }, []);

  const handleUpload = (event, cellValues) => {
    console.log(cellValues.row.request_id);
    const data = { request_id: cellValues.row.request_id };
    setOpen(true);

  };

  const handleCellClick = (param, event) => {
    event.stopPropagation();
  };

  const handleRowClick = (param, event) => {
    event.stopPropagation();
  };

  const [open, setOpen] = useState(false);
  const [formOpen, setformOpen] = useState(false);
  const [id, setId] = useState(-1);

  const handleClickOpen = (event, cellValues) => {
    setOpen(true);
    setId(cellValues.row.request_id);
  };
  const handleFormOpen = (event, cellValues) => {
    setformOpen(true);
    setId(cellValues.row.request_id);
  };

  const handleformClose = () => {
    setformOpen(false);
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

  const timeElement = (cellValues) => {
    return (
      <div
        title={cellValues.formattedValue.replace("GMT", "IST")}
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {cellValues.formattedValue.replace("GMT", "IST")}
      </div>
    );
  };

  const columns = [
    {
      field: "request_id",
      headerName: "Application ID",
      minWidth: 100,
      flex: 1,
      renderCell: cellElement,
    },
    {
      field: "user",
      headerName: "User Email",
      minWidth: 150,
      flex: 1,
      renderCell: cellElement,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
      renderCell: cellElement,
    },
    {
      field: "approved_on",
      headerName: "Created on",
      minWidth: 150,
      flex: 1,
      renderCell: timeElement,
    },
    {
      field: "form",
      headerName: "Form",
      minWidth: 150,
      renderCell: (cellValues) => {
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => {
                handleFormOpen(event, cellValues);
              }}
            >
              View
            </Button>
          </>
        );
      },
    },
    {
      field: "upload",
      headerName: "Upload Order",
      minWidth: 150,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleClickOpen(event, cellValues);
            }}
          >
            Upload
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Typography variant="body" style={{ margin: "auto", fontSize:"3vh" }}>
          Office Orders
        </Typography>
      </div>
      <Paper
        elevation={10}
        style={{ display: "flex", height: "87vh", margin: "0 0.5vw 0 3vw" }}
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
          />
        </Grid>
        <Dialog
          open={formOpen}
          onClose={handleformClose}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogBox request_id={id} />
          <DialogActions>
            <Button onClick={handleformClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={open}
          onClose={handleClose}
          classes={{ paper: classes.uploadDialogPaper }}
        >
          <UploadDialogBox request_id={id} />
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

export default UploadOfficeOrder