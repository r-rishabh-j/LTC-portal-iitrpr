import React from 'react'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Box, Button,Typography, Grid } from "@mui/material";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import axios from "axios";


const EstablishmentSectionForm = ({est_data, request_id}) => {
  const {control, handleSubmit, reset} = useForm()
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    reset(est_data)
  }, [est_data])

  const onSubmitEstData = (data) => {
    console.log(data)
    setEdit(false);
    const req_data = { request_id: request_id, stage_form: data };
    axios({
      method: "POST",
      url: "/api/fill-stage-form",
      data: req_data,
    })
      .then((response) => {
        console.log("s", response.status);
        alert("Data added!");
      })
      .catch((error) => {
        if (error.response) {
          console.log("e", error.response);
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          alert(error.response.data.error);
        }
      });
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmitEstData)}
        style={{
          width: "100%",
          "& .MultiFormControlRoot": {
            width: "100%",
          },
        }}
      >
        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() => setEdit(true)}
          >
            Edit
          </Button>
          &nbsp;
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Box>

        <Typography>
          Fresh Recruit i.e. joining Govt. Service after 01.09.2008 /otherwise,
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="est_data_joining_date"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Date of joining"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                    disabled={!edit}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={4}>
            <Controller
              name="est_data_block_year"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Block Year"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
        <Typography>
          Nature of LTC (Home Town/Anywhere in India-place visited/to be visited
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="est_data_nature_last"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Last Availed"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
          <Grid item xs={4}>
            <Controller
              name="est_data_nature_current"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Current LTC"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
        <Typography>Period </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="est_data_period_last_from"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Last Availed From"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                    disabled={!edit}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="est_data_period_last_to"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Last Availed To"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                    disabled={!edit}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="est_data_period_current_from"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Current LTC From"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                    disabled={!edit}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="est_data_period_current_to"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Current LTC To"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                    disabled={!edit}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Typography>LTC for Self/Family</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="est_data_last_ltc_for"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Last Availed"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
          <Grid item xs={4}>
            <Controller
              name="est_data_current_ltc_for"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Current LTC"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
        <Typography>Earned leave encashment (No. of Days)</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="est_data_last_ltc_days"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Last Availed"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
          <Grid item xs={4}>
            <Controller
              name="est_data_current_ltc_days"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Current LTC"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
        <Typography>Earned Leave standing to his credit on</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="est_data_last_earned_leave_on"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Last Availed"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                    disabled={!edit}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
          <Grid item xs={4}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Controller
                name="est_data_current_earned_leave_on"
                control={control}
                defaultValue={null}
                render={({ field: { onChange, value } }) => (
                  <KeyboardDatePicker
                    format="dd-MM-yyyy"
                    onChange={onChange}
                    value={value}
                    label="Current LTC"
                    inputVariant="outlined"
                    color="primary"
                    margin="normal"
                    fullWidth
                    disabled={!edit}
                  />
                )}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Typography>Balance Earned leave after this encashment</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="est_data_last_balance"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Last Availed"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
          <Grid item xs={4}>
            <Controller
              name="est_data_current_balance"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Current LTC"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
        <Typography>Earned Leave encashment admissible</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="est_data_last_encashment_adm"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Last Availed"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
          <Grid item xs={4}>
            <Controller
              name="est_data_current_encashment_adm"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Current LTC"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
        <Typography>
          Period and nature of leave applied for and need to be sanctioned
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="est_data_last_nature"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Last Availed"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
          <Grid item xs={4}>
            <Controller
              name="est_data_current_nature"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Current LTC"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
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
      </form>
    </div>
  );
}

export default EstablishmentSectionForm