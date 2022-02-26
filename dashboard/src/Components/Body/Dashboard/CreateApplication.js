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
import LockIcon from "@material-ui/icons/Lock";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useStyles } from "./FormStyles";
import FileUpload from "react-material-file-upload";


export default function CreateApplication(props) {
  const classes = useStyles();
  const { handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    axios({
      method: "POST",
      url: "/api/apply",
      headers: {
        Authorization: "Bearer " + props.token,
      },
      data: data
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
                  name="From"
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
                  name="To"
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
                  name="Day"
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
                        type="number"
                        required
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
                    name="SelfOut"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <TextField
                          label="Date of Outward journey"
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
                    name="SelfIn"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <TextField
                          label="Date of Inward journey"
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
                  <h5>Family</h5>

                  <Controller
                    name="FamilyOut"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <TextField
                          label="Date of Outward journey."
                          value={value}
                          onChange={onChange}
                          error={!!error}
                          type="text"
                        />
                      </>
                    )}
                  />

                  <Controller
                    name="FamilyIn"
                    control={control}
                    defaultValue=""
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <>
                        <TextField
                          label="Date of Inward journey."
                          value={value}
                          onChange={onChange}
                          error={!!error}
                          type="text"
                        />
                      </>
                    )}
                  />
                </div>
              </div>
              <div>
                <Controller
                  name="NatLTC"
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
              {/* <div>
                <Controller
                  name="EstFare"
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                      <>
                      <span>Estimated Fare plan</span>
                      <FileUpload value={value} onChange={onChange} />

                    </>
                  )}
                />
              </div> */}
              <div>
                <Controller
                  name="Adv"
                  control={control}
                  defaultValue=""
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
                  name="Encash"
                  control={control}
                  defaultValue=""
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
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </form>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}
