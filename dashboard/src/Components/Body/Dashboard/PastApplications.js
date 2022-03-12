import React, {useState, useEffect} from 'react'
import {DataGrid} from "@mui/x-data-grid"
import { Grid, Paper, Typography } from '@material-ui/core'
import { ClassNames } from '@emotion/react'
import { useStyles } from "./DataGridStyles";


const columns = [
  /*
  id, email, created on, is active, stage, view form, download(button)*/
  { field: 'id', headerName: 'Application ID', width: 100},
  { field: 'date', headerName: 'Updated on', width: 150},
  { field: 'status', headerName: "Status", width: 200},
  { field: 'download', headerName: "Download PDF", width: 150}

]

const rows = [
  {id: 1, date: '11-03-2022'},
  {id: 2, date: '12-03-2022'}
]

const PastApplications = () => {
  const classes = useStyles();

  const [tableData, setTableData] = useState([])

  // useEffect(() => {
  //   fetch("/")
  //   .then((data) => data.json())
  //   .then((data) => setTableData(data))
  // })

  //rows = {tableData}
  return (
    <>
      <Paper
        elevation={10}
        style={{ display: "flex", height: "100vh", margin: "0 0.5vw 0 3vw" }}
      >
        
        <Grid container style={{ flexGrow: 1 }}>
          <DataGrid columns={columns} rows={rows} checkboxSelection/>
        </Grid>
      </Paper>
    </>
  );
}

export default PastApplications
