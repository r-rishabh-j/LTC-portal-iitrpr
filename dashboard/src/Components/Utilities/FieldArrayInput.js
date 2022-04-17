import React from 'react'
import {Controller} from "react-hook-form"
import {TextField, Grid, Button} from "@mui/material"
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

export const FieldArrayInput  = ({name, control, fields, append, remove}) => {
  return (
    
      <ul style={{ listStyle: "none" }}>
        {fields.map((item, index) => {
          return (
            <li key={item.id}>
              <Grid container spacing={1}>
                
                <Grid item xs={2}>
                  <Controller
                    name={`${name}[${index}].dep_name`}
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
                    name={`${name}[${index}].dep_age`}
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
                    name={`${name}[${index}].dep_relationship`}
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
                    name={`${name}[${index}].dep_travelling_from`}
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
                    name={`${name}[${index}].dep_travelling_to`}
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
                    name={`${name}[${index}].dep_back`}
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
                    name={`${name}[${index}].dep_mode_of_travel`}
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
              {fields.length >= 2?(<><Button type="button" onClick={() => remove(index)}>
                <RemoveIcon/>
              </Button>
              <Button type="button" onClick={() => append(`${name}`)}>
                <AddIcon/>
              </Button></>): (<><Button type="button" onClick={() => append(`${name}`)}>
                <AddIcon/>
              </Button></>)}
              
            </li>
          );
        })}
      </ul>
    
  );
}

