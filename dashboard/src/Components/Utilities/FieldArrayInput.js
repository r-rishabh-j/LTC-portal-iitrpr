import React from 'react'
import {Controller} from "react-hook-form"
import TextField from "@mui/material"

export const FieldArrayInput  = ({name, control, fields, append, remove}) => {
  return (
    <ul>
        {fields.map((item, index) => {
            return (
                <li key={item.id}>
                    <Controller
                    as={<TextField label="Name"/>}
                    name={`${name}[${index}].text`}
                    control={control}
                    defaultVlaue={item.text}
                    />
                </li>
            )
        })}
    </ul>
  )
}

