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
import axios from "axios";
// import { useStyles } from "./UploadDialogBoxStyles";
import { useStyles } from "../DataGridStyles";
import UploadDialogBox from "./UploadDialogBox";
import DialogBox from "../DialogBox";
import ButtonDropDown from "../ButtonDropDown";
import { OfficeOrderText } from "./OfficeOrderText";
import DataGridToolbar from "../DataGridToolbar";
const moment = require('moment');

const UploadOfficeOrder = ({ permission }) => {
  const classes = useStyles();

  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    fetch("/api/get-pending-office-order-req")
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
  const [textOpen, setTextOpen] = useState(false);
  const [formOpen, setformOpen] = useState(false);
  const [id, setId] = useState(-1);

  const handleClickOpen = (cellValues) => {
    setOpen(true);
    setId(cellValues.row.request_id);
  };
  const handleTextClickOpen = (cellValues) => {
    setTextOpen(true);
    setId(cellValues.row.request_id);
  };

  const handleFormOpen = (event, cellValues) => {
    setformOpen(true);
    setId(cellValues.row.request_id);
  };

  const handleformClose = () => {
    setformOpen(false);
  };
  const handleTextClose = () => {
    setTextOpen(false);
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
      minWidth: 60,
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
      field: "approved_on",
      headerName: "Approved on",
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
      field: "form",
      headerName: "Form",
      minWidth: 80,
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
                handleFormOpen(event, cellValues);
              }}
            >
              View
            </Button>
          </>
        );
      },
    },
    {
      field: "upload",
      headerName: "Office Order",
      minWidth: 160,
      flex: 1,
      renderCell: (cellValues) => {
        const prop = [
          {
            text: "Upload",
            action: (() => {
              handleClickOpen(cellValues);
            })
          },
          {
            text: "Generate",
            action: (() => {
              handleTextClickOpen(cellValues)
            })
          },
        ]
        return (
          <ButtonDropDown
            buttonTitle='Office Order'
            elements={prop}
          />
        );
      },
      // renderCell: (cellValues) => {
      //   return (
      //     <Button
      //       variant="contained"
      //       color="primary"
      //       onClick={(event) => {
      //         handleClickOpen(event, cellValues);
      //       }}
      //     >
      //       Upload
      //     </Button>
      //   );
      // },
    },
  ];

  return (
    <>
      <Paper
        elevation={10}
        style={{ display: "flex", margin: "0 0.5vw 0 3vw", backgroundColor: '#263238' }}
      >
        <Typography variant="body1" style={{ margin: "auto", fontSize: "25px", color: "white" }}>
          Upload LTC Office order
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
          open={formOpen}
          onClose={handleformClose}
          classes={{ paper: classes.dialogPaper }}
        >
          <DialogBox request_id={id} showCommentSection={false} />
          <DialogActions>
            <Button onClick={handleformClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={open}
          onClose={handleClose}
          classes={{ paper: classes.uploadDialogPaper }}
        >
          <UploadDialogBox request_id={id} api={"/api/upload-office-order"} />
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={textOpen}
          onClose={handleTextClose}
          classes={{ paper: classes.officeOrderDialogPaper }}
        >
          <OfficeOrderText request_id={id} />
          <DialogActions>
            <Button onClick={handleTextClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
      <Box minHeight="2vh"></Box>
    </>
  );
}

export default UploadOfficeOrder