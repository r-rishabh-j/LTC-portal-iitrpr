import React from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Checkbox,
  Button,
  Typography,
} from "@material-ui/core";
import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import LockIcon from "@material-ui/icons/Lock";
import { Link } from "react-router-dom";
import { useForm} from "react-hook-form";
import axios from "axios";
import { useStyles } from "./FormStyles";
import GeneratePDF from "../../Utilities/GeneratePDF";
import FileUpload from "react-material-file-upload";
import GeneratePDF from "../../Utilities/GeneratePDF";
import { FormInputText } from "../../Utilities/FormInputText";
import { FormInputDate } from "../../Utilities/FormInputDate"
import { FormInputNumber } from "../../Utilities/FormInputNumber" 
import { FormInputRadio } from "../../Utilities/FormInputRadio"; 

const defaultValues = {
  textValue: "",
  radioValue: "No",
  dateValue: new Date()
}

export default function CreateApplication(props) {
  const classes = useStyles();
  const { handleSubmit, control } = useForm({defaultValues: defaultValues});

  const onSubmit = (data) => {
    console.log(data);
    // axios({
    //   method: "POST",
    //   url: "/api/apply",
    //   headers: {
    //     Authorization: "Bearer " + props.token,
    //   },
    //   data: data
    // })
    //   .then((response) => {
    //     console.log(response)
        
    //   })
    //   .catch((error) => {
    //     if (error.response) {
    //       console.log(error.response);
    //       console.log(error.response.status);
    //       console.log(error.response.headers);
    //     }
    //   });
  };
  return (
    <>
      <Grid container>
        <Paper elevation={10} className={classes.contain}>
          <Grid container>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
              <Typography variant="h4">
                Application for Leave Travel Concession{" "}
              </Typography>
              <div>
                {/* <h4>Leave Required</h4> */}
                <FormInputText
                  name={"Name"}
                  control={control}
                  label={"Name"}
                  required={true}
                />
                <FormInputText
                  name="Employee Code"
                  control={control}
                  label="Employee Code"
                  required={true}
                />
                <FormInputDate
                  name="Date of entering the Central Government
Service/Date of Joining with IIT Ropar"
                  control={control}
                  label="Date of entering the Central Government
Service/Date of Joining with IIT Ropar"
                  required={true}
                />
                <FormInputText
                  name="Band Pay + AGP/GP"
                  control={control}
                  label="Band Pay + AGP/GP"
                  required={true}
                />
                <Typography>Leave Required</Typography>
                <FormInputText
                  name="Nature"
                  control={control}
                  label="Nature"
                  required={true}
                />
                <FormInputDate
                  name="Nature From"
                  control={control}
                  label="From"
                  required={true}
                />
                <FormInputDate
                  name="Nature To"
                  control={control}
                  label="To"
                  required={true}
                />
                <FormInputNumber
                  name="No. of Days"
                  control={control}
                  label="No. of Days"
                  required={true}
                />
                <Typography>Prefix:</Typography>
                <FormInputDate
                  name="Prefix From"
                  control={control}
                  label="From"
                  required={true}
                />
                <FormInputDate
                  name="Prefix To"
                  control={control}
                  label="To"
                  required={true}
                />
                <Typography>Suffix:</Typography>
                <FormInputDate
                  name="Suffix From"
                  control={control}
                  label="From"
                  required={true}
                />
                <FormInputDate
                  name="Suffix To"
                  control={control}
                  label="To"
                  required={true}
                />
                <Typography>
                  Whether spouse is employed, if yes whether entitled to LTC
                </Typography>
                <FormInputRadio
                  name="Whether spouse is employed, if yes whether
entitled to LTC"
                  control={control}
                  label="Whether spouse is employed, if yes whether
entitled to LTC"
                />
                <Typography>Proposed dates of Journey</Typography>
                <Typography>Self:</Typography>
                <FormInputDate
                  name="Date of Outward journey"
                  control={control}
                  label="Date of Outward journey"
                  required={true}
                />
                <FormInputDate
                  name="Date of Intward journey"
                  control={control}
                  label="Date of Intward journey"
                  required={true}
                />
                <Typography>Family:</Typography>
                <FormInputDate
                  name="Date of Outward journey"
                  control={control}
                  label="Date of Outward journey"
                  required={true}
                />
                <FormInputDate
                  name="Date of Intward journey"
                  control={control}
                  label="Date of Intward journey"
                  required={true}
                />
                <FormInputText
                  name="Home Town"
                  control={control}
                  label="Home Town as recorded in the Service Book"
                  required={true}
                />
                <FormInputText
                  name="Nature of LTC"
                  control={control}
                  label="Nature of LTC to be availed, Home Town /
Anywhere in India with Block Year"
                  required={true}
                />
                <FormInputText
                  name="Place"
                  control={control}
                  label="If, anywhere in India, the place to be visited"
                  required={true}
                />
                <FormInputText
                  name="Estimated Fare"
                  control={control}
                  label="Estimated fare of entitled class from the
headquarter to Home Town/Place of visit by
shortest route (proofs need to be attached)."
                  required={true}
                />
                <Typography>Advance Required</Typography>
                <FormInputRadio
                  name="Advance Required"
                  control={control}
                  label="Advance Required"
                />
                <Typography>Encashment of earned leave required</Typography>
                <FormInputRadio
                  name="Encashment Required"
                  control={control}
                  label="Encashment Required"
                />
                <FormInputNumber name="Encashment Days" control={control} label="No. of days"/>
              </div>
              <Box display="flex" justifyContent="space-between">
              <Button type="submit" variant="contained">
                Upload Proofs
              </Button>
              {/* <GeneratePDF /> */}
            </form>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}
