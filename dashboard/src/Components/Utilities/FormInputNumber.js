import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import React from "react";
import InputAdornment from '@material-ui/core/InputAdornment';


export const FormInputNumber = ({ name, control, label, required, disabled, adornment }) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextField
            label={label}
            value={value}
            onChange={onChange}
            error={value < 0}
            helperText={value < 0 ? "Only non negative integers allowed" : ""}
            type="number"
            onWheel={() => document.activeElement.blur()}
            required={required}
            color="primary"
            margin="normal"
            disabled={disabled}
            InputProps={(adornment===true)?{startAdornment: <InputAdornment position="start">₹</InputAdornment>,}:{}}
            fullWidth
          />
        </>
      )}
    />
  );
};
