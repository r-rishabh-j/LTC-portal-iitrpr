import React from 'react'
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { useFormContext, Controller } from "react-hook-form";


export const FormInputDropDown = ({name, control, label, options, disabled}) => {
    const generateSelectOptions = () => {
    return options.map((option) => {
      return (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      );
    });
  };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <>
          <InputLabel>{label}</InputLabel>
          <Select
            onChange={onChange}
            value={value}
            fullWidth
            defaultValue=""
            variant="outlined"
            // required={true}
            disabled={disabled}
            style={{margin: "1vh 0 0 0 "}}
          >
            {generateSelectOptions()}
          </Select>
        </>
      )}
    />
  );
}

