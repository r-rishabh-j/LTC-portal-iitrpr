import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Grid,
  Typography,
  Button,
  Box,
  
} from "@material-ui/core";
import React from "react";
import { useState, useEffect, useRef} from "react";
import { useForm, Controller } from "react-hook-form";
import ReactToPrint from "react-to-print";
import axios from "axios";
import PrintOfficeOrder from "./PrintOfficeOrder";
const moment = require('moment');

function formatDate(date) {
  if (date==='' || date===null || date===undefined){
    return ' '
  }
  const d = moment(date).format("DD-MM-YYYY");
  return d;
}

export const OfficeOrderText = ({request_id}) => {

    const [formInfo, setFormInfo] = useState({
      created_on: "",
      request_id: "",
      form_data: { establishment: {} },
      comments: {},
    });
    const [orderInfo, setorderInfo] = useState({})
    const { control, handleSubmit, reset } = useForm();
     const printComponentRef = useRef();

    //fetch form details for the request id from getformdata api
    useEffect(() => {
      const data = { request_id: request_id };
      axios({
        method: "post",
        url: "api/print-office-order",
        data: JSON.stringify(data),
        headers: { "Content-type": "application/json" },
      })
        .then((response) => {
          console.log(response.data.data);
          setFormInfo(response.data.data);
          var info = response.data.data
          console.log(info.form_data["name"])
          var text =
            "Sanction of the competent authority is hereby conveyed to " +
            info.form_data["name"] +
            "(Pay level " +
            info.form_data["band_pay"] +
            "), " +
            info.form_data["designation"] +
            ", " +
            info.form_data["department"] +
            " for availing LTC(" +
            info.form_data["ltc_nature"] +
            ") for the year " +
            (info.form_data.establishment["est_data_block_year"] === undefined
              ? ""
              : info.form_data.establishment["est_data_block_year"]) +
            " for " +
            (info.form_data.establishment["est_data_last_ltc_for"] === undefined
              ? ""
              : info.form_data.establishment["est_data_last_ltc_for"]) +
            " . He/she will visit " +
            info.form_data["home_town"] +
            ". Dates of onward and return journey shall be " +
            formatDate(info.form_data["self_date_outward"]) +
            " and " +
            formatDate(info.form_data["self_date_inward"]) +
            " respectively. For the purpose, he/she has been sanctioned:\n\t1. " +
            info.form_data["nature"] +
            " leave for " +
            info.form_data["num_days"] +
            " from " +
            formatDate(info.form_data["nature_from"]) +
            " to " +
            formatDate(info.form_data["nature_to"]) +
            "\n" +
            (info.form_data["encashment_is_required"] === "Yes" ? "\t2. Encashment of " + info.form_data["encashment_days"] + " days Earned leave." : "");
          reset({'order_text': text})
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            alert("Form not found");
          }
        });
    }, []);

    const onSubmit = (data) => {
        console.log(data)
        setorderInfo(data)
    }

  return (
    <>
      {/* <Box display="flex" > */}
        {/* <Box > */}
          <DialogTitle>
            Office Order Text for LTC ID {request_id}:{" "}
            {formInfo.form_data["name"] === undefined
              ? " "
              : formInfo.form_data["name"]}
            , {formInfo["email"] === undefined ? " " : formInfo["email"]}{" "}
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography>Enter Office Order No.:</Typography>
              <Controller
                name="f_num"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <TextField
                      label="F. No."
                      onChange={onChange}
                      value={value}
                      error={!!error}
                      type="text"
                      required={true}
                      color="primary"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      //rows={rows}
                    />
                  </>
                )}
              />
              <Typography>Sample Text for Office Order:</Typography>
              <Controller
                name="order_text"
                control={control}
                defaultValue=""
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <>
                    <TextField
                      label="Generated Text"
                      onChange={onChange}
                      value={value}
                      error={!!error}
                      type="text"
                      required={true}
                      color="primary"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      multiline={true}
                      //rows={rows}
                    />
                  </>
                )}
              />
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </form>
            <Box display="flex" justifyContent="center">
              <ReactToPrint
                trigger={() => (
                  <Button variant="contained" color="primary">
                    Generate Order
                  </Button>
                )}
                content={() => printComponentRef.current}
                pageStyle={"@page {size: A4; margin: 200mm !important}"}
              />
            </Box>

            <div style={{ display: "none" }}>
              {orderInfo !== {} ? (
                <PrintOfficeOrder
                  ref={printComponentRef}
                  data={orderInfo}
                  signature={formInfo.signatures}
                  dept={
                    formInfo.form_data["department"] !== undefined
                      ? formInfo.form_data["department"]
                      : " "
                  }
                  name={
                    formInfo.form_data["name"] !== undefined
                      ? formInfo.form_data["name"]
                      : " "
                  }
                  self={
                    formInfo.form_data["name"] !== undefined &&
                    formInfo.form_data["designation"] !== undefined &&
                    formInfo.form_data["department"] !== undefined ? formInfo.form_data["name"] + ", " + formInfo.form_data["designation"] + ", " + formInfo.form_data["department"] : " "
                  }
                />
              ) : (
                <div />
              )}
            </div>
          </DialogContent>
        {/* </Box> */}
      {/* </Box> */}
    </>
  );
};
