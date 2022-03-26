import React from "react";
import {
  Grid,
  Paper,
  Button,
  Typography,
  Box,
  Fab
} from "@material-ui/core";
import { useForm, Controller} from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { useStyles } from "./FormStyles";
import GeneratePDF from "../../Utilities/GeneratePDF";
import { FormInputText } from "../../Utilities/FormInputText";
import { FormInputDate } from "../../Utilities/FormInputDate"
import { FormInputNumber } from "../../Utilities/FormInputNumber"
import { FormInputRadio } from "../../Utilities/FormInputRadio";
import Add from "@material-ui/icons/Add";
import useAuthCookie from "../../Login/useAuthCookie"



export default function CreateApplication(props) {
  const classes = useStyles();
  const { handleSubmit, control } = useForm({});
  const [File, setFile] = useState(null)
  // const [isLoggedIn, profileInfo] = useAuthCookie();
  const profileInfo = JSON.parse(sessionStorage.getItem('profile'));
  const name = profileInfo.name;
  const department  = profileInfo.department;
 

  
  const onSubmit = (data) => {
    
    const formData = new FormData();

    const profile = JSON.parse(sessionStorage.getItem('profile'));
    data.name = profile.name;
    //data.designation = profile.permission;
    data.department = profile.department;
    data.emp_code = profile.employee_code;
    

    console.log('data: ', JSON.stringify(data));
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
        if(response.status === 200){
          alert("Application submitted!")
          window.location.reload()
        }
        else{
          alert("Error submitting, try again")
        }
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
                      name={"designation"}
                      control={control}
                      label={"Designation"}
                      required={true}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormInputText
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
                  name="band_pay"
                  control={control}
                  label="Band Pay + AGP/GP"
                  required={true}
                  defaultValue={""}
                />
                <Typography style={{ fontWeight: "bold" }}>
                  Leave Required
                </Typography>

                <FormInputText
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
                  name="home_town"
                  control={control}
                  label="Home Town as recorded in the Service Book"
                  required={true}
                  defaultValue={""}
                />
                <FormInputText
                  name="ltc_nature"
                  control={control}
                  label="Nature of LTC to be availed, Home Town /
Anywhere in India with Block Year"
                  required={true}
                  defaultValue={""}
                />
                <FormInputText
                  name="place"
                  control={control}
                  label="If, anywhere in India, the place to be visited"
                  required={true}
                  defaultValue={""}
                />
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <FormInputText
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
                      name="name_1"
                      control={control}
                      label="Name"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="age_1"
                      control={control}
                      label="Age"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="relationship_1"
                      control={control}
                      label="Relationship"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="travelling_from_1"
                      control={control}
                      label="Travelling(Place) From"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="travelling_to_1"
                      control={control}
                      label="Travelling(Place) To"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="back_1"
                      control={control}
                      label="Back(Yes/No)"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="travel_mode_1"
                      control={control}
                      label="Mode of Travel"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <FormInputText
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
                      name="name_2"
                      control={control}
                      label="Name"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="age_2"
                      control={control}
                      label="Age"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="relationship_2"
                      control={control}
                      label="Relationship"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="travelling_from_2"
                      control={control}
                      label="Travelling(Place) From"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="travelling_to_2"
                      control={control}
                      label="Travelling(Place) To"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="back_2"
                      control={control}
                      label="Back(Yes/No)"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="travel_mode_2"
                      control={control}
                      label="Mode of Travel"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>

                  <Grid item xs={1}>
                    <FormInputText
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
                      name="name_3"
                      control={control}
                      label="Name"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="age_3"
                      control={control}
                      label="Age"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="relationship_3"
                      control={control}
                      label="Relationship"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="travelling_from_3"
                      control={control}
                      label="Travelling(Place) From"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <FormInputText
                      name="travelling_to_3"
                      control={control}
                      label="Travelling(Place) To"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="back_3"
                      control={control}
                      label="Back(Yes/No)"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <FormInputText
                      name="travel_mode_3"
                      control={control}
                      label="Mode of Travel"
                      required={false}
                      defaultValue={""}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>Advance Required</Typography>
                    <FormInputRadio
                      name="adv_is_required"
                      control={control}
                      label="Advance Required"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Encashment of earned leave required</Typography>
                    <FormInputRadio
                      name="encashment_is_required"
                      control={control}
                      label="Encashment Required"
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
