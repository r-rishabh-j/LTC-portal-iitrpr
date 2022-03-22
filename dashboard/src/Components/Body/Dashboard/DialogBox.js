import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Grid,
  Typography,
} from "@material-ui/core";

const DialogBox = ({ request_id }) => {
  const [formInfo, setFormInfo] = useState({
    created_on: "",
    request_id: "",
    form_data: {},
    comments: {}
  });

  
  
  

  useEffect(() => {
    const data = { request_id: request_id };
    axios({
      method: "post",
      url: "api/getformdata",
      data: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        console.log(response.data.data);
        setFormInfo(response.data.data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          alert("Form not found");
        }
      });
  }, []);

  // if(formInfo.comments !== {})
  //   console.log("Hi", formInfo.comments["establishment"]["comments"]["establishment@email"]);
  
  return (
    <>
      <DialogTitle>LTC Application ID {formInfo.request_id}</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>hello</DialogContentText> */}
        {/* <TextField label="Field" name = "Field" value = {formInfo.created_on}/> */}
        <Grid item xs={12}>
          <TextField
            label="Name"
            value={formInfo.form_data["name"]}
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Designation"
              value={formInfo.form_data["designation"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Department"
              value={formInfo.form_data["department"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="Employee Code"
              value={formInfo.form_data["emp_code"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="Date of entering the Central Government
Service/Date of Joining with IIT Ropar"
              value={formInfo.form_data["joining_date"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <TextField
          label="Band Pay + AGP/GP"
          value={formInfo.form_data["band_pay"]}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />

        <Typography>Leave Required</Typography>

        <TextField
          label="Nature"
          value={formInfo.form_data["nature"]}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="From"
              value={formInfo.form_data["nature_from"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="To"
              value={formInfo.form_data["nature_to"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="No. of Days"
              value={formInfo.form_data["num_days"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Typography>Prefix:</Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="From"
              value={formInfo.form_data["prefix_from"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="To"
              value={formInfo.form_data["prefix_to"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Typography>Suffix:</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="From"
              value={formInfo.form_data["suffix_from"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="To"
              value={formInfo.form_data["suffix_to"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <TextField
          label="Whether spouse is employed, if yes whether
entitled to LTC"
          value={formInfo.form_data["spouse_is_employed"]}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />

        <Typography>Proposed dates of Journey</Typography>
        <Typography>Self:</Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Date of Outward journey"
              value={formInfo.form_data["self_date_outward"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date of Inward journey"
              value={formInfo.form_data["self_date_inward"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Typography>Family:</Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Date of Outward journey"
              value={formInfo.form_data["family_date_outward"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date of Inward journey"
              value={formInfo.form_data["family_date_inward"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <TextField
          label="Home Town as recorded in the Service Book"
          value={formInfo.form_data["home_town"]}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Nature of LTC to be availed, Home Town /
Anywhere in India with Block Year"
          value={formInfo.form_data["ltc_nature"]}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          label="If, anywhere in India, the place to be visited"
          value={formInfo.form_data["place"]}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={9}>
            <TextField
              label="Estimated fare of entitled class from the
headquarter to Home Town/Place of visit by
shortest route "
              value={formInfo.form_data["est_fare"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Typography>
          Person(s) in respect of whom LTC is proposed to be availed:
        </Typography>

        <Grid container spacing={1}>
          {/* <Grid item xs={1}>
            <TextField
              
              label="S.No."
              
              
              value={formInfo.form_data["sno_1"]}
              fullWidth InputProps={{
            readOnly: true,
          }}
              
            />
          </Grid> */}

          <Grid item xs={2}>
            <TextField
              label="Name"
              value={formInfo.form_data["name_1"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Age"
              value={formInfo.form_data["age_1"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Relationship"
              value={formInfo.form_data["relationship_1"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Travelling(Place) From"
              value={formInfo.form_data["travelling_from_1"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Travelling(Place) To"
              value={formInfo.form_data["travelling_to_1"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Back(Yes/No)"
              value={formInfo.form_data["back_1"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Mode of Travel"
              value={formInfo.form_data["travel_mode_1"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={2}>
            <TextField
              label="Name"
              value={formInfo.form_data["name_2"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Age"
              value={formInfo.form_data["age_2"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Relationship"
              value={formInfo.form_data["relationship_2"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Travelling(Place) From"
              value={formInfo.form_data["travelling_from_2"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Travelling(Place) To"
              value={formInfo.form_data["travelling_to_2"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Back(Yes/No)"
              value={formInfo.form_data["back_2"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Mode of Travel"
              value={formInfo.form_data["travel_mode_2"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={2}>
            <TextField
              label="Name"
              value={formInfo.form_data["name_3"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Age"
              value={formInfo.form_data["age_3"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Relationship"
              value={formInfo.form_data["relationship_3"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Travelling(Place) From"
              value={formInfo.form_data["travelling_from_3"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Travelling(Place) To"
              value={formInfo.form_data["travelling_to_3"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={1}>
            <TextField
              label="Back(Yes/No)"
              value={formInfo.form_data["back_3"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Mode of Travel"
              value={formInfo.form_data["travel_mode_3"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Advance Required"
              value={formInfo.form_data["adv_is_required"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Encashment Required"
              value={formInfo.form_data["encashment_is_required"]}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <TextField
          label="No. of encashment of leave days "
          value={formInfo.form_data["encashment_days"]}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
        <Typography>comments</Typography>
      </DialogContent>
    </>
  );
};

export default DialogBox;
