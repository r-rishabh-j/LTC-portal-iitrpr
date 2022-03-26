import React from 'react'
import DateFnsUtils from "@date-io/date-fns";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

import { Controller } from "react-hook-form";



export const FormInputDate = ({name, control, label, required, disabled}) => {
  let today = new Date().toISOString().slice(0, 10)
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        name={name}
        control={control}
        defaultValue={today}
        render={({ field: { onChange, value } }) => (
          <KeyboardDatePicker
            format="dd-MM-yyyy"
            onChange={onChange}
            value={value}
            label={label}
            required={required}
            inputVariant="outlined"
            color="primary"
            margin="normal"
            fullWidth
            disabled={disabled}
          />
        )}
      />
    </MuiPickersUtilsProvider>
  );
}

