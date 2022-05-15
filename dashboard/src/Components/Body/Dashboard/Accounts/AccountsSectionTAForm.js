import React from "react";
import { useEffect, useState, forwardRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Box, Button, Typography, Grid } from "@mui/material";
import axios from "axios";

const AccountsSectionTAForm = (acc_data, request_id, setEditState) => {
  const { control, handleSubmit, reset } = useForm();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    reset(acc_data);
  }, [acc_data]);

  function onSubmitData(data) {
    console.log(data);
    setEdit(false);
    setEditState(false);
    const req_data = { request_id: request_id, stage_form: data };
    // axios({
    //   method: "POST",
    //   url: "/api/fill-stage-form",
    //   data: req_data,
    // })
    //   .then((response) => {
    //     console.log("s", response.status);
    //     alert("Data added!");
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       console.log("e", error.response);
    //       console.log(error.response);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //       alert(error.response.data.error);
    //     }
    //   });
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmitData)}
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
        <Grid item xs={4}>
          <Controller
            name="actual_fares_rate"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
      </form>
    </div>
  );
};

export default AccountsSectionTAForm