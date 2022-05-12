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
import { TAFieldArray } from "../../Utilities/TAFieldArray";
import { ExpensesFieldArray } from "../../Utilities/ExpensesFieldArray";


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
      items: [
        {
          dep_date: "",
          dep_time: "",
          dep_place: "",
          arr_date: "",
          arr_time: "",
          arr_place: "",
          mode: "",
          km: "",
          fare: "",
          ticket: "",
          remarks: "",
        },
      ],
      expenses: [
        {
          details: "",
          amount: "",
          receipt_details: "",
          
        },
      ],
    },
  });
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control,
    name: "items",
  });
  const {
    fields: expenseFields,
    append: appendExpense,
    remove: removeExpense,
  } = useFieldArray({
    control,
    name: "expenses",
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
                    name="band_pay"
                    control={control}
                    label="Pay Level"
                    required={true}
                    defaultValue={""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormInputText
                    name="budget_head"
                    control={control}
                    label="Budget Head"
                    required={true}
                    defaultValue={""}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormInputText
                    name="advance"
                    control={control}
                    label="Advance Drawn(₹)"
                    required={true}
                    defaultValue={""}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormInputDate
                    name="date"
                    control={control}
                    label="Date"
                    required={true}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormInputText
                    name="acc_no"
                    control={control}
                    label="Account No. (SBI/Any other)"
                    required={true}
                    defaultValue={""}
                  />
                </Grid>
              </Grid>

              <TAFieldArray
                name={"items"}
                control={control}
                fields={itemFields}
                remove={removeItem}
                append={appendItem}
              />
              <Typography>
                Indicate period and number of days if any, for which the
                claimant doesn’t want to claim DA (Leave or other reasons, In
                case of foreign Travel):
              </Typography>
              <FormInputText
                name="no_da"
                control={control}
                label="Response"
                required={true}
                defaultValue={""}
              />
              <Typography>
                Any other expenses (Lodging, Boarding, Registration fee, Visa
                fee, Insurance, etc.):
              </Typography>
              <ExpensesFieldArray
                name={"expenses"}
                control={control}
                fields={expenseFields}
                remove={removeExpense}
                append={appendExpense}
              />
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
            </form>
          </Grid>
        </Paper>
        <Box minHeight="2vh"></Box>
      </Grid>
    </>
  );
};

export default TAForm