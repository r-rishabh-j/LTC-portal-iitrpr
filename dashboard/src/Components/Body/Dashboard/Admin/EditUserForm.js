import React from 'react'
import { useEffect, useState} from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Box, Button, Typography, Grid } from "@mui/material";
import axios from "axios"

const EditUserForm = ({email, setView}) => {

    const [userInfo, setUserInfo] = useState({})
    const { control, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        console.log(data)
        
        const req_data = { old_user_creds: { email: email }, new_user_creds: data};
        axios({
          method: "post",
          url: "api/admin/edit-user",
          data: JSON.stringify(req_data),
          headers: { "Content-type": "application/json" },
        })
          .then((response) => {
            alert("User successfully edited!")
            
            window.location.reload()
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              alert(error.response.data.error);
            }
          });

    }

    console.log("edit form", email)
      useEffect(() => {
        const data = { 'user_creds': {'email': email} };
        axios({
          method: "post",
          url: "api/admin/fetch-user",
          data: JSON.stringify(data),
          headers: { "Content-type": "application/json" },
        })
          .then((response) => {
            //setView(true)
            console.log(response.data.user);
            setUserInfo(response.data.user);
            reset(response.data.user);
            
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response);
              console.log(error.response.status);
              alert("User not found");
              setView(false)
            }
          });
      }, []);
      
  return (
    <div>
      <Typography>Edit New Details:</Typography>
      <form onSubmit = {handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextField
              label="Name"
              onChange={onChange}
              value={value}
              error={!!error}
              type="text"
              required={true}
              color="primary"
              fullWidth
              margin="normal"
              variant="outlined"
              //rows={rows}
            />
          </>
        )}
      />
      <Controller
        name="email"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextField
              label="Email"
              onChange={onChange}
              value={value}
              error={!!error}
              type="text"
              required={true}
              color="primary"
              fullWidth
              margin="normal"
              variant="outlined"
              //rows={rows}
            />
          </>
        )}
      />
      <Controller
        name="emp_code"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextField
              label="Employee Code"
              onChange={onChange}
              value={value}
              error={!!error}
              type="text"
              //required={true}
              color="primary"
              fullWidth
              margin="normal"
              variant="outlined"
              //rows={rows}
            />
          </>
        )}
      />
      <Controller
        name="department"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextField
              label="Department"
              onChange={onChange}
              value={value}
              error={!!error}
              type="text"
              required={true}
              color="primary"
              fullWidth
              margin="normal"
              variant="outlined"
              //rows={rows}
              disabled={true}
            />
          </>
        )}
      />
      <Controller
        name="designation"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextField
              label="Designation"
              onChange={onChange}
              value={value}
              error={!!error}
              type="text"
              required={true}
              color="primary"
              fullWidth
              margin="normal"
              variant="outlined"
              //rows={rows}
              
            />
          </>
        )}
      />
      <Box display="flex" justifyContent = "center">
      <Button type="submit" variant="contained" color="primary">Save</Button>
      </Box>
      </form>
    </div>
  );
}

export default EditUserForm