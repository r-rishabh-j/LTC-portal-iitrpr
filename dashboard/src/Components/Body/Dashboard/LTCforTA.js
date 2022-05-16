import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Grid, Paper, TableCell, Typography } from "@material-ui/core";
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
import DataGridToolbar from "./DataGridToolbar";
const moment = require("moment");

const LTCforTA = ({ profileInfo }) => {
  //console.log(permission)
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);
  const [ltcId, setLtcId] = useState(null);

  useEffect(() => {
    fetch("/api/ta/get-approved-ltc")
      .then((data) => data.json())
      .then((data) => {
        // console.log(data.data);
        setTableData(data.data);
      });
  }, []);

  //rows = {tableData}
  // const handleAttachmentClick = (event, cellValues) => {
  //   // console.log(cellValues.row.request_id);
  //   const data = { request_id: cellValues.row.request_id };
  //   axios({
  //     method: "post",
  //     url: "api/ta/getattachments",
  //     data: JSON.stringify(data),
  //     headers: { "Content-type": "application/json" },
  //     responseType: "blob",
  //   })
  //     .then((response) => {
  //       var blob = new Blob([response.data], { type: response.data.type });
  //       var url = window.URL.createObjectURL(blob, { oneTimeOnly: true });
  //       var anchor = document.createElement("a");
  //       anchor.href = url;
  //       anchor.target = "_blank";
  //       anchor.click();
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         console.log(error.response);
  //         console.log(error.response.status);
  //         alert("No attachments");
  //       }
  //     });
  // };

  // const handleFormClick = (event, cellValues) => {
  //   // console.log(cellValues.row.request_id);
  //   const data = { request_id: cellValues.row.request_id };
  //   axios({
  //     method: "post",
  //     url: "api/getformdata",
  //     data: JSON.stringify(data),
  //     headers: { "Content-type": "application/json" },
  //   })
  //     .then((response) => {
  //       console.log(response.data.data.form_data);
  //       GeneratePDF(response.data.data.form_data);
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         console.log(error.response);
  //         console.log(error.response.status);
  //         alert("Form not found");
  //       }
  //     });
  // };

  const handleCellClick = (param, event) => {
    event.stopPropagation();
  };

  const handleRowClick = (param, event) => {
    event.stopPropagation();
  };

  const [open, setOpen] = useState(false);
  const [id, setId] = useState(-1);

  const handleClickOpen = (event, cellValues) => {
    setOpen(true);
    setId(cellValues.row.request_id);
  };

  const handleTaFill = (event, cellValues) => {
    setLtcId(cellValues.row.request_id);
  }



  const handleClose = () => {
    setOpen(false);
  };


  // const editForm = (event, cellValues) => {
  //   setOpenReview(true);
  //   setId(cellValues.row.request_id);
  //   // console.log("Open a new dialog box");
  // };

  // const stageElement = (cellValues) => {
  //   return cellValues.row.stage !== "review" ? (
  //     <div
  //       title={cellValues.formattedValue}
  //       style={{
  //         overflow: "hidden",
  //         whiteSpace: "nowrap",
  //         textOverflow: "ellipsis",
  //       }}
  //     >
  //       {cellValues.formattedValue}
  //     </div>
  //   ) : (
  //     <Button
  //       style={{ backgroundColor: "orange" }}
  //       variant="contained"
  //       onClick={(event) => {
  //         editForm(event, cellValues);
  //       }}
  //     >
  //       Review
  //     </Button>
  //   );
  // };
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
    // const time = formatDate(cellValues.formattedValue.replace("GMT", ""));
    const time = formatDate(cellValues.formattedValue);
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
      headerName: "LTC Application ID",
      minWidth: 150,
      flex: 1,
      renderCell: cellElement,
    },
    {
      field: "approved_on",
      headerName: "Approved on",
      minWidth: 150,
      flex: 1,
      type: "date",
      renderCell: timeElement,
      valueGetter: (cellValues) => {
        return cellValues.value+"+530";
        // const time = formatDate(cellValues.value.replace('GMT', ''));
        // return Date(moment(time).local().format("DD/MM/YYYY"));
      }
    },

    {
      field: "form",
      headerName: "View LTC Form",
      minWidth: 150,
      flex: 1,
      disableExport: true,
      filterable: false,
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
    {
      field: "fill_ta",
      headerName: "Fill TA Form",
      minWidth: 150,
      flex: 1,
      disableExport: true,
      filterable: false,
      sortable: false,

      renderCell: (cellValues) => {
        return (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => {
                handleTaFill(event, cellValues);
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
      {ltcId === null ?
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
              variant="body1"
              style={{ margin: "auto", fontSize: "25px", color: "white" }}
            >
              Pick an approved LTC application to continue....
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
                components={{ Toolbar: DataGridToolbar }}
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
                status={"approved"}
                showCommentSection={false}
              />
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
          <Box minHeight="2vh"></Box></>
        : <TAForm profileInfo={profileInfo} ltcId={ltcId} />}
    </>
  );
};

export default LTCforTA;
