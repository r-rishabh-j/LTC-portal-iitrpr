import { TextField } from "@mui/material"
import { Controller } from "react-hook-form"
import React from "react";
import {useState, useEffect } from 'react';


export const FormInputText = (props) => {
  // {profileInfo, name, control, label, required, disabled, defaultValue, multiline, rows, autofill}
  // if (autofill===undefined){
  //   autofill=false;
  // }
  console.log(props.label, props.autofill);
  console.log('profinfo', props.profileInfo);

  const [inputName, setInputName] = useState({});
  const [value, setValue] = useState(props.label);

  useEffect(() => {
    // const inputName = JSON.parse(sessionStorage.getItem('profile'))
    const inputName = props.profileInfo;
    if (inputName) {
      setInputName(inputName)
      if (props.name === "name") {
        setValue(inputName.name)
      }
      else if (props.name === "department") {
        setValue(inputName.department)
      }
      else if (props.name === "designation") {
        setValue(inputName.permission)
      }
      else if (props.name === "emp_code") {
        setValue(inputName.employee_code)
      }

    }
    

  }, [props.name]);
  return props.autofill === true ? (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue={props.defaultValue}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <>
          <TextField
            disabled={props.disabled}
            label={props.label}
            onChange={(text) => onChange(text)}
            value={value}
            error={!!error}
            type="text"
            required={props.required}
            color="primary"
            fullWidth
            margin="normal"
            multiline={props.multiline}
            rows={props.rows}
          />
        </>
      )}
    />
  ) : (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue={props.defaultValue}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <TextField
            disabled={props.disabled}
            label={props.label}
            onChange={onChange}
            value={value}
            error={!!error}
            type="text"
            required={props.required}
            color="primary"
            fullWidth
            margin="normal"
            multiline={props.multiline}
            rows={props.rows}
          />
        </>
      )}
    />
  );
}