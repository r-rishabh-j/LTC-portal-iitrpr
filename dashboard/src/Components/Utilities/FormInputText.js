import { TextField } from "@mui/material"
import { Controller } from "react-hook-form"
import {React, useState, useEffect } from 'react'


export const FormInputText = ({profileInfo, name, control, label, required, disabled, defaultValue, autofill, multiline, rows}) => {

  const [inputName, setInputName] = useState({});
  const [value, setValue] = useState(label);

  useEffect(() => {
    // const inputName = JSON.parse(sessionStorage.getItem('profile'))
    const inputName = profileInfo;
    if (inputName) {
      setInputName(inputName)
      if (name === "name") {
        setValue(inputName.name)
      }
      else if (name === "department") {
        setValue(inputName.department)
      }
      else if (name === "designation") {
        setValue(inputName.permission)
      }
      else if (name === "emp_code") {
        setValue(inputName.employee_code)
      }

    }
    

  }, [name]);
  return autofill === true ? (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <>
          <TextField
            disabled={disabled}
            label={label}
            onChange={(text) => onChange(text)}
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
  ) : (
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