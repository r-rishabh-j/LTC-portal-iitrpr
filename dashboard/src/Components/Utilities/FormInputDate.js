import React from 'react'
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Controller } from "react-hook-form";
import { alpha } from "@material-ui/core/styles";
const DATE_FORMAT = "dd-MMM-yy";


export const FormInputDate = ({name, control, label, required}) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <KeyboardDatePicker
            onChange={onChange}
            value={value}
            label={label}
            required={required}
            inputVariant="outlined"
            color="primary"
            margin="normal"
            fullWidth
          />
        )}
      />
    </MuiPickersUtilsProvider>
  );
}

