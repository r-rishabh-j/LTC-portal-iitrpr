import React from "react";
import { useEffect, useState} from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Box, Button, Typography, Grid } from "@mui/material";
import axios from "axios";

const AccountsSectionTAForm = ({acc_data, request_id, setEditState}) => {
  const { control, handleSubmit, reset } = useForm();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    reset(acc_data);
  }, [acc_data]);

  function onSubmitAccTAData(data) {
    console.log(data);
    setEdit(false);
    setEditState(false);
    const req_data = { request_id: request_id, stage_form: data };
    axios({
      method: "POST",
      url: "/api/ta/fill-stage-form",
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
        onSubmit={handleSubmit(onSubmitAccTAData)}
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
            onClick={() => {
              setEdit(true);
              setEditState(true);
            }}
          >
            Edit
          </Button>
          &nbsp;
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Box>
        <Typography>A-1: Actual fares(A/T/R(etc.))</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="actual_fares_rate"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Rate"
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
              name="actual_fares_amount"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Amount(₹)"
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
        <Typography>A-2: Road Mileage</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="mileage_rate"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Rate"
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
              name="mileage_amount"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Amount(₹)"
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
        <Typography>A-3: D.A</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="da_rate"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Rate"
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
              name="da_amount"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Amount(₹)"
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
        <Typography>A-4: Food expenses and hotel charges</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="food_rate"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Rate"
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
              name="food_amount"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Amount(₹)"
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
        <Typography>B: Other Expenses</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Controller
              name="other_rate"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Rate"
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
              name="other_amount"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Amount(₹)"
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
        <Typography>C: Total Amount</Typography>

        {/* <Grid item xs={4}>
            <Controller
              name="total_rate"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Rate"
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
          </Grid> */}
        <Grid item xs={8}>
          <Controller
            name="total_amount"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  disabled={!edit}
                  label="Amount(₹)"
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
        <Typography>D: Advance if any to be deducted</Typography>
        <Grid item xs={8}>
          <Controller
            name="advance_deducted"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  disabled={!edit}
                  label="Amount(₹)"
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
        <Typography>E: Net amount to be reimbursed (C-D)</Typography>
        <Grid item xs={8}>
          <Controller
            name="net_amount"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  disabled={!edit}
                  label="Amount(₹)"
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
        <Typography>
          E-1: To be reimbursed to the travel agent (if any)
        </Typography>
        <Grid item xs={8}>
          <Controller
            name="agent_amount"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  disabled={!edit}
                  label="Amount(₹)"
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
        <Typography>E-2: To the claimant</Typography>
        <Grid item xs={8}>
          <Controller
            name="claimant_amount"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <TextField
                  disabled={!edit}
                  label="Amount(₹)"
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
        <Typography>Passed for payment of:</Typography>
        <Controller
          name="passed_amount"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                disabled={!edit}
                label="Amount(₹)"
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
        <Typography>Debitable to:</Typography>
        <Controller
          name="debit_to"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                disabled={!edit}
                label="Name"
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
        <Controller
          name="budget_head"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                disabled={!edit}
                label="Budget Head"
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
        <Controller
          name="project"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                disabled={!edit}
                label="Project/ Institute/ Any other"
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
      </form>
    </div>
  );
};

export default AccountsSectionTAForm