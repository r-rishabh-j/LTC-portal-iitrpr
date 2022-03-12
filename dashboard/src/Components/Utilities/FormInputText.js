import { TextField } from "@mui/material"
import {Controller} from "react-hook-form"

export const FormInputText = ({name, control, label, required, disabled, defaultValue}) => {
    return(
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            render={({
                field: { onChange, value },
                fieldState: { error },
                }) => (
                <>
                <TextField
                    disabled={disabled}
                    label={label}
                    value={value}
                    onChange={onChange}
                    error={!!error}
                    type="text"
                    required = {required}
                    color = "primary"
                    fullWidth
                    margin="normal"
                />
                </>
            )}
        />
    )
}