import React, { useEffect } from "react";
import {
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInputText } from "../../../Utilities/FormInputText";
import { FormInputDropDown } from "../../../Utilities/FormInputDropDown";
import axios from "axios";

const AddUser = () => {
  const { handleSubmit, control } = useForm();

  const [roleMapping, setRoleMapping] = useState(null);
  const [departments, setDepartments] = useState(null);
  const [designations, setDesignations] = useState(null);

  function setDepartmentsFromMapping(role_mapping) {
    var departments = Object.keys(role_mapping).map((prop, i) => {
      return {
        label: role_mapping[prop]["name"],
        value: prop,
      };
    });
    departments.unshift({
      label: "Select",
      value: "Select",
    });
    console.log("set", departments);
    setDepartments(departments);
  }

  useEffect(() => {
    fetch("/api/admin/getroles")
      .then((data) => data.json())
      .then((data) => {
        setRoleMapping(data.role_mapping);
        setDepartmentsFromMapping(data.role_mapping);
      });
  }, []);
  const onSubmit = (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append('user', JSON.stringify(data));
    axios({
      method: "POST",
      url: "/api/admin/register",
      data: formData,
    })
      .then((response) => {
        alert('User added!')
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
  const [dept, setDept] = useState("Select");
  console.log("dept", dept);

  // const getRoles = () => {
  //   if(roleMapping !== null){
  //     Object.keys(roleMapping).map((dept_value, i) => {
  //
  //     })
  //   }
  // }

  //   const getRoles = (role_mapping) => {
  //     if(role_mapping !== null){
  //     var roles = Object.keys(role_mapping).map((dept_value, i) => {
  //       Object.keys(role_mapping[dept_value]["roles"]).map((role_value, idx) => {
  //         return {
  //           label: role_mapping[dept_value]["roles"][role_value]["name"],
  //           value: role_value,
  //         };
  //       });
  //     });
  //     setDesignations(roles)
  //     console.log(roles)
  //   }
  // }

    const getRoles = (dept_value) => {
    var roles = [];
    if (roleMapping !== null && dept_value !== "Select") {
      roles = Object.keys(roleMapping[dept_value]["roles"]).map((role_value, idx) => {
        return {
          label: roleMapping[dept_value]["roles"][role_value]["name"],
          value: role_value,
        };
      });

      setDesignations(roles);
      console.log(roles);
    }
    else{
      setDesignations([{
        label:"Select",
        value:"Select",
      }]);
    }
  }
 

  return (
    <Box>
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
              required={false}
              defaultValue={""}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <FormInputText
              name={"designation"}
              control={control}
              label={"Designation"}
              required={true}
              defaultValue={""}
            />
          </Grid> */}
          <Grid item xs={12} style={{ margin: "1vh 0 0 0" }}>
            <FormInputDropDown
              name={"department"}
              control={control}
              label="Department"
              options={departments === null ? [] : departments}
              disabled={false}
              setDept={(dep) => {
                setDept(dep); getRoles(dep);
              }}
              
            />
          </Grid>
          <Grid item xs={12} style={{ margin: "1vh 0 0 0" }}>
            <FormInputDropDown
              name={"designation"}
              control={control}
              label="User Role/Designation"
              options={designations === null ? [] : designations}
              disabled={false}
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

export default AddUser;
