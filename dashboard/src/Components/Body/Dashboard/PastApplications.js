import React, { useState, useEffect } from 'react'
import { DataGrid } from "@mui/x-data-grid"
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

const PastApplications = ({permission}) => {
  //console.log(permission)
  const classes = useStyles();

  const [tableData, setTableData] = useState([])

  useEffect(() => {
    fetch("/api/getmyforms")
      .then((data) => data.json())
      .then((data) => {
        console.log(data.data);
        setTableData(data.data)
      })
  }, [])

  //rows = {tableData}
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
        // const url = window.URL.createObjectURL(new Blob([response.data]));
        // const link = document.createElement("a");
        // link.href = url;
        // link.setAttribute(
        //   "view",
        //   "ltc_" + cellValues.row.request_id + ".pdf"
        // ); //or any other extension
        // document.body.appendChild(link);
        // link.click();
        // console.log(response.data.type);
        // console.log(response.headers.get('content-type'));
        // var contentType = response.headers.get('content-type');
        // console.log('c', contentType);
        var blob = new Blob([response.data], { type: response.data.type });
        var url = window.URL.createObjectURL(blob, { oneTimeOnly: true });

        //window.open(url, '_blank', '');
        var anchor = document.createElement('a');
        anchor.href = url;
        anchor.target = '_blank';
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
    // console.log(cellValues.row.request_id);
    // const data = { request_id: cellValues.row.request_id };
    // axios({
    //   method: "post",
    //   url: "api/getformdata",
    //   data: JSON.stringify(data),
    //   headers: { "Content-type": "application/json" },
    // })
    //   .then((response) => {
    //     console.log(response.data);
    //     //GeneratePDF(response.data.data.form_data);
    //     form_data = response.data;
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       console.log(error.response);
    //       console.log(error.response.status);
    //       alert("Form not found");
    //     }
    //   });
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
      <div title={cellValues.formattedValue.replace('GMT', 'IST')} style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
        {cellValues.formattedValue.replace('GMT', 'IST')}
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
      renderCell: timeElement,
    },
    {
      field: "stage",
      headerName: "Stage",
      minWidth: 200,
      flex: 1,
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
            {/* <Dialog open={open} onClose={handleClose} classes={{paper: classes.dialogPaper}}>
              <DialogBox request_id={cellValues.row.request_id}/>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Close
                </Button>
                <Button onClick={handleClose} color="primary" autoFocus>
                  Approve
                </Button>
              </DialogActions>
            </Dialog> */}
          </>
        );
      },
    },
    {
      field: "pdf",
      headerName: "PDF",
      minWidth: 150,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleFormClick(event, cellValues);
            }}
          >
            Download
          </Button>
        );
      },
    },
    {
      field: "attachment",
      headerName: "Attachment",
      minWidth: 150,
      renderCell: (cellValues) => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => {
              handleAttachmentClick(event, cellValues);
            }}
          >
            View
          </Button>
        );
      },
    },
  ];

  // const rows = [
  //   { id: 1, date: "11-03-2022" },
  //   { id: 2, date: "12-03-2022" },
  // ];

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
        <Dialog
          open={open}
          onClose={handleClose}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogBox request_id={id} permission={permission} />
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
            {/* <Button onClick={handleClose} color="primary" autoFocus>
              Approve
            </Button> */}
          </DialogActions>
        </Dialog>
      </Paper>
    </>
  );
}

export default PastApplications
