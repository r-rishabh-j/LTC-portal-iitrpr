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
import GeneratePDF from "../../../Utilities/GeneratePDF";
import { useStyles } from "../DataGridStyles";
import DialogBox from "../DialogBox";

function Review({ permission }) {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("/api/establishment-review")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setTableData(data.review);
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

  const handleClickOpen = (event, cellValues) => {
    setOpen(true);
    setId(cellValues.row.request_id);
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
      field: "created_on",
      headerName: "Created on",
      minWidth: 150,
      flex: 1,
      renderCell: timeElement,
    },
    // {
    //   field: "stage",
    //   headerName: "Stage",
    //   flex: 1,
    //   minWidth: 150,
    //   renderCell: cellElement,
    // },
    {
      field: "received_from",
      headerName: "Received From",
      minWidth: 150,
      flex: 1,
      renderCell: cellElement,
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
      <div style={{ textAlign: "center" }}>
        <Typography variant="h5" style={{ margin: "auto" }}>
          Applications for Review
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
        <Dialog
          open={open}
          onClose={handleClose}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogBox request_id={id} permission={permission} process="review"/>
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

export default Review;
