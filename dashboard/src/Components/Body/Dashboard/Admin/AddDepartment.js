import React, { useEffect } from "react";
import {
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  Box,
} from "@material-ui/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInputText } from "../../../Utilities/FormInputText";
import { FormInputDropDown } from "../../../Utilities/FormInputDropDown";
import axios from "axios";

const AddDepartment = () => {
  const { handleSubmit, control } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append('dept_info', JSON.stringify(data));
    axios({
      method: "POST",
      url: "/api/admin/add-department",
      data: formData,
    })
      .then((response) => {
        alert('Department added!');
        window.location.reload();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          alert(error.response.data.error);
        }
      });
  };

 
  return (
    <Box>
      <DialogTitle>Add New Department</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <FormInputText
              name={"key"}
              control={control}
              label={"Database key(must be unique)"}
              required={true}
              defaultValue={""}
            />
          </Grid>
          <Grid item xs={12}>
            <FormInputText
              name={"full_name"}
              control={control}
              label={"Full Name"}
              required={true}
              defaultValue={""}
            />
          </Grid>
          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: "2vh 0 0 0" }}
            >
              Create
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Box>
  );
};

export default AddDepartment;
