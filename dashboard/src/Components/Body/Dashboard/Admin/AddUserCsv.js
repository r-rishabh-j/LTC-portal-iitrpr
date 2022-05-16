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
import { FormInputDropDown } from "../../../Utilities/FormInputDropDown";
import axios from "axios";
import { DropzoneArea } from 'material-ui-dropzone';

const AddUserCsv = () => {
    const { handleSubmit, control } = useForm();
    const [file, setFile] = useState(null);

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
    function onUpload(file) {
        setFile(file[0]);
    }
    const onSubmit = (data) => {
        if (file === undefined || file.length === 0) {
            alert('No file uploaded!');
            return;
        }
        console.log(data);
        const formData = new FormData();
        formData.append('user', JSON.stringify(data));
        formData.append('file', file);
        axios({
            method: "POST",
            url: "/api/admin/register-from-csv",
            data: formData,
        })
            .then((response) => {
                alert('Users added!');
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
    const [dept, setDept] = useState("Select");
    console.log("dept", dept);

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
        else {
            setDesignations([{
                label: "Select",
                value: "Select",
            }]);
        }
    }


    return (
        <Box>
            <DialogTitle>Add Users from CSV</DialogTitle>
            <DialogContent><DropzoneArea
                filesLimit={1}
                onChange={onUpload}
                acceptedFiles={['.csv']}
            />
                <form onSubmit={handleSubmit(onSubmit)}>
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

export default AddUserCsv;
