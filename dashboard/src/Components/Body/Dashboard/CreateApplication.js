import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Checkbox,
  Button,
  Typography,
  Box,
  Fab
} from "@material-ui/core";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LockIcon from "@material-ui/icons/Lock";
import { Link } from "react-router-dom";
import { useForm, Controller} from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useStyles } from "./FormStyles";
import GeneratePDF from "../../Utilities/GeneratePDF";
import FileUpload from "react-material-file-upload";
import { FormInputText } from "../../Utilities/FormInputText";
import { FormInputDate } from "../../Utilities/FormInputDate"
import { FormInputNumber } from "../../Utilities/FormInputNumber"
import { FormInputRadio } from "../../Utilities/FormInputRadio";
import Add from "@material-ui/icons/Add";

const defaultValues = {
  textValue: "",
  // dateValue: new Date()
}

export default function CreateApplication(props) {
  const classes = useStyles();
  const { handleSubmit, control } = useForm({defaultValues: defaultValues});
  const [File, setFile] = useState(null)

  const onSubmit = (data) => {
    const formData = new FormData();

    console.log('data: ', JSON.stringify(data))
    formData.append('attachments', data.attachments[0]);
    formData.append('form', JSON.stringify(data));

    console.log("onSubmit")
    console.log(data);
    axios({
      method: "POST",
      url: "/api/apply",
      data: formData
    })
      .then((response) => {
        console.log('s', response.status)
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          alert('Error. Please try logging in again');
        }
      });
  };
  return (
    <>
      <Grid container>
        <Paper elevation={10} className={classes.contain}>
          <Grid container>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" style={{ fontWeight: "bold" }}>
                  Application for Leave Travel Concession{" "}
                </Typography>
              </Box>

              <div>
                {/* <h4>Leave Required</h4> */}

                <Grid item xs={12}>
                  <FormInputText
                    name={"Name"}
                    control={control}
                    label={"Name"}
                    required={true}
                    defaultValue={"Name"}
                    disabled={true}
                  />
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormInputText
                      name={"Designation"}
                      control={control}
                      label={"Designation"}
                      required={true}
                      defaultValue={"Designation"}
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputText
                      name="Department"
                      control={control}
                      label="Department"
                      required={true}
                      defaultValue={"Department"}
                      disabled={true}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormInputText
                      name="Employee Code"
                      control={control}
                      label="Employee Code"
                      required={true}
                      defaultValue={"123456"}
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <FormInputDate
                      name="Date of entering the Central Government
Service/Date of Joining with IIT Ropar"
                      control={control}
                      label="Date of entering the Central Government
Service/Date of Joining with IIT Ropar"
                      required={true}
                    />
                  </Grid>
                </Grid>
                <FormInputText
                  name="Band Pay + AGP/GP"
                  control={control}
                  label="Band Pay + AGP/GP"
                  required={true}
                />
                <Typography style={{ fontWeight: "bold" }}>
                  Leave Required
                </Typography>

                <FormInputText
                  name="Nature"
                  control={control}
                  label="Nature"
                  required={true}
                />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormInputDate
                      name="Nature From"
                      control={control}
                      label="From"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormInputDate
                      name="Nature To"
                      control={control}
                      label="To"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormInputNumber
                      name="No. of Days"
                      control={control}
                      label="No. of Days"
                      required={true}
                    />
                  </Grid>
                </Grid>

                <Typography>Prefix:</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="Prefix From"
                      control={control}
                      label="From"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="Prefix To"
                      control={control}
                      label="To"
                      required={true}
                    />
                  </Grid>
                </Grid>
                <Typography>Suffix:</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="Suffix From"
                      control={control}
                      label="From"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="Suffix To"
                      control={control}
                      label="To"
                      required={true}
                    />
                  </Grid>
                </Grid>
                <Typography>
                  Whether spouse is employed, if yes whether entitled to LTC
                </Typography>
                <FormInputRadio
                  name="Whether spouse is employed, if yes whether
entitled to LTC"
                  control={control}
                  label="Whether spouse is employed, if yes whether
entitled to LTC"
                />

                <Typography style={{ fontWeight: "bold" }}>
                  Proposed dates of Journey
                </Typography>
                <Typography>Self:</Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="Self Date of Outward journey"
                      control={control}
                      label="Date of Outward journey"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="Self Date of Inward journey"
                      control={control}
                      label="Date of Inward journey"
                      required={true}
                    />
                  </Grid>
                </Grid>

                <Typography>Family:</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="Family Date of Outward journey"
                      control={control}
                      label="Date of Outward journey"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="Family Date of Inward journey"
                      control={control}
                      label="Date of Inward journey"
                      required={true}
                    />
                  </Grid>
                </Grid>
                <FormInputText
                  name="Home Town"
                  control={control}
                  label="Home Town as recorded in the Service Book"
                  required={true}
                />
                <FormInputText
                  name="Nature of LTC"
                  control={control}
                  label="Nature of LTC to be availed, Home Town /
Anywhere in India with Block Year"
                  required={true}
                />
                <FormInputText
                  name="Place"
                  control={control}
                  label="If, anywhere in India, the place to be visited"
                  required={true}
                />
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <FormInputText
                      name="Estimated Fare"
                      control={control}
                      label="Estimated fare of entitled class from the
headquarter to Home Town/Place of visit by
shortest route (proofs need to be attached)."
                      required={true}
                    />
                  </Grid>

                  <Grid item xs={3} style={{ margin: "auto" }}>
                    <Controller
                      name="attachments"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Fab
                            variant="extended"
                            component="label"
                            size="small"
                            color="primary"
                          >
                            <input
                              type="file"
                              onChange={(e) => {
                                field.onChange(e.target.files);
                                if (!e.target.files[0]) {
                                  setFile("No file chosen");
                                } else {
                                  setFile(e.target.files[0].name);
                                }
                              }}
                              style={{ display: "none" }}
                            />
                            <Add />
                            Upload Proofs
                          </Fab>
                        </>
                      )}
                    />

                    <Typography>{File}</Typography>
                  </Grid>
                </Grid>
                <Typography style={{ fontWeight: "bold" }}>
                  Person(s) in respect of whom LTC is proposed to be availed:
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={1}>
                    <FormInputText
                      name="SNo1"
                      control={control}
                      label="S.No."
                      required={false}
                      disabled={true}
                      defaultValue={"1"}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <FormInputText
                      name="Name1"
                      control={control}
                      label="Name"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="Age1"
                      control={control}
                      label="Age"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="Relationship1"
                      control={control}
                      label="Relationship"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="Travelling From1"
                      control={control}
                      label="Travelling(Place) From"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="Travelling To1"
                      control={control}
                      label="Travelling(Place) To"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="Back1"
                      control={control}
                      label="Back(Yes/No)"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="Mode of Travel1"
                      control={control}
                      label="Mode of Travel"
                      required={false}
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <FormInputText
                      name="SNo2"
                      control={control}
                      label="S.No."
                      required={false}
                      disabled={true}
                      defaultValue={"2"}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <FormInputText
                      name="Name2"
                      control={control}
                      label="Name"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="Age2"
                      control={control}
                      label="Age"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="Relationship2"
                      control={control}
                      label="Relationship"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="Travelling From2"
                      control={control}
                      label="Travelling(Place) From"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="Travelling To2"
                      control={control}
                      label="Travelling(Place) To"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="Back2"
                      control={control}
                      label="Back(Yes/No)"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="Mode of Travel2"
                      control={control}
                      label="Mode of Travel"
                      required={false}
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <FormInputText
                      name="SNo3"
                      control={control}
                      label="S.No."
                      required={false}
                      disabled={true}
                      defaultValue={"3"}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <FormInputText
                      name="Name3"
                      control={control}
                      label="Name"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="Age3"
                      control={control}
                      label="Age"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="Relationship3"
                      control={control}
                      label="Relationship"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="Travelling From3"
                      control={control}
                      label="Travelling(Place) From"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="Travelling To3"
                      control={control}
                      label="Travelling(Place) To"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="Back3"
                      control={control}
                      label="Back(Yes/No)"
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="Mode of Travel3"
                      control={control}
                      label="Mode of Travel"
                      required={false}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>Advance Required</Typography>
                    <FormInputRadio
                      name="Advance Required"
                      control={control}
                      label="Advance Required"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Encashment of earned leave required</Typography>
                    <FormInputRadio
                      name="Encashment Required"
                      control={control}
                      label="Encashment Required"
                    />
                  </Grid>
                </Grid>
                <FormInputNumber
                  name="Encashment Days"
                  control={control}
                  label="No. of encashment of leave days "
                />
              </div>
              <Box display="flex" justifyContent="center">
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              </Box>
              {/* <GeneratePDF /> */}
            </form>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}
