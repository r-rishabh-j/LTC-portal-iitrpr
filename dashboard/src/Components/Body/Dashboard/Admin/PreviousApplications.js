import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Paper, Typography } from "@material-ui/core";
import { Button } from "@mui/material";
import axios from "axios";

const handleAttachmentClick = (event, cellValues) => {
  console.log(cellValues.row.request_id);
  const data = { request_id: cellValues.row.request_id };
  // console.log(JSON.stringify(data))
  axios({
    method: "post",
    url: "api/getattachments",
    data: JSON.stringify(data),
    headers: { "Content-type": "application/json" },
    responseType: "blob",
  })
    .then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.pdf"); //or any other extension
      document.body.appendChild(link);
      link.click();
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
};

const handleCellClick = (param, event) => {
  event.stopPropagation();
};

const handleRowClick = (param, event) => {
  event.stopPropagation();
};

const columns = [
  /*
  id, email, created on, is active, stage, view form, download(button)*/
  { field: "request_id", headerName: "Application ID", width: 150 },
  { field: "user", headerName: "User Email", width: 150 },
  { field: "user_id", headerName: "User ID", width: 90 },
  { field: "created_on", headerName: "Created on", width: 200 },
  { field: "stage", headerName: "Stage", width: 150 },
  { field: "is_active", headerName: "Status", width: 150 },
  {
    field: "form",
    headerName: "Form",
    width: 150,
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
    width: 150,
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

function PreviousApplications() {
     const [tableData, setTableData] = useState([]);

     useEffect(() => {
       fetch("/api/get-form-meta")
         .then((data) => data.json())
         .then((data) => {
           console.log(data);
        setTableData(data.data);
         });
     }, []);

  return (
    <>
      <Paper
        elevation={10}
        style={{ display: "flex", height: "100vh", margin: "0 0.5vw 0 3vw" }}
      >
        
        <Grid container style={{ flexGrow: 1 }}>
          <DataGrid initialState={{sorting: {sortModel: [{field: 'request_id', sort: 'desc'}]}}} columns={columns} rows={tableData} getRowId={(row) => row.request_id} checkboxSelection onCellClick={handleCellClick} onRowClick={handleRowClick}/>
        </Grid>
      </Paper>
    </>
  )
}

export default PreviousApplications