import React from "react";
import { Controller } from "react-hook-form";
import { TextField, Grid, Button } from "@mui/material";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

export const ExpensesFieldArray = ({ name, control, fields, append, remove }) => {
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
              <Grid item xs={5}>
                <Controller
                  name={`${name}[${index}].details`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Details"
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
                  name={`${name}[${index}].amount`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Amount Paid"
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
              <Grid item xs={5}>
                <Controller
                  name={`${name}[${index}].receipt_details`}
                  control={control}
                  defaultValue=""
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <>
                      <TextField
                        label="Receipt Details"
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
