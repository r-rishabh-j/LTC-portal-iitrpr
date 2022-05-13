import React from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  Box,
  Fab
} from "@material-ui/core";
import { useForm, Controller, useFieldArray, get } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { useStyles } from "./FormStyles";
import GeneratePDF from "../../Utilities/GeneratePDF";
import { FormInputText } from "../../Utilities/FormInputText";
import { FormInputDate } from "../../Utilities/FormInputDate"
import { FormInputNumber } from "../../Utilities/FormInputNumber"
import { FormInputRadio } from "../../Utilities/FormInputRadio";
import Add from "@material-ui/icons/Add";
import useAuthCookie from "../../Login/useAuthCookie";
import "bootstrap/dist/css/bootstrap.min.css";
import { FieldArrayInput } from "../../Utilities/FieldArrayInput";

// function getCookie(name) {
//   if (!document.cookie) {
//     return null;
//   }

//   const xsrfCookies = document.cookie.split(';')
//     .map(c => c.trim())
//     .filter(c => c.startsWith(name + '='));

//   if (xsrfCookies.length === 0) {
//     return null;
//   }
//   return decodeURIComponent(xsrfCookies[0].split('=')[1]);
// }

// const csrf = getCookie('csrf_access_token');
// console.log('csrf', csrf);

export default function CreateApplication({ profileInfo }) {
  console.log(profileInfo);
  const classes = useStyles();
  const { handleSubmit, control, register, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      dependents: [{ dep_name: "", dep_age: "", dep_relationship: "", dep_travelling_from: "" }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control, name: "dependents"
  })
  const [File, setFile] = useState(null);

  //options for radio input
  const options = [
    {
      index: 1,
      label: "Yes",
      value: "Yes",
    },
    {
      index: 2,
      label: "No",
      value: "No",
    },
  ];

  const onSubmit = (data) => {
    console.log("Submitting", isSubmitting);
    const formData = new FormData();

    data.name = profileInfo.name;
    //data.designation = profile.permission;
    data.department = profileInfo.department;
    data.emp_code = profileInfo.employee_code;


    console.log('data: ', JSON.stringify(data));
    formData.append('attachments', data.attachments[0]);
    formData.append('form', JSON.stringify(data));

    console.log("onSubmit")
    console.log(data);
    return axios({
      method: "POST",
      url: "/api/apply",
      data: formData,
    })
      .then((response) => {
        alert("Application submitted!")
        window.location.reload()
      })
      .catch((error) => {
        if (error.response) {
          console.log('error is', error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          alert(error.response.data.error)
        }
      });
  };
  // const onSubmit = (data) => {
  //   console.log("Submitting", isSubmitting);
  //   // console.log("Submitting", formState);
  //   const formData = new FormData();

  //   const profile = JSON.parse(sessionStorage.getItem('profile'));
  //   data.name = profile.name;
  //   //data.designation = profile.permission;
  //   data.department = profile.department;
  //   data.emp_code = profile.employee_code;


  //   console.log('data: ', JSON.stringify(data));
  //   formData.append('attachments', data.attachments[0]);
  //   formData.append('form', JSON.stringify(data));

  //   console.log("onSubmit")
  //   console.log(data);
  //   axios({
  //     method: "POST",
  //     url: "/api/apply",
  //     data: formData
  //   })
  //     .then((response) => {
  //       console.log('s', response.status)
  //       if (response.status === 200) {
  //         alert("Application submitted!")
  //         window.location.reload()
  //       }
  //       else {
  //         alert("Error submitting, try again")
  //       }
  //     })
  //     .catch((error) => {
  //       if (error.response) {
  //         console.log(error.response);
  //         console.log(error.response.status);
  //         console.log(error.response.headers);
  //         alert('Error. Please try logging in again');
  //       }
  //     });
  // };
  return profileInfo === {} ? null : (
    <>
      <Grid container>
        <Paper elevation={10} className={classes.contain}>
          <Grid container>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" style={{ fontWeight: "bold" }}>
                  Application for Leave Travel Concession
                </Typography>
              </Box>

              <div>
                {/* <h4>Leave Required</h4> */}
                <Grid item xs={12}>
                  <FormInputText
                    profileInfo={profileInfo}
                    name={"name"}
                    control={control}
                    label={"Name"}
                    required={true}
                    autofill={true}
                    disabled={true}
                    defaultValue={"Name"}
                  />
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name={"designation"}
                      control={control}
                      label={"Designation"}
                      required={true}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="department"
                      control={control}
                      label="Department"
                      required={true}
                      autofill={true}
                      disabled={true}
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="emp_code"
                      control={control}
                      label="Employee Code"
                      required={true}
                      autofill={true}
                      disabled={true}
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <FormInputDate
                      name="joining_date"
                      control={control}
                      label="Date of entering the Central Government
Service/Date of Joining with IIT Ropar"
                      required={true}
                    />
                  </Grid>
                </Grid>
                <FormInputText
                  profileInfo={profileInfo}
                  name="band_pay"
                  control={control}
                  label="Pay Level"
                  required={true}
                  defaultValue={""}
                />
                <Typography style={{ fontWeight: "bold" }}>
                  Leave Required
                </Typography>

                <FormInputText
                  profileInfo={profileInfo}
                  name="nature"
                  control={control}
                  label="Nature"
                  required={true}
                  defaultValue={""}
                />
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <FormInputDate
                      name="nature_from"
                      control={control}
                      label="From"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormInputDate
                      name="nature_to"
                      control={control}
                      label="To"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormInputNumber
                      name="num_days"
                      control={control}
                      label="No. of Days"
                      required={true}
                      defaultValue={0}
                    />
                  </Grid>
                </Grid>

                <Typography>Prefix:</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="prefix_from"
                      control={control}
                      label="From"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="prefix_to"
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
                      name="suffix_from"
                      control={control}
                      label="From"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="suffix_to"
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
                  name="spouse_is_employed"
                  control={control}
                  label="Whether spouse is employed, if yes whether
entitled to LTC"
                  options={options}
                />

                <Typography style={{ fontWeight: "bold" }}>
                  Proposed dates of Journey
                </Typography>
                <Typography>Self:</Typography>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="self_date_outward"
                      control={control}
                      label="Date of Outward journey"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="self_date_inward"
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
                      name="family_date_outward"
                      control={control}
                      label="Date of Outward journey"
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputDate
                      name="family_date_inward"
                      control={control}
                      label="Date of Inward journey"
                      required={true}
                    />
                  </Grid>
                </Grid>
                <FormInputText
                  profileInfo={profileInfo}
                  name="home_town"
                  control={control}
                  label="Home Town as recorded in the Service Book"
                  required={true}
                  defaultValue={""}
                />
                <FormInputText
                  profileInfo={profileInfo}
                  name="ltc_nature"
                  control={control}
                  label="Nature of LTC to be availed, Home Town /
Anywhere in India with Block Year"
                  required={true}
                  defaultValue={""}
                />
                <FormInputText
                  profileInfo={profileInfo}
                  name="place"
                  control={control}
                  label="If, anywhere in India, the place to be visited"
                  required={true}
                  defaultValue={""}
                />
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="est_fare"
                      control={control}
                      label="Estimated fare of entitled class from the
headquarter to Home Town/Place of visit by
shortest route (proofs need to be attached)."
                      required={true}
                      defaultValue={""}
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
                              accept=".pdf,.zip"
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
                <FieldArrayInput
                  name={"dependents"}
                  control={control}
                  fields={fields}
                  remove={remove}
                  append={append}
                />
                {/* <Grid container spacing={1}>
                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="sno_1"
                      control={control}
                      label="S.No."
                      required={false}
                      disabled={true}
                      defaultValue={"1"}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="name_1"
                      control={control}
                      label="Name"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="age_1"
                      control={control}
                      label="Age"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="relationship_1"
                      control={control}
                      label="Relationship"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="travelling_from_1"
                      control={control}
                      label="Travelling(Place) From"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="travelling_to_1"
                      control={control}
                      label="Travelling(Place) To"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="back_1"
                      control={control}
                      label="Back(Yes/No)"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="travel_mode_1"
                      control={control}
                      label="Mode of Travel"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="sno_2"
                      control={control}
                      label="S.No."
                      required={false}
                      disabled={true}
                      defaultValue={"2"}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="name_2"
                      control={control}
                      label="Name"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="age_2"
                      control={control}
                      label="Age"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="relationship_2"
                      control={control}
                      label="Relationship"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="travelling_from_2"
                      control={control}
                      label="Travelling(Place) From"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="travelling_to_2"
                      control={control}
                      label="Travelling(Place) To"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="back_2"
                      control={control}
                      label="Back(Yes/No)"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="travel_mode_2"
                      control={control}
                      label="Mode of Travel"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="sno_3"
                      control={control}
                      label="S.No."
                      required={false}
                      disabled={true}
                      defaultValue={"3"}
                    />
                  </Grid>

                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="name_3"
                      control={control}
                      label="Name"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="age_3"
                      control={control}
                      label="Age"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="relationship_3"
                      control={control}
                      label="Relationship"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="travelling_from_3"
                      control={control}
                      label="Travelling(Place) From"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="travelling_to_3"
                      control={control}
                      label="Travelling(Place) To"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="back_3"
                      control={control}
                      label="Back(Yes/No)"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      profileInfo={profileInfo}
                      name="travel_mode_3"
                      control={control}
                      label="Mode of Travel"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                </Grid> */}

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>Advance Required</Typography>
                    <FormInputRadio
                      name="adv_is_required"
                      control={control}
                      label="Advance Required"
                      options={options}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Encashment of earned leave required</Typography>
                    <FormInputRadio
                      name="encashment_is_required"
                      control={control}
                      label="Encashment Required"
                      options={options}
                    />
                  </Grid>
                </Grid>
                <FormInputNumber
                  name="encashment_days"
                  control={control}
                  label="No. of encashment of leave days "
                  defaultValue={0}
                />
              </div>
              <Box display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <span className="spinner-grow spinner-grow-sm"></span>
                  )}
                  Submit
                </Button>
              </Box>
              {/* <GeneratePDF /> */}
            </form>
          </Grid>
        </Paper>
        <Box minHeight={'2vh'}></Box>
      </Grid>
    </>
  );
}
