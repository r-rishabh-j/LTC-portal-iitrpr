import React, { useState, useEffect } from 'react'
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { Grid, Paper, Typography } from '@material-ui/core'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@material-ui/core";
import { useStyles } from "./DataGridStyles";
import { Button } from '@mui/material';
import axios from 'axios';
import GeneratePDF from '../../Utilities/GeneratePDF'
import DialogBox from './DialogBox';
import ReviewBox from './ReviewBox'
import {Box} from '@material-ui/core';
import DataGridToolbar from './DataGridToolbar';
const moment = require('moment');

/**
 * 
 * @description: View user past LTC Applications 
 * @returns 
 */


const PastApplications = ({ permission }) => {
  const classes = useStyles();

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetch("/api/getmyforms")
      .then((data) => data.json())
      .then((data) => {
        setTableData(data.data)
      })
  }, [])

  const handleCellClick = (param, event) => {
    event.stopPropagation();
  };

  const handleRowClick = (param, event) => {
    event.stopPropagation();
  };

  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [id, setId] = useState(-1);
  const [status, setStatus] = useState('');

  const handleClickOpen = (event, cellValues) => {
    setOpen(true);
    // console.log('status', cellValues.row.stage);
    setStatus(cellValues.row.stage);
    setId(cellValues.row.request_id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  }

  const editForm = (event, cellValues) => {
    setOpenReview(true);
    setId(cellValues.row.request_id);
    // console.log("Open a new dialog box");
  }

  const stageElement = (cellValues) => {
    return (
      (cellValues.row.stage !== 'review') ?
        <div
          title={cellValues.formattedValue}
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {cellValues.formattedValue}
        </div> : <Button style={{ backgroundColor: "orange" }} variant="contained" onClick={(event) => { editForm(event, cellValues) }}>
          Review</Button>
    );
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
    const d = String(moment(date).local().format("DD/MM/YYYY"));
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
    /*
  id, email, created on, is active, stage, view form, download(button)*/
    {
      field: "request_id",
      headerName: "Application ID",
      minWidth: 150,
      flex: 1,
      renderCell: cellElement,
    },
    {
      field: "created_on",
      headerName: "Created on",
      minWidth: 250,
      flex: 1,
      type:"date",
      renderCell: timeElement,
      valueGetter: (cellValues) => {
        return cellValues.value+"+530";
        // const time = formatDate(cellValues.value.replace('GMT', 'GMT'));
        // return moment(time).local().format("DD/MM/YYYY");
      }
    },
    {
      field: "stage",
      headerName: "Stage",
      minWidth: 200,
      flex: 1,
      renderCell: stageElement,
    },
    {
      field: "is_active",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      renderCell: cellElement,
    },

    {
      field: "form",
      headerName: "Form",
      minWidth: 150,
      disableExport: true,
      filterable: false,
      sortable: false,
      sortable: false,
      renderCell: (cellValues) => {
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => {
                handleClickOpen(event, cellValues);
              }}
            >
              View
            </Button>
          </>
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
          <Typography variant="body" style={{ margin: "auto", fontSize: "25px", color:"white" }}>
            Past LTC Applications
          </Typography>
      </Paper>
      <Paper
        elevation={10}
        style={{ display: "flex", minHeight: "calc(98vh - 118px)", margin: "0 0.5vw 0 3vw" }}
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
          <DialogBox request_id={id} permission={permission} status={status} showCommentSection={false}/>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openReview}
          onClose={handleCloseReview}
          classes={{ paper: classes.dialogPaper }}
        >
          <ReviewBox request_id={id} />
          <DialogActions>
            <Button onClick={handleCloseReview} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
        <Box minHeight="2vh"></Box>
    </>
  );
}

export default PastApplications
