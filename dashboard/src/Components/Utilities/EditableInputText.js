import React from 'react'
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { useState, useEffect } from "react";


export const EditableInputText = ({name, control, label, required, disabled, defaultValue, info, multiline, rows, reset}) =>{
  
  useEffect(() => {
    console.log(`${info}`)
    reset({ [name]: `${info}` });
  }, [info])
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextField
            disabled={disabled}
            label={label}
            onChange={onChange}
            value={value}
            error={!!error}
            type="text"
            required={required}
            color="primary"
            fullWidth
            margin="normal"
            multiline={multiline}
            rows={rows}
          />
        </>
      )}
    />
  );
}
