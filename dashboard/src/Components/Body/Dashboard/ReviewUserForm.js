import React from 'react'
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Box, Button, Typography, Grid } from "@mui/material";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import axios from "axios";


const ReviewUserForm = ({user_data, request_id}) => {
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    reset(user_data);
  }, [user_data]);

  const onSubmitForm = (data) => {
    console.log("saving", data);
  }

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
                    //multiline={multiline}
                    //rows={rows}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>
    </div>
  );
}

export default ReviewUserForm