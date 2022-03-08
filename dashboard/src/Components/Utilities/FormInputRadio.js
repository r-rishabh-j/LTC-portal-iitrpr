import React from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { Controller, useFormContext } from "react-hook-form";


const options = [
  {
    index: 1,
    label: "Yes",
    value: "Yes",
  },
  {
    index: 2,
    label: "No",
    value: "No",
  },
];

export const FormInputRadio = ({
  name,
  control,
  label,
}) => {
  const generateRadioOptions = () => {
    return options.map((singleOption) => (
      <FormControlLabel
        key={singleOption.index}
        value={singleOption.value}
        label={singleOption.label}
        control={<Radio />}
      />
    ));
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue="No"
      render={({ field: { onChange, value } }) => (
        <RadioGroup value={value} onChange={onChange}>
          {generateRadioOptions()}
        </RadioGroup>
      )}
    />
  );
};
