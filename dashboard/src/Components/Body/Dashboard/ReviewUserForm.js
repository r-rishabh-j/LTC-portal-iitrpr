import React from 'react'
import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { TextField, Box, Button, Typography, Grid, FormControlLabel, Radio, RadioGroup, Fab } from "@mui/material";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import axios from "axios";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";

const ReviewUserForm = ({user_data, request_id}) => {
  const { control, handleSubmit, reset} = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dependents",
  });

  useEffect(() => {
    reset(user_data);
  }, [user_data]);

  const [File, setFile] = useState(null);

  const onSubmitForm = (data) => {
    // console.log("Submitting", isSubmitting);
    const formData = new FormData();

    // data.name = profileInfo.name;
    //data.designation = profile.permission;
    // data.department = profileInfo.department;
    // data.emp_code = profileInfo.employee_code;

    console.log('data: ', JSON.stringify(data));
    // formData.append('attachments', data.attachments[0]);
    formData.append('request_id', request_id);
    formData.append('form', JSON.stringify(data));

    console.log("onSubmit")
    console.log(data);
    return axios({
      method: "POST",
      url: "/api/resolve-review",
      data: formData
    })
      .then((response) => {
        alert("Application submitted!")
        window.location.reload()
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

  const generateRadioOptions = () => {
    return options.map((singleOption) => (
      <FormControlLabel
        key={singleOption.index}
        value={singleOption.value}
        label={singleOption.label}
        control={<Radio />}
      />
    ));
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmitForm)}
        style={{
          width: "100%",
          "& .MultiFormControlRoot": {
            width: "100%",
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
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
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    color="primary"
                    fullWidth
                    margin="normal"
                    disabled="true"
                    //multiline={multiline}
                    //rows={rows}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Controller
              name="designation"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    label="Designation"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    color="primary"
                    fullWidth
                    margin="normal"
                    //multiline={multiline}
                    //rows={rows}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="department"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    label="Department"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    color="primary"
                    fullWidth
                    margin="normal"
                    disabled="true"
                    //multiline={multiline}
                    //rows={rows}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="emp_code"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    label="Employee Code"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    color="primary"
                    fullWidth
                    margin="normal"
                    disabled="true"
                    //multiline={multiline}
                    //rows={rows}
                  />
                </>
              )}
            />
          </Grid>
          <Grid item xs={8}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="joining_date"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Date of entering the Central Government
Service/Date of Joining with IIT Ropar"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="band_pay"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    label="Pay Level"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    color="primary"
                    fullWidth
                    margin="normal"
                    //multiline={multiline}
                    //rows={rows}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
        <Typography>Leave Required</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="nature"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    label="Nature"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    color="primary"
                    fullWidth
                    margin="normal"
                    //multiline={multiline}
                    //rows={rows}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="nature_from"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="From"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={4}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="nature_to"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="To"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="num_days"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    label="No. of Days"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="number"
                    color="primary"
                    fullWidth
                    margin="normal"
                    //multiline={multiline}
                    //rows={rows}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
        <Typography>Prefix:</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="prefix_from"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="From"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="prefix_to"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="To"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Typography>Suffix:</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="suffix_from"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="From"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="suffix_to"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="To"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>

        <Typography>
          Whether spouse is employed, if yes whether entitled to LTC
        </Typography>
        <Controller
          name="spouse_is_employed"
          control={control}
          defaultValue={options[1].value}
          render={({ field: { onChange, value } }) => (
            <RadioGroup value={value} onChange={onChange}>
              {generateRadioOptions()}
            </RadioGroup>
          )}
        />
        <Typography>Proposed dates of Journey</Typography>
        <Typography>Self:</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="self_date_outward"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Date of Outward journey"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="self_date_inward"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Date of Inward journey"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Typography>Family:</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="family_date_outward"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Date of Outward journey"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="family_date_inward"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Date of Inward journey"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Controller
          name="home_town"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                label="Home Town as recorded in the Service Book"
                onChange={onChange}
                value={value}
                error={!!error}
                type="text"
                color="primary"
                fullWidth
                margin="normal"
                //multiline={multiline}
                //rows={rows}
              />
            </>
          )}
        />
        <Controller
          name="ltc_nature"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                label="Nature of LTC to be availed, Home Town /
Anywhere in India with Block Year"
                onChange={onChange}
                value={value}
                error={!!error}
                type="text"
                color="primary"
                fullWidth
                margin="normal"
                //multiline={multiline}
                //rows={rows}
              />
            </>
          )}
        />
        <Controller
          name="place"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                label="If, anywhere in India, the place to be visited"
                onChange={onChange}
                value={value}
                error={!!error}
                type="text"
                color="primary"
                fullWidth
                margin="normal"
                //multiline={multiline}
                //rows={rows}
              />
            </>
          )}
        />
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <Controller
              name="est_fare"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    label="Estimated fare of entitled class from the
headquarter to Home Town/Place of visit by
shortest route"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    color="primary"
                    fullWidth
                    margin="normal"
                    //multiline={multiline}
                    //rows={rows}
                  />
                </>
              )}
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
          
        <Typography>
          Person(s) in respect of whom LTC is proposed to be availed:
        </Typography>
        <ul style={{ listStyle: "none" }}>
          {fields.map((item, index) => {
            return (
              <li key={item.id}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <Controller
                      name={`dependents[${index}].dep_name`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="Name"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Controller
                      name={`dependents[${index}].dep_age`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="Age"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name={`dependents[${index}].dep_relationship`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="Relationship"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name={`dependents[${index}].dep_travelling_from`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="Travelling(Place) From"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name={`dependents[${index}].dep_travelling_to`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="Travelling(Place) To"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <Controller
                      name={`dependents[${index}].dep_back`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="Back(Yes/No)"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name={`dependents[${index}].dep_mode_of_travel`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="Mode of Travel"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                          />
                        </>
                      )}
                    />
                  </Grid>
                </Grid>
                {fields.length >= 2 ? (
                  <>
                    <Button type="button" onClick={() => remove(index)}>
                      <RemoveIcon />
                    </Button>
                    <Button type="button" onClick={() => append("dependents")}>
                      <AddIcon />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="button" onClick={() => append("dependents")}>
                      <AddIcon />
                    </Button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Advance Required</Typography>
            <Controller
              name="adv_is_required"
              control={control}
              defaultValue={options[1].value}
              render={({ field: { onChange, value } }) => (
                <RadioGroup value={value} onChange={onChange}>
                  {generateRadioOptions()}
                </RadioGroup>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Encashment Required</Typography>
            <Controller
              name="encashment_is_required"
              control={control}
              defaultValue={options[1].value}
              render={({ field: { onChange, value } }) => (
                <RadioGroup value={value} onChange={onChange}>
                  {generateRadioOptions()}
                </RadioGroup>
              )}
            />
          </Grid>
        </Grid>
        <Controller
          name="encashment_days"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                label="No. of encashment of leave days"
                onChange={onChange}
                value={value}
                error={!!error}
                type="number"
                color="primary"
                fullWidth
                margin="normal"
                //multiline={multiline}
                //rows={rows}
              />
            </>
          )}
        />
        <Box display="flex" justifyContent="center">
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        </Box>
      </form>
    </div>
  );
}

export default ReviewUserForm