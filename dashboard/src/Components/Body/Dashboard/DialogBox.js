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
  Button,
  Box,
  Tooltip,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { useForm, Controller } from "react-hook-form";
import { FormInputText } from "../../Utilities/FormInputText";
import { FormInputNumber } from "../../Utilities/FormInputNumber";
import { FormInputRadio } from "../../Utilities/FormInputRadio";
import { FormInputDate } from "../../Utilities/FormInputDate";

const DialogBox = ({ request_id, permission, process }) => {
  const [formInfo, setFormInfo] = useState({
    created_on: "",
    request_id: "",
    form_data: { establishment: {} },
    comments: {},
  });
  const [comments, setComments] = useState([]);

  const { handleSubmit, control } = useForm({});
  const { handleSubmit: handleSubmitData, control: controlData, reset } = useForm();
  let array = [];
  const [edit, setEdit] = useState(false);

  //   //function for accessing dictionary safely
  //  function access(parent, child){
  //       if(parent === undefined || parent === null || Object.keys(parent).length === 0){
  //         return "";
  //       }
  //       else{
  //         return parent[child];
  //       }

  //   }

  //options for radio input
  const options = [
    {
      index: 1,
      label: "Approve",
      value: "approve",
    },
    {
      index: 2,
      label: "Send back for review",
      value: "review",
    },
    {
      index: 3,
      label: "Decline",
      value: "decline",
    },
  ];

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

        let commentObject = response.data.data.comments ?? [];
        console.log(commentObject);
       
        for(var dept in commentObject){
          if(commentObject.hasOwnProperty(dept)){
            var dept_comments = commentObject[dept]
            console.log(dept_comments[0].comments)
            array.push(dept_comments[0].comments ?? {});
          }
        }
       
        //   commentArray.forEach(function (arrayItem) {
        //     console.log(arrayItem);
        //     console.log("hello");
        //     array.push(arrayItem);
        //   //   for (var dept in arrayItem) {
        //   //   // if (arrayItem.hasOwnProperty(dept)){
        //   //   //      var stageObject = arrayItem[dept];
        //   //   //      console.log(stageObject);
        //   //   // }

        //   //   //   if (stageObject.hasOwnProperty("comments")) {
        //   //   //     var stageComments = stageObject["comments"];
        //   //   //     array.push(stageComments);
        //   //   //   }
        //   //   // }
        //   //     //console.log(arrayItem);

        //   // }
        // });
        setComments(array);
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
  // console.log(comments);
  // const comment_data = formInfo.comments.comments ?? [];

  // var obj = formInfo.comments;
  // for (var key in obj) {
  //   if (obj.hasOwnProperty(key)) {
  //     var val = obj[key];
  //     console.log(val);

  //     if(val.hasOwnProperty("comments")){
  //       var comments = val["comments"];
  //       console.log(comments)
  //     }
  //   }
  // }

  const onSubmit = (data) => {
    console.log(data);

    const req_data = {
      request_id: request_id,
      comment: data.comment,
      approval: data.approval,
    };
    axios({
      method: "POST",
      url: "/api/comment",
      data: req_data,
    })
      .then((response) => {
        console.log("s", response.status);
        alert("Comment added!");
        window.location.reload();
      })
      .catch((error) => {
        if (error.response) {
          console.log("e", error.response);
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          alert(error.response.data.error);
        }
      });
  };

  const onSubmitEstData = (data) => {
    console.log(data);
    setEdit(false);
    const req_data = { request_id: request_id, stage_form: data };
    axios({
      method: "POST",
      url: "/api/fill-stage-form",
      data: req_data,
    })
      .then((response) => {
        console.log("s", response.status);
        alert("Data added!");
      })
      .catch((error) => {
        if (error.response) {
          console.log("e", error.response);
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          alert(error.response.data.error);
        }
      });
  };

  // console.log("This is est data", formInfo.form_data["establishment"]["est_data_block_year"])

  return (
    <>
      <DialogTitle>LTC Application ID {formInfo.request_id}</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>hello</DialogContentText> */}
        {/* <TextField label="Field" name = "Field" value = {formInfo.created_on}/> */}
        <Grid item xs={12}>
          <TextField
            label="Name"
            value={formInfo.form_data["name"] ?? " "}
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
              value={formInfo.form_data["designation"] ?? " "}
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
              value={formInfo.form_data["department"] ?? " "}
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
              value={formInfo.form_data["emp_code"] ?? " "}
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
              value={
                String(formInfo.form_data["joining_date"]).slice(0, 10) ?? " "
              }
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
          value={formInfo.form_data["band_pay"] ?? " "}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />

        <Typography>Leave Required</Typography>

        <TextField
          label="Nature"
          value={formInfo.form_data["nature"] ?? " "}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              label="From"
              value={
                String(formInfo.form_data["nature_from"]).slice(0, 10) ?? " "
              }
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
              value={
                String(formInfo.form_data["nature_to"]).slice(0, 10) ?? " "
              }
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
              value={formInfo.form_data["num_days"] ?? " "}
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
              value={
                String(formInfo.form_data["prefix_from"]).slice(0, 10) ?? " "
              }
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
              value={
                String(formInfo.form_data["prefix_to"]).slice(0, 10) ?? " "
              }
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
              value={
                String(formInfo.form_data["suffix_from"]).slice(0, 10) ?? " "
              }
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
              value={
                String(formInfo.form_data["suffix_to"]).slice(0, 10) ?? " "
              }
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
          value={formInfo.form_data["spouse_is_employed"] ?? " "}
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
              value={
                String(formInfo.form_data["self_date_outward"]).slice(0, 10) ??
                " "
              }
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
              value={
                String(formInfo.form_data["self_date_inward"]).slice(0, 10) ??
                " "
              }
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
              value={
                String(formInfo.form_data["family_date_outward"]).slice(
                  0,
                  10
                ) ?? " "
              }
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
              value={
                String(formInfo.form_data["family_date_inward"]).slice(0, 10) ??
                " "
              }
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
          value={formInfo.form_data["home_town"] ?? " "}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Nature of LTC to be availed, Home Town /
Anywhere in India with Block Year"
          value={formInfo.form_data["ltc_nature"] ?? " "}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          label="If, anywhere in India, the place to be visited"
          value={formInfo.form_data["place"] ?? " "}
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
              value={formInfo.form_data["est_fare"] ?? " "}
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
              value={formInfo.form_data["name_1"] ?? " "}
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
              value={formInfo.form_data["age_1"] ?? " "}
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
              value={formInfo.form_data["relationship_1"] ?? " "}
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
              value={formInfo.form_data["travelling_from_1"] ?? " "}
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
              value={formInfo.form_data["travelling_to_1"] ?? " "}
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
              value={formInfo.form_data["back_1"] ?? " "}
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
              value={formInfo.form_data["travel_mode_1"] ?? " "}
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
              value={formInfo.form_data["name_2"] ?? " "}
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
              value={formInfo.form_data["age_2"] ?? " "}
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
              value={formInfo.form_data["relationship_2"] ?? " "}
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
              value={formInfo.form_data["travelling_from_2"] ?? " "}
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
              value={formInfo.form_data["travelling_to_2"] ?? " "}
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
              value={formInfo.form_data["back_2"] ?? " "}
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
              value={formInfo.form_data["travel_mode_2"] ?? " "}
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
              value={formInfo.form_data["name_3"] ?? " "}
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
              value={formInfo.form_data["age_3"] ?? " "}
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
              value={formInfo.form_data["relationship_3"] ?? " "}
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
              value={formInfo.form_data["travelling_from_3"] ?? " "}
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
              value={formInfo.form_data["travelling_to_3"] ?? " "}
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
              value={formInfo.form_data["back_3"] ?? " "}
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
              value={formInfo.form_data["travel_mode_3"] ?? " "}
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
              value={formInfo.form_data["adv_is_required"] ?? " "}
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
              value={formInfo.form_data["encashment_is_required"] ?? " "}
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
          value={formInfo.form_data["encashment_days"] ?? " "}
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />

        <Box
          display="flex"
          justifyContent="start"
          style={{ margin: "5vh 0 0 0" }}
        >
          <Typography style={{ fontWeight: "bold" }}>
            Establishment Section Data
          </Typography>
          <Tooltip
            title={
              <div style={{ fontSize: "1.5em" }}>
                Remember to click save after editing the data
              </div>
            }
          >
            <InfoIcon />
          </Tooltip>
        </Box>

        {permission === "establishment" && process !== "new" ? (
          <form
            onSubmit={handleSubmitData(onSubmitEstData)}
            style={{
              width: "100%",
              "& .MultiFormControlRoot": {
                width: "100%",
              },
            }}
          >
            <Box style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={() => setEdit(true)}
              >
                Edit
              </Button>
              &nbsp;
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Box>
            {/* <Typography style={{fontWeight: "bold"}}>Establishment Data</Typography> */}
            <Typography>
              Fresh Recruit i.e. joining Govt. Service after 01.09.2008
              /otherwise,
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormInputDate
                  name="est_data_joining_date"
                  label="Date of joining"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_block_year"
                  label="Block Year"
                  control={controlData}
                  defaultValue=""
                  
                  
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Typography>
              Nature of LTC (Home Town/Anywhere in India-place visited/to be
              visited)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_nature_last"
                  label="Last Availed"
                  control={controlData}
                  defaultValue={
                    formInfo.form_data["est_data_nature_last"] ?? ""
                  }
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_nature_current"
                  label="Current LTC"
                  control={controlData}
                  defaultValue={
                    formInfo.form_data["est_data_nature_current"] ?? ""
                  }
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Typography>Period </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <FormInputDate
                  name="est_data_period_last_from"
                  label="Last Availed From"
                  control={controlData}
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={3}>
                <FormInputDate
                  name="est_data_period_last_to"
                  label="Last Availed To"
                  control={controlData}
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={3}>
                <FormInputDate
                  name="est_data_period_current_from"
                  label="Current LTC From"
                  control={controlData}
                  disabled={!edit}
                />
              </Grid>

              <Grid item xs={3}>
                <FormInputDate
                  name="est_data_period_current_to"
                  label="Current LTC To"
                  control={controlData}
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Typography>LTC for Self/Family</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_last_ltc_for"
                  label="Last Availed"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_current_ltc_for"
                  label="Current LTC"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Typography>Earned leave encashment (No. of Days)</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormInputNumber
                  name="est_data_last_ltc_days"
                  label="Last Availed"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={4}>
                <FormInputNumber
                  name="est_data_current_ltc_days"
                  label="Current LTC"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Typography>Earned Leave standing to his credit on</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormInputDate
                  name="est_data_last_earned_leave_on"
                  label="Last Availed"
                  control={controlData}
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={4}>
                <FormInputDate
                  name="est_data_current_earned_leave_on"
                  label="Current LTC"
                  control={controlData}
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Typography>Balance Earned leave after this encashment</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_last_balance"
                  label="Last Availed"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_current_balance"
                  label="Current LTC"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Typography>Earned Leave encashment admissible</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_last_encashment_adm"
                  label="Last Availed"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_current_encashment_adm"
                  label="Current LTC"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
            </Grid>
            <Typography>
              Period and nature of leave applied for and need to be sanctioned
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_last_nature"
                  label="Last Availed"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
              <Grid item xs={4}>
                <FormInputText
                  name="est_data_current_nature"
                  label="Current LTC"
                  control={controlData}
                  defaultValue=""
                  disabled={!edit}
                />
              </Grid>
            </Grid>
          </form>
        ) : (
          //est data for non establishment stages
          <div>
            <Typography>
              Fresh Recruit i.e. joining Govt. Service after 01.09.2008
              /otherwise,
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  name="est_data_joining_date"
                  label="Date of joining"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_joining_date"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="est_data_block_year"
                  label="Block Year"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_block_year"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Typography>
              Nature of LTC (Home Town/Anywhere in India-place visited/to be
              visited)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  name="est_data_nature_last"
                  label="Last Availed"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_nature_last"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="est_data_nature_current"
                  label="Current LTC"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_nature_current"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Typography>Period </Typography>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <TextField
                  name="est_data_period_last_from"
                  label="Last Availed From"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_period_last_from"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  name="est_data_period_last_to"
                  label="Last Availed To"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_period_last_to"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  name="est_data_period_current_from"
                  label="Current LTC From"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_period_current_from"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={3}>
                <TextField
                  name="est_data_period_current_to"
                  label="Current LTC To"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_period_current_to"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Typography>LTC for Self/Family</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  name="est_data_last_ltc_for"
                  label="Last Availed"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_last_ltc_for"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="est_data_current_ltc_for"
                  label="Current LTC"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_current_ltc_for"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Typography>Earned leave encashment (No. of Days)</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  name="est_data_last_ltc_days"
                  label="Last Availed"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_last_ltc_days"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="est_data_current_ltc_days"
                  label="Current LTC"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_current_ltc_days"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Typography>Earned Leave standing to his credit on</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  name="est_data_last_earned_leave_on"
                  label="Last Availed"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_last_earned_leave_on"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="est_data_current_earned_leave_on"
                  label="Current LTC"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_current_earned_leave_on"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Typography>Balance Earned leave after this encashment</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  name="est_data_last_balance"
                  label="Last Availed"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_last_balance"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="est_data_current_balance"
                  label="Current LTC"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_current_balance"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Typography>Earned Leave encashment admissible</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  name="est_data_last_encashment_adm"
                  label="Last Availed"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_last_encashment_adm"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="est_data_current_encashment_adm"
                  label="Current LTC"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_current_encashment_adm"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
            <Typography>
              Period and nature of leave applied for and need to be sanctioned
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  name="est_data_last_nature"
                  label="Last Availed"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_last_nature"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  name="est_data_current_nature"
                  label="Current LTC"
                  value={
                    formInfo.form_data["establishment"] === undefined
                      ? ""
                      : formInfo.form_data["establishment"][
                          "est_data_current_nature"
                        ] ?? ""
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </div>
        )}

        <Typography style={{ margin: "5vh 0 0 0", fontWeight: "bold" }}>
          Comment History
        </Typography>
        {/*make component for react flow chart*/}
        {/* <div>{comments.map(function(d, idx){
          return (<li key={idx}>{d}</li>)
        })}</div> */}
        {/* {comment_data.map( sections =>(Object.keys(sections).map((container, i) =>{
          return (
            <div key={i}>
              {container}
              {Object.keys(sections[container]).map(content => {
                return <div> {sections[container][content]} </div>;
              })}
              </div>
          )
        })))} */}
        {comments.map((d) =>
          Object.keys(d).map((prop, i) =>
            d[prop] !== null ? (
              <li key={i}>
                {prop}:&nbsp;{d[prop]}
              </li>
            ) : (
              <div key={i} />
            )
          )
        )}

        {permission !== "client" ? (
          <div>
            <br />
            <Typography style={{ fontWeight: "bold" }}>Comments</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInputText
                name="comment"
                control={control}
                label="Add new comment"
                defaultValue=""
                multiline={true}
                rows={4}
              />
              <Box display="flex" justifyContent="start">
                <Typography style={{ fontWeight: "bold" }}>Approve</Typography>
                <Tooltip
                  title={
                    <div style={{ fontSize: "1.5em" }}>
                      Section Heads must ensure that the section specific
                      information is filled before sending the form forward
                    </div>
                  }
                >
                  <InfoIcon />
                </Tooltip>
              </Box>
              <FormInputRadio
                name="approval"
                control={control}
                label="Approve"
                options={options}
              />
              <Box display="flex" justifyContent="center">
                <Button type="submit" variant="contained" color="primary">
                  Send
                </Button>
              </Box>
            </form>
          </div>
        ) : (
          <div />
        )}
      </DialogContent>
    </>
  );
};

export default DialogBox;
