import React from 'react'
import { Grid, Paper, Button, Typography, Box, Fab } from "@material-ui/core";
import { useForm, useFieldArray} from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { useStyles } from "./FormStyles";
import { FormInputText } from "../../Utilities/FormInputText";
import { FormInputDate } from "../../Utilities/FormInputDate";
import { FormInputNumber } from "../../Utilities/FormInputNumber";
import { FormInputRadio } from "../../Utilities/FormInputRadio";
import { FieldArrayInput } from "../../Utilities/FieldArrayInput";


const TAForm = ({ profileInfo }) => {
    console.log("TA", profileInfo)
  const classes = useStyles();
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      dependents: [
        {
          dep_name: "",
          dep_age: "",
          dep_relationship: "",
          dep_travelling_from: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dependents",
  });
  const [File, setFile] = useState(null);

  const onSubmit = (data) => {
    console.log(data);
  };

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
  return (
    <>
      <Grid container>
        <Paper elevation={10} className={classes.contain}>
          <Grid container>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
              <Box display="flex" justifyContent="center">
                <Typography variant="h5" style={{ fontWeight: "bold" }}>
                  Travelling Allowance Reimbursement/Settlement Form
                </Typography>
              </Box>
              <Grid container spacing={2}>
              <Grid item xs={6}>
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
              <Grid item xs={6}>
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
                <Grid item xs={6}>
                  <FormInputText
                    profileInfo={profileInfo}
                    name="band_pay"
                    control={control}
                    label="Pay Level"
                    required={true}
                    defaultValue={""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormInputText
                    profileInfo={profileInfo}
                    name="budget_head"
                    control={control}
                    label="Budget Head"
                    required={true}
                    defaultValue={""}
                  />
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
};

export default TAForm