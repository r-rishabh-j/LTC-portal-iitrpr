import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export const FormInputNumber = ({ name, control, label, required, disabled }) => {
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
            error={!!error}
            type="number"
            required={required}
            color="primary"
            margin="normal"
            disabled={disabled}
            fullWidth
          />
        </>
      )}
    />
  );
};
