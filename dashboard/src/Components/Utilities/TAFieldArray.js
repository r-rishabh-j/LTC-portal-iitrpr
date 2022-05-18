import React from "react";
import { Controller } from "react-hook-form";
import { TextField, Grid, Button } from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { FormInputDate } from "./FormInputDate";

export const TAFieldArray = ({ name, control, fields, append, remove }) => {
  return (
    <ul style={{ listStyle: "none" }}>
      {fields.map((item, index) => {
        return (
          <li key={item.id}>
            <Grid
              container
              spacing={1}
              style={{
                backgroundColor: "#f7f7f7",
                margin: "1vh 0 0 0",
                padding: "0 1vh 0 1vh",
                borderRadius: "1vh",
              }}
            >
              <Grid item xs={2}>
                {/* <Controller
                  name={`${name}[${index}].dep_date`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Departure Date"
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
                /> */}
                <FormInputDate
                  name={`${name}[${index}].dep_date`}
                  control={control}
                  label="Departure Date"
                  //required={true}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  name={`${name}[${index}].dep_time`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Departure Time"
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
                  name={`${name}[${index}].dep_place`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Departure Place"
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
                {/* <Controller
                  name={`${name}[${index}].arr_date`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Arrival Date"
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
                /> */}
                <FormInputDate
                  name={`${name}[${index}].arr_date`}
                  control={control}
                  label="Arrival Date"
                  //required={true}
                />
              </Grid>
              <Grid item xs={2}>
                <Controller
                  name={`${name}[${index}].arr_time`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Arrival Time"
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
                  name={`${name}[${index}].arr_place`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Arrival Place"
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
                  name={`${name}[${index}].mode`}
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
              <Grid item xs={2}>
                <Controller
                  name={`${name}[${index}].km`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Km for road/air/steamer"
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
                  name={`${name}[${index}].fare`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Fare"
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
                  name={`${name}[${index}].ticket`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="PNR No. and/or Ticket No."
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
              <Grid item xs={4}>
                <Controller
                  name={`${name}[${index}].remarks`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Remarks"
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
                <Button type="button" onClick={() => append(`${name}`)}>
                  <AddIcon />
                </Button>
              </>
            ) : (
              <>
                <Button type="button" onClick={() => append(`${name}`)}>
                  <AddIcon />
                </Button>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
};
