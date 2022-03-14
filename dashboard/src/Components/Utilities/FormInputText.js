import { TextField } from "@mui/material"
import {Controller} from "react-hook-form"
import {useState, useEffect} from 'react'


export const FormInputText = ({name, control, label, required, disabled, defaultValue, autofill}) => {

  const [inputName, setInputName] = useState({});
  const [value, setValue] = useState(label);

  useEffect(()=> {
      const inputName = JSON.parse(sessionStorage.getItem('profile'))
      console.log("SessionStorage" + inputName)
      if(inputName){
          setInputName(inputName)
          if(name === "Name"){
            setValue(inputName.name)
          }
          else if(name === "Department"){
            setValue(inputName.department)
          }
          else if(name === "Designation"){
            setValue(inputName.permission)
          }
          
      }
      
  }, [name]);
  return autofill === true ? (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange}, fieldState: { error } }) => (
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
          />
        </>
      )}
    />
  );
}