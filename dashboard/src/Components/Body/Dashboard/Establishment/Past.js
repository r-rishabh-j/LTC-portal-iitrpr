import React from "react";
import { useState, useEffect } from "react"
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
import axios from "axios";
import GeneratePDF from "../../../Utilities/GeneratePDF";
import { useStyles } from "../DataGridStyles";
import DialogBox from "../DialogBox";
import DataGridToolbar from "../DataGridToolbar";
const moment = require('moment');

function Past({ permission }) {
  console.log("PAST", permission);
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("/api/getpastltc")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setTableData(data.previous);
      });
  }, []);

  const handleAttachmentClick = (event, cellValues) => {
    console.log(cellValues.row.request_id);
    const data = { request_id: cellValues.row.request_id };
    axios({
      method: "post",
      url: "api/getattachments",
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
  const [id, setId] = useState(-1);
  const [status, setStatus] = useState('');


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
      type: "date",
      valueGetter: (cellValues) => {
        return cellValues.value+"+530";
        // const time = formatDate(cellValues.value.replace('GMT', ''));
        // return Date(moment(time).local().format("DD/MM/YYYY"));
      }
    },
    {
      field: "stage",
      headerName: "Stage",
      flex: 1,
      minWidth: 150,
      renderCell: cellElement,
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
      sortable: false,
      filterable: false,
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
    // {
    //   field: "pdf",
    //   headerName: "PDF",
    //   minWidth: 150,
    //   renderCell: (cellValues) => {
    //     return (
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         onClick={(event) => {
    //           handleFormClick(event, cellValues);
    //         }}
    //       >
    //         Download
    //       </Button>
    //     );
    //   },
    // },
    // {
    //   field: "attachment",
    //   headerName: "Attachment",
    //   minWidth: 150,
    //   renderCell: (cellValues) => {
    //     return (
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         onClick={(event) => {
    //           handleAttachmentClick(event, cellValues);
    //         }}
    //       >
    //         View
    //       </Button>
    //     );
    //   },
    // },
  ];

  return (
    <>
      {/* <div style={{ textAlign: "center" }}>
        <Typography variant="body" style={{ margin: "auto", fontSize:"3vh" }}>
          Past Applications
        </Typography>
      </div> */}
      <Paper
        elevation={10}
        style={{ display: "flex", margin: "0 0.5vw 0 3vw", backgroundColor: '#263238' }}
      >
        <Typography variant="body1" style={{ margin: "auto", fontSize: "25px", color: "white" }}>
          Past LTC Applications
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
        <Dialog
          open={open}
          onClose={handleClose}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogBox request_id={id} permission={permission} status={status} process={"past"} showCommentSection={true} />
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

export default Past;
