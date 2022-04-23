import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Grid, Paper, Typography } from "@material-ui/core";
import { Button, ClickAwayListener } from "@mui/material";
import axios from "axios";
import GeneratePDF from "../../../Utilities/GeneratePDF";

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
      // console.log(response.headers['content-type'])
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", "file.pdf"); //or any other extension
      // document.body.appendChild(link);
      // link.click();
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
  }).then((response) => {
    console.log(response.data.data.form_data)
    GeneratePDF(response.data.data.form_data);
  }).catch((error) => {
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

const cellElement = (cellValues) => {
  return (
    <div title={cellValues.formattedValue} style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
      {cellValues.formattedValue}
    </div>
  );
}
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
  { field: "request_id", headerName: "Application ID", minWidth: 100, flex: 1, renderCell: cellElement },
  { field: "user", headerName: "User Email", minWidth: 150, flex: 1, renderCell: cellElement },
  { field: "name", headerName: "Name", minWidth: 150, flex: 1, renderCell: cellElement },
  { field: "created_on", headerName: "Created on", minWidth: 150, flex: 1, renderCell: timeElement },
  { field: "stage", headerName: "Stage", flex: 1, minWidth: 150, renderCell: cellElement },
  { field: "is_active", headerName: "Status", minWidth: 150, flex: 1, renderCell: cellElement },
  {
    field: "form",
    headerName: "Form",
    flex: 1,
    renderCell: (cellValues) => {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={(event) => {
            handleFormClick(event, cellValues);
          }}
        >
          View
        </Button>
      );
    },
  },
  {
    field: "attachment",
    headerName: "Attachment",
    flex: 1,
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
// const columns = [
//   /*
//   id, email, created on, is active, stage, view form, download(button)*/
//   { field: "request_id", headerName: "Application ID", width: 150 },
//   { field: "user", headerName: "User Email", width: 150 },
//   { field: "user_id", headerName: "User ID", width: 90 },
//   { field: "created_on", headerName: "Created on", width: 200 },
//   { field: "stage", headerName: "Stage", width: 150 },
//   { field: "is_active", headerName: "Status", width: 150 },
//   {
//     field: "form",
//     headerName: "Form",
//     width: 150,
//     renderCell: (cellValues) => {
//       return (
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={(event) => {
//             handleFormClick(event, cellValues);
//           }}
//         >
//           Download
//         </Button>
//       );
//     },
//   },
//   {
//     field: "attachment",
//     headerName: "Attachment",
//     width: 150,
//     renderCell: (cellValues) => {
//       return (
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={(event) => {
//             handleAttachmentClick(event, cellValues);
//           }}
//         >
//           View
//         </Button>
//       );
//     },
//   },
// ];

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
      <div style={{ textAlign: "center" }}>
        <Typography variant="h5" style={{ margin: "auto" }}>
          Previous Applications
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
      </Paper>
    </>
  );
}

export default PreviousApplications