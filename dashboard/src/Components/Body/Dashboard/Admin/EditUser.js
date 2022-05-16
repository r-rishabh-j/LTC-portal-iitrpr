import React from 'react'
import{ useState } from "react";
import { useForm } from "react-hook-form";
import { FormInputText } from "../../../Utilities/FormInputText";
import axios from "axios";
import {
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import EditUserForm from './EditUserForm';

const EditUser = () => {
    const { handleSubmit, control } = useForm();
    const [email, setEmail] = useState();
    const [view, setView] = useState(false);

    const onSubmit = (data) => {
        console.log(data)
        setEmail(data.email)
        setView(true)
    }
  return (
    <div>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
          {view === false ? <><Typography>Search by email the user you want to edit:</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInputText
            name={"email"}
            control={control}
            label={"Email ID"}
            required={true}
            defaultValue={""}
          />
          <Box display="flex" justifyContent="center">
          <Button type = "submit" variant="contained"
              color="primary"
              style={{ margin: "2vh 0 0 0" }}>Search</Button>
            </Box>
        </form></> : <div>
            <EditUserForm email={email} setView={setView}/>
            </div>}
        
      </DialogContent>
    </div>
  );
}

export default EditUser