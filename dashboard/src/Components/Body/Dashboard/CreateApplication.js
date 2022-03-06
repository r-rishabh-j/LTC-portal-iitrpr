import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Checkbox,
  Button,
  Typography,
} from "@material-ui/core";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LockIcon from "@material-ui/icons/Lock";
import { Link } from "react-router-dom";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useStyles } from "./FormStyles";
import GeneratePDF from "../../Utilities/GeneratePDF";
import FileUpload from "react-material-file-upload";
import { Box } from "@material-ui/core";

export default function CreateApplication(props) {
  const classes = useStyles();
  const {handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append('file', data.fare_plan) 
    console.log("OK")
    console.log((formData.get('file')));
    axios({
      method: "POST",
      url: "/api/apply",
      // headers: {
      //   Authorization: "Bearer " + props.token,
      // },
      data: data,
    })
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };
  return (
    <>
      <Grid container style={{ margin: "0 10vw" }}>
        <Paper elevation={10}>
          <Grid container>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
              <h3>APPLICATION FOR LEAVE TRAVEL CONCESSION </h3>
              <div>
                <h4>Personal Details</h4>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Name"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        type="text"
                        required
                      />
                    </>
                  )}
                />
                <Controller
                  name="Designation"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Designation"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        type="text"
                        required
                      />
                    </>
                  )}
                />
                <Controller
                  name="Department"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Department"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        type="text"
                        required
                      />
                    </>
                  )}
                />
                <Controller
                  name="DOJ"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          label="Date of Joining"
                          value={value}
                          onChange={onChange}
                          renderInput={(params) => (
                            <TextField {...params} required />
                          )}
                        />
                      </LocalizationProvider>
                    </>
                  )}
                />
                <Controller
                  name="Pay"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Band Pay +AGP/Gp"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        type="text"
                        required
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="SpouseLTC"
                  control={control}
                  defaultValue={false}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <span>Spouse Employed and entitled to LTC</span>
                      <Checkbox
                        label="spouse is employed, if yes whether
                        entitled to LTC"
                        onChange={onChange}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <h4>Leave Required</h4>

                <Controller
                  name="Nature"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Nature"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        type="text"
                        required
                      />
                    </>
                  )}
                />

                <Controller
                  name="FromPlace"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="From"
                        value={value}
                        onChange={onChange}
                        error={error}
                        type="text"
                        required
                      />
                    </>
                  )}
                />

                <Controller
                  name="ToPlace"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="To"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        type="text"
                        required
                      />
                    </>
                  )}
                />

                <Controller
                  name="Days"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="No of Days"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        type="text"
                        required
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <h4>Proposed Dates of Journey</h4>
                <div>
                  <h5>Self</h5>

                  <Controller
                    name="SelfOutDate"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date of Outward Journey"
                            value={value}
                            onChange={onChange}
                            renderInput={(params) => (
                              <TextField {...params} required />
                            )}
                          />
                        </LocalizationProvider>
                      </>
                    )}
                  />

                  <Controller
                    name="SelfInDate"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date of Inward Journey"
                            value={value}
                            onChange={onChange}
                            renderInput={(params) => (
                              <TextField {...params} required />
                            )}
                          />
                        </LocalizationProvider>
                      </>
                    )}
                  />
                </div>
                <div>
                  <h5>Family</h5>

                  <Controller
                    name="FamilyOutDate"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date of Outward Journey."
                            value={value}
                            onChange={onChange}
                            renderInput={(params) => (
                              <TextField {...params} required />
                            )}
                          />
                        </LocalizationProvider>
                      </>
                    )}
                  />

                  <Controller
                    name="FamilyInDate"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            label="Date of Inward Journey."
                            value={value}
                            onChange={onChange}
                            renderInput={(params) => (
                              <TextField {...params} required />
                            )}
                          />
                        </LocalizationProvider>
                      </>
                    )}
                  />
                </div>
              </div>
              <div>
                <Controller
                  name="NatureLTC"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Nature of LTC"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        type="text"
                        required
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="VisitPlace"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Place to visit(if India)"
                        value={value}
                        onChange={onChange}
                        error={!!error}
                        type="text"
                        required
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="EstimatedFare"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <span>Estimated Fare plan</span>
                      <input value={value} onChange={onChange} type="file" name="fare_plan"/>
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="AdvanceRequired"
                  control={control}
                  defaultValue={false}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <span>Advance Required</span>
                      <Checkbox
                        label="Advance Required"
                        onChange={onChange}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="Encashment"
                  control={control}
                  defaultValue={false}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <span>Encashment of earned leave required</span>
                      <Checkbox
                        label="Encashment Required"
                        onChange={onChange}
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </>
                  )}
                />
              </div>
              <Box display="flex" justifyContent="space-between">
              <Button type="submit" variant="contained">
                Submit
              </Button>
              <GeneratePDF></GeneratePDF>
              </Box>
            </form>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}
