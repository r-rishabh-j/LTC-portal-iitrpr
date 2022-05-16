import React from 'react'
import { useEffect, useState} from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import axios from "axios";
import { TextField, Box, Button, Typography, Grid } from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

//display and edit prefilled data for accounts section

const AccountsSectionForm = ({ acc_data, request_id, setEditState }) => {
  const { control, handleSubmit, reset } = useForm({defaultValues:{
    entities: [{from: "", to: "", mode_of_travel: "", num_fares: "", single_fare: "", amount: ""}]}});
   const { fields, append, remove } = useFieldArray({
     control,
     name: "entities",
   });
   console.log("fields", fields)
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    reset(acc_data);
  }, [acc_data]);

  function onSubmitAccData(data) {
    console.log(data);
    setEdit(false);
    setEditState(false);
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
        onSubmit={handleSubmit(onSubmitAccData)}
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
        <ul style={{ listStyle: "none" }}>
          {fields.map((item, index) => {
            return (
              <li key={item.id}>
                <Grid container spacing={1}>
                  <Grid item xs={2}>
                    <Controller
                      name={`entities[${index}].from`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="From"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                            disabled={!edit}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name={`entities[${index}].to`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="To"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                            disabled={!edit}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name={`entities[${index}].mode_of_travel`}
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
                            disabled={!edit}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name={`entities[${index}].num_fares`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="No. of Fares"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                            disabled={!edit}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name={`entities[${index}].single_fare`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="Single Fare"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                            disabled={!edit}
                          />
                        </>
                      )}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Controller
                      name={`entities[${index}].amount`}
                      control={control}
                      defaultValue=""
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextField
                            label="Amount"
                            onChange={onChange}
                            value={value}
                            error={!!error}
                            type="text"
                            color="primary"
                            fullWidth
                            margin="normal"
                            disabled={!edit}
                          />
                        </>
                      )}
                    />
                  </Grid>
                </Grid>
                {fields.length >= 2 ? (
                  <>
                    <Button
                      type="button"
                      disabled={!edit}
                      onClick={() => remove(index)}
                    >
                      <RemoveIcon />
                    </Button>
                    <Button
                      type="button"
                      disabled={!edit}
                      onClick={() => append("dependents")}
                    >
                      <AddIcon />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      disabled={!edit}
                      onClick={() => append("dependents")}
                    >
                      <AddIcon />
                    </Button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
        <Grid container spacing={2}>
          <Grid item xs={9} />
          <Grid item xs={1}>
            <Typography
              style={{
                fontWeight: "bold",
                textAlign: "right",
                verticalAlign: "text-bottom",
              }}
            >
              Total
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Controller
              name="total"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Total"
                    onChange={onChange}
                    value={value}
                    error={!!error}
                    type="text"
                    //required={required}
                    color="primary"
                    fullWidth
                    // margin="normal"
                    //multiline={multiline}
                    //rows={rows}
                  />
                </>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography>Advance admissible (90% of above):</Typography>
            <Controller
              name="adv_admissible"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Advance Admissible(₹)"
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
            <Typography>Passed for:</Typography>
            <Controller
              name="passed"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="Passed(₹)"
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
            <Typography> In Words:</Typography>
            <Controller
              name="in_words"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <>
                  <TextField
                    disabled={!edit}
                    label="In Words(₹)"
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
            <Typography>Debitable to LTC advance Dr./Mr./Mrs./Ms.:</Typography>
            <Controller
              name="debit_to"
              control={control}
              defaultValue=""
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
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
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AccountsSectionForm