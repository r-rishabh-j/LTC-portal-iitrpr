import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Button,
  Dialog,
  DialogActions,
  Typography,
  Box
} from "@material-ui/core";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useStyles } from "../DataGridStyles";
import axios from "axios";
import DialogBox from '../DialogBox'
import AdvancePaymentDialogBox from "./AdvancePaymentDialogBox";
import DataGridToolbar from "../DataGridToolbar";
const moment = require('moment');

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

  function formatDate(date){
    const d = moment(date).format("DD/MM/YYYY");
    return d;
  }

  const timeElement = (cellValues) => {
    const time = formatDate(cellValues.formattedValue.replace('GMT', ''));
    return (
      <div title={time} style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
        {time}
      </div>
    );
  }

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
      type:"date",
      valueGetter: (cellValues) => {
        const time = formatDate(cellValues.value.replace('GMT', ''));
        return Date(moment(time).local().format("DD/MM/YYYY"));
      }
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
      <Paper
        elevation={10}
        style={{ display: "flex", margin: "0 0.5vw 0 3vw", backgroundColor:'#263238' }}
      >
          <Typography variant="body1" style={{ margin: "auto", fontSize: "25px", color:"white" }}>
            Advance Payments
          </Typography>
      </Paper>
      <Paper
        elevation={10}
        style={{ display: "flex", height: "calc(98vh - 118px)", margin: "0 0.5vw 0 3vw" }}
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
      <Box minHeight="2vh"></Box>
    </>
  );
}

export default AdvancePayments