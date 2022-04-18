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
import { useStyles } from "../DataGridStyles";
import axios from "axios";
import DialogBox from '../DialogBox'
import AdvancePaymentDialogBox from "./AdvancePaymentDialogBox";


function AdvancePayments() {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("/api/get-pending-advance-payments")
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

  const handlePaymentUpdateOpen = (event, cellValues) => {
    setOpen(true);
    setId(cellValues.row.request_id);
  };

  const viewForm = (event, cellValues) => {
    setformOpen(true);
    setId(cellValues.row.request_id);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleformClose = () => {
    setformOpen(false);
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
      field: "created_on",
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
                viewForm(event, cellValues);
              }}
            >
              View
            </Button>
          </>
        );
      },
    },
    {
      field: "payment_details",
      headerName: "Payment Details",
      minWidth: 150,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handlePaymentUpdateOpen(event, cellValues);
            }}
          >
            Fill
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Typography variant="h5" style={{ margin: "auto" }}>
          Past Applications
        </Typography>
      </div>
      <Paper
        elevation={10}
        style={{ display: "flex", height: "100vh", margin: "0 0.5vw 0 3vw" }}
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
        {/* form dialog */}
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
        {/* advance payment upload */}
        <Dialog
          open={open}
          onClose={handleClose}
          classes={{ paper: classes.advPaymentDialogPaper }}
        >
          <AdvancePaymentDialogBox request_id={id} />
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

export default AdvancePayments