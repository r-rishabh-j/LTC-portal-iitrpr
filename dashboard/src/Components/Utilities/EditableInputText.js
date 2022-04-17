import React, { useEffect } from 'react'


function EditableInputText({name, control, label, required, disabled, defaultValue, autofill, multiline, rows, reset}) {
  
  useEffect(() => {
    reset({name: "name"})
  })
  return (
    <Controller
      name={name}
      control={control}
      
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

export default EditableInputText