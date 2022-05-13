import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Paper, Typography } from "@material-ui/core";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@material-ui/core";
import { useStyles } from "./DataGridStyles";
import { Button } from "@mui/material";
import axios from "axios";
import GeneratePDF from "../../Utilities/GeneratePDF";
import DialogBox from "./DialogBox";
import ReviewBox from "./ReviewBox";
import { Box } from "@material-ui/core";
import TAForm from "./TAForm";
const moment = require("moment");

const LTCforTA = ({ profileInfo }) => {
  //console.log(permission)
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("/api/ta/get-approved-ltc")
      .then((data) => data.json())
      .then((data) => {
        console.log(data.data);
        setTableData(data.data);
      });
  }, []);

  //rows = {tableData}
  const handleAttachmentClick = (event, cellValues) => {
    console.log(cellValues.row.request_id);
    const data = { request_id: cellValues.row.request_id };
    axios({
      method: "post",
      url: "api/ta/getattachments",
      data: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
      responseType: "blob",
    })
      .then((response) => {
        var blob = new Blob([response.data], { type: response.data.type });
        var url = window.URL.createObjectURL(blob, { oneTimeOnly: true });
        var anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank";
        anchor.click();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          alert("No attachments");
        }
      });
  };

  const handleFormClick = (event, cellValues) => {
    console.log(cellValues.row.request_id);
    const data = { request_id: cellValues.row.request_id };
    axios({
      method: "post",
      url: "api/getformdata",
      data: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        console.log(response.data.data.form_data);
        GeneratePDF(response.data.data.form_data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          alert("Form not found");
        }
      });
  };

  const handleCellClick = (param, event) => {
    event.stopPropagation();
  };

  const handleRowClick = (param, event) => {
    event.stopPropagation();
  };

  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [id, setId] = useState(-1);
  const [status, setStatus] = useState("");

  const handleClickOpen = (event, cellValues) => {
    setOpen(true);
    console.log("status", cellValues.row.stage);
    setStatus(cellValues.row.stage);
    setId(cellValues.row.request_id);
  };

 

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  };

  const editForm = (event, cellValues) => {
    setOpenReview(true);
    setId(cellValues.row.request_id);
    console.log("Open a new dialog box");
  };

  const stageElement = (cellValues) => {
    return cellValues.row.stage !== "review" ? (
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
    ) : (
      <Button
        style={{ backgroundColor: "orange" }}
        variant="contained"
        onClick={(event) => {
          editForm(event, cellValues);
        }}
      >
        Review
      </Button>
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

  function formatDate(date) {
    const d = String(moment(date).local().format("DD-MM-YYYY"));
    return d;
  }

  const timeElement = (cellValues) => {
    // console.log('cc',cellValues);
    const time = formatDate(cellValues.formattedValue.replace("GMT", ""));
    return (
      <div
        title={time}
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {time}
      </div>
    );
  };

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
      field: "approved_on",
      headerName: "Approved on",
      minWidth: 250,
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
                handleClickOpen(event, cellValues);
              }}
            >
              View
            </Button>
          </>
        );
      },
    },
    {
      field: "fill_ta",
      headerName: "TA Form",
      minWidth: 150,
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
              Fill
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
        style={{
          display: "flex",
          margin: "0 0.5vw 0 3vw",
          backgroundColor: "#263238",
        }}
      >
        <Typography
          variant="body"
          style={{ margin: "auto", fontSize: "25px", color: "white" }}
        >
          Past Applications
        </Typography>
      </Paper>
      <Paper
        elevation={10}
        style={{
          display: "flex",
          minHeight: "calc(98vh - 118px)",
          margin: "0 0.5vw 0 3vw",
        }}
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
          open={open}
          onClose={handleClose}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogBox
            request_id={id}
            permission={profileInfo.permission}
            status={status}
            showCommentSection={false}
          />
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
};

export default LTCforTA;
