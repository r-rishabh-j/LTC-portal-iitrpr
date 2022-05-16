import React from 'react'
import { forwardRef } from 'react'
import {
  Box,
  Typography,
} from "@material-ui/core";

const PrintOfficeOrder = forwardRef((props, ref) => {

  let today = new Date().toISOString().slice(0, 10)

  return (
    <div ref={ref}>
      <Box display="flex" justifyContent="center">
        <img src={require("../../Dashboard/iitrpr_logo.png")} width="100px" />
        <center>
          <Typography variant="h4">
            भारतीय प्रौद्योगिकी संस्थान रोपड़
          </Typography>
          <Typography variant="h5">
            INDIAN INSTITUTE OF TECHNOLOGY ROPAR
          </Typography>
          <Typography variant="body1">
            रूपनगर, पंजाब-140001/ Rupnagar, Punjab-140001
          </Typography>
        </center>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "4vh 0 0 0" }}
      >
        <Typography>
          F. No. {props.data !== {} ? props.data.f_num : " "}
        </Typography>
        <Typography>Dated: {today}</Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        style={{ margin: "6vh 0 0 0" }}
      >
        <Typography variant="h6" style={{ fontWeight: "bold", textDecoration: "underline" }}>
          OFFICE ORDER
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        style={{ margin: "4vh 0 0 0" }}
      >
        {props.data !== {} ? props.data.order_text : " "}
      </Box>
      <Box
        display="flex"
        justifyContent="right"
        style={{ margin: "4vh 0 0 0" }}
      >
        Signature
      </Box>
      <Box
        display="flex"
        justifyContent="left"
        style={{ margin: "5vh 0 0 0" }}
      >
        <Typography>Copy to:-<br/>1. Dean (Faculty Affairs & Administration)<br/>2. Head, {props.dept}<br/>3. {props.self}<br/>4. Assistant Registrar (Accounts)<br/> 5. Personal File - {props.name}</Typography>
      </Box>
    </div>
  );
})

export default PrintOfficeOrder