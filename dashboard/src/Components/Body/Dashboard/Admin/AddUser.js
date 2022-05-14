import React from 'react'
import {
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import {useState} from 'react'
import { useForm} from "react-hook-form";
import { FormInputText } from '../../../Utilities/FormInputText';
import { FormInputDropDown } from "../../../Utilities/FormInputDropDown";

const AddUser = () => {
    const { handleSubmit, control} = useForm()
    const onSubmit = (data) => {
        console.log(data)
    }
    const [dept, setDept] = useState("Select")

    //fetch from API
    const departments = [
      {
        label: "Select",
        value: "Select",
      },
      {
        label: "Computer Science and Engineering",
        value: "CSE",
      },
      {
        label: "Electrical Engineering",
        value: "EE",
      },
    ];

  return (
    <div>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid item xs={12}>
            <FormInputText
              name={"name"}
              control={control}
              label={"Name"}
              required={true}
              defaultValue={""}
            />
          </Grid>
          <Grid item xs={12}>
            <FormInputText
              name={"email"}
              control={control}
              label={"Email ID"}
              required={true}
              defaultValue={""}
            />
          </Grid>
          <Grid item xs={12}>
            <FormInputText
              name={"emp_code"}
              control={control}
              label={"Employee Code"}
              required={true}
              defaultValue={""}
            />
          </Grid>
          <Grid item xs={12} style={{ margin: "1vh 0 0 0" }}>
            <FormInputDropDown
              name={"department"}
              control={control}
              label="Department"
              options={departments}
              disabled={false}
              setDept = {setDept}
            />
          </Grid>
          <Grid item xs={12} style={{ margin: "1vh 0 0 0" }}>
            <FormInputDropDown
              name={"designation"}
              control={control}
              label="User Role/Designation"
              options={departments}
              disabled={false}
            />
          </Grid>
          <Box display="flex" justifyContent="center">
          <Button type="submit"
                  variant="contained"
                  color="primary"
                  style={{margin: "2vh 0 0 0"}}>Create</Button>
            </Box>
        </form>
      </DialogContent>
    </div>
  );
}

export default AddUser