import React from "react";
import { useState, useEffect, useRef } from "react";
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import { useForm } from "react-hook-form";
import { FormInputText } from "../../Utilities/FormInputText";
import { FormInputRadio } from "../../Utilities/FormInputRadio";
import EstablishmentSectionForm from "./Establishment/EstablishmentSectionForm";
import AccountsSectionForm from "./Accounts/AccountsSectionForm";
import PersonIcon from "@material-ui/icons/Person";
import ReactToPrint from 'react-to-print';
import "bootstrap/dist/css/bootstrap.min.css";
import PrintForm from "./PrintForm";
const moment = require('moment');

const DialogBox = ({ request_id, permission, process, status, email, showCommentSection, showReviewCommentSection }) => {
  console.log('permission', permission, "process", process);
  const [formInfo, setFormInfo] = useState({
    created_on: "",
    request_id: "",
    form_data: { establishment: {} },
    comments: {},
  });
  const [comments, setComments] = useState([]);
  const [commentObj, setCommentObj] = useState({})
  const childRef = useRef()
  // const [estComments, setEstComments] = useState({});
  // const [auditComments, setAuditComments] = useState({});
  // const [accComments, setAccComments] = useState({});
  // const [estComments, setEstComments] = useState({});
  // const [estComments, setEstComments] = useState({});

  // const getPageMargins = () => {
  //   return `@page { margin: 10mm 10mm 20mm 20mm !important; }`;
  // };


  const { handleSubmit, control, formState: { isSubmitting } } = useForm({});
  const {
    handleSubmit: handleSubmitData,
    control: controlData,
    reset,
  } = useForm();
  const { handleSubmit: handleSubmitReview,
  control: controlReview} = useForm();
  let array = [];
  const [edit, setEdit] = useState(false);

  //   //function for accessing dictionary safely
  //  function access(parent, child){
  //       if(parent === undefined || parent === null || Object.keys(parent).length === 0){
  //         return "";
  //       }
  //       else{
  //         return parent[child];reset
  //       }

  //   }

  const setEditState = (state) => {
    setEdit(state)
  }

  const handleAttachmentClick = () => {
    // console.log(cellValues.row.request_id);
    const data = { request_id: request_id };
    axios({
      method: "post",
      url: "api/getattachments",
      data: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
      responseType: "blob",
    })
      .then((response) => {
        console.log('ee', response)
        var blob = new Blob([response.data], { type: response.data.type });
        var url = window.URL.createObjectURL(blob, { oneTimeOnly: true });
        var anchor = document.createElement('a');
        anchor.href = url;
        anchor.target = '_blank';
        anchor.click();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          alert("No attachments");
        }
      });
  };
  const handleOfficeOrderClick = () => {
    // console.log(cellValues.row.request_id);

    const data = { request_id: request_id };
    axios({
      method: "post",
      url: "api/get-office-order",
      data: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
      responseType: "blob",
    })
      .then((response) => {
        var blob = new Blob([response.data], { type: response.data.type });
        var url = window.URL.createObjectURL(blob, { oneTimeOnly: true });
        var anchor = document.createElement('a');
        anchor.href = url;
        anchor.target = '_blank';
        anchor.click();
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          alert("Office Order not yet generated");
        }
      });
  };


  function formatDate(date) {
    const d = moment(date).format("DD-MM-YYYY");
    return d;
  }

  //options for radio input
  function getVal(val, default_val) {
    if (val === undefined) {
      return default_val;
    } else {
      return val;
    }
  }

  const options_no_review = [
    {
      index: 1,
      label: "Approve",
      value: "approve",
    },
    {
      index: 2,
      label: "Decline",
      value: "decline",
    },
  ];

  const options = [
    {
      index: 1,
      label: "Recommend",
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

    const est_review_options = [
      {
        index: 1,
        label: "Mark as Resolved and Recommend",
        value: "resolve",
      },
      {
        index: 2,
        label: "Send back to user",
        value: "send_to_user",
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

        var commentObject;
        // var commentObject = response.data.data.comments ?? [];
        if (response.data.data.comments === undefined) {
          commentObject = [];
        } else {
          commentObject = response.data.data.comments;
          setCommentObj(commentObject)
        }
        console.log(commentObject);

        for (var dept in commentObject) {
          if (commentObject.hasOwnProperty(dept)) {
            var dept_comments = commentObject[dept];
            console.log(dept_comments[0]);
            // array.push((dept_comments[0].comments) ?? {});
            array.push(getVal(dept_comments[0].comments, {}));
          }
        }
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

  const onSubmit = (data) => {
    console.log(data);
    if(edit){
      alert("Section Data was edited but not saved. Kindly save before submitting.")
      return
    }

    const req_data = {
      request_id: request_id,
      comment: data.comment,
      approval: data.approval,
    };
    return axios({
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

  const onSubmitReview = (data) => {
    console.log(data);
    if (edit) {
      alert(
        "Section Data was edited but not saved. Kindly save before submitting."
      );
      return;
    }

    const req_data = {
      request_id: request_id,
      comment: data.comment,
      action: data.action,
    };
    return axios({
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
    return axios({
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

  function getVal(val, default_val) {
    if (val === undefined) {
      return default_val;
    } else {
      return val;
    }
  }

  const printComponentRef = useRef();

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Box text-overflow="wrap">
          <DialogTitle>
            LTC ID {formInfo.request_id}:{" "}
            {formInfo.form_data["name"] === undefined
              ? " "
              : formInfo.form_data["name"]}
            , {formInfo["email"] === undefined ? " " : formInfo["email"]}{" "}
          </DialogTitle>
        </Box>
        <Box margin="2vh 2vh 0 0" display="flex" justifyContent="right">
          <ReactToPrint
            trigger={() => (
              <Button variant="contained" color="primary">
                PDF
              </Button>
            )}
            content={() => printComponentRef.current}
            pageStyle={"@page {size: A4; margin: 200mm !important}"}
          />
          {/* <Button variant="contained" color="primary">
            
            PDF
          </Button> */}
          &nbsp;
          <Button
            variant="contained"
            color="primary"
            onClick={handleAttachmentClick}
          >
            Attachment
          </Button>
          &nbsp;
          {status === "advance_pending" || status === "approved" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOfficeOrderClick}
            >
              Office Order
            </Button>
          ) : (
            <></>
          )}
          {/* <Button>Office Order</Button> */}
        </Box>
      </Box>

      <DialogContent>
        <div style={{ display: "none" }}>
          <PrintForm ref={printComponentRef} request_id={request_id} />
        </div>
        {/* <DialogContentText>hello</DialogContentText> */}
        {/* <TextField label="Field" name = "Field" value = {formInfo.created_on}/> */}
        <Box
          sx={{
            backgroundColor: "#eeeeee",
            padding: "1vh 1vh 1vh 1vh",
            borderRadius: "10px",
          }}
        >
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={
                formInfo.form_data["name"] === undefined
                  ? " "
                  : formInfo.form_data["name"]
              }
              // value={getVal(formInfo.form_data["name"], " ")}
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
                value={
                  formInfo.form_data["designation"] === undefined
                    ? " "
                    : formInfo.form_data["designation"]
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
                label="Department"
                // value={getVal(formInfo.form_data["department"], " ")}
                value={
                  formInfo.form_data["department"] === undefined
                    ? " "
                    : formInfo.form_data["department"]
                }
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
                value={
                  formInfo.form_data["emp_code"] === undefined
                    ? " "
                    : formInfo.form_data["emp_code"]
                }
                // value={getVal(formInfo.form_data["emp_code"], " ")}
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
                value={String(
                  formInfo.form_data["joining_date"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["joining_date"])
                ).slice(0, 10)}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <TextField
            label="Pay Level"
            value={
              formInfo.form_data["band_pay"] === undefined
                ? " "
                : formInfo.form_data["band_pay"]
            }
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />

          <Typography>Leave Required</Typography>

          <TextField
            label="Nature"
            value={
              formInfo.form_data["nature"] === undefined
                ? " "
                : formInfo.form_data["nature"]
            }
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="From"
                value={String(
                  formInfo.form_data["nature_from"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["nature_from"])
                ).slice(0, 10)}
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
                value={String(
                  formInfo.form_data["nature_to"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["nature_to"])
                ).slice(0, 10)}
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
                value={
                  formInfo.form_data["num_days"] === undefined
                    ? " "
                    : formInfo.form_data["num_days"]
                }
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
                value={String(
                  formInfo.form_data["prefix_from"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["prefix_from"])
                ).slice(0, 10)}
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
                value={String(
                  formInfo.form_data["prefix_to"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["prefix_to"])
                ).slice(0, 10)}
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
                value={String(
                  formInfo.form_data["suffix_from"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["suffix_from"])
                ).slice(0, 10)}
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
                value={String(
                  formInfo.form_data["suffix_to"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["suffix_to"])
                ).slice(0, 10)}
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
            value={
              formInfo.form_data["spouse_is_employed"] === undefined
                ? " "
                : formInfo.form_data["spouse_is_employed"]
            }
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
                value={String(
                  formInfo.form_data["self_date_outward"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["self_date_outward"])
                )}
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
                value={String(
                  formInfo.form_data["self_date_inward"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["self_date_inward"])
                )}
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
                  formInfo.form_data["family_date_outward"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["family_date_outward"])
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
                  formInfo.form_data["family_date_inward"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["family_date_inward"])
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
            value={
              formInfo.form_data["home_town"] === undefined
                ? " "
                : formInfo.form_data["home_town"]
            }
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            label="Nature of LTC to be availed, Home Town /
Anywhere in India with Block Year"
            value={
              formInfo.form_data["ltc_nature"] === undefined
                ? " "
                : formInfo.form_data["ltc_nature"]
            }
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />

          <TextField
            label="If, anywhere in India, the place to be visited"
            value={
              formInfo.form_data["place"] === undefined
                ? " "
                : formInfo.form_data["place"]
            }
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
                value={
                  formInfo.form_data["est_fare"] === undefined
                    ? " "
                    : formInfo.form_data["est_fare"]
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
            Person(s) in respect of whom LTC is proposed to be availed:
          </Typography>

          {formInfo.form_data["dependents"] !== undefined ? (
            formInfo.form_data["dependents"].map((item, index) => {
              return (
                <div key={index}>
                  <Grid container spacing={1}>
                    <Grid item xs={2}>
                      <TextField
                        label="Name"
                        value={item.dep_name}
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
                        value={item.dep_age}
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
                        value={item.dep_relationship}
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
                        value={item.dep_travelling_from}
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
                        value={item.dep_travelling_to}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={1}>
                      <TextField
                        label="Back"
                        value={item.dep_back}
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
                        value={item.dep_mode_of_travel}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </div>
              );
            })
          ) : (
            <div></div>
          )}

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Advance Required"
                value={
                  formInfo.form_data["adv_is_required"] === undefined
                    ? " "
                    : formInfo.form_data["adv_is_required"]
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
                label="Encashment Required"
                value={
                  formInfo.form_data["encashment_is_required"] === undefined
                    ? " "
                    : formInfo.form_data["encashment_is_required"]
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
            label="No. of encashment of leave days "
            value={
              formInfo.form_data["encashment_days"] === undefined
                ? " "
                : formInfo.form_data["encashment_days"]
            }
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>

        {permission === "establishment" &&
        (process === "new" || process === "review") ? (
          <>
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
            <Box
              style={{
                backgroundColor: "#eeeeee",
                padding: "1vh 1vh 1vh 1vh",
                borderRadius: "10px",
              }}
            >
              <EstablishmentSectionForm
                ref={childRef}
                est_data={
                  formInfo.form_data["establishment"] === undefined
                    ? {}
                    : formInfo.form_data["establishment"]
                }
                request_id={request_id}
                setEditState={setEditState}
              />
            </Box>
          </>
        ) : (
          //est data for non establishment stages
          <div>
            <Box
              display="flex"
              justifyContent="start"
              style={{ margin: "5vh 0 1vh 0" }}
            >
              <Typography style={{ fontWeight: "bold" }}>
                Establishment Section
              </Typography>
            </Box>
            <Box
              style={{
                backgroundColor: "#eeeeee",
                padding: "1vh 1vh 1vh 1vh",
                borderRadius: "10px",
              }}
            >
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
                          ] === undefined
                        ? " "
                        : formatDate(
                            formInfo.form_data["establishment"][
                              "est_data_joining_date"
                            ]
                          )
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_block_year"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_nature_last"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_nature_current"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_period_last_from"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_period_last_to"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_period_current_from"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_period_current_to"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_last_ltc_for"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_current_ltc_for"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_last_ltc_days"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_current_ltc_days"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_last_earned_leave_on"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_current_earned_leave_on"
                          ]
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
                Balance Earned leave after this encashment
              </Typography>
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_last_balance"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_current_balance"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_last_encashment_adm"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_current_encashment_adm"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_last_nature"
                          ]
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
                          ] === undefined
                        ? " "
                        : formInfo.form_data["establishment"][
                            "est_data_current_nature"
                          ]
                    }
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Box>
          </div>
        )}

        {permission === "accounts" &&
        (process === "new" || process === "review") ? (
          <>
            <Box
              display="flex"
              justifyContent="start"
              style={{ margin: "5vh 0 0 0" }}
            >
              <Typography style={{ fontWeight: "bold" }}>
                Accounts Section Data
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
            <Box
              style={{
                backgroundColor: "#eeeeee",
                padding: "1vh 1vh 1vh 1vh",
                borderRadius: "10px",
              }}
            >
              <AccountsSectionForm
                acc_data={
                  formInfo.form_data["accounts"] === undefined
                    ? {
                        entities: [
                          {
                            from: "",
                            to: "",
                            mode_of_travel: "",
                            num_fares: "",
                            single_fare: "",
                            amount: "",
                          },
                        ],
                      }
                    : formInfo.form_data["accounts"]
                }
                request_id={request_id}
                setEditState={setEditState}
              />
            </Box>
          </>
        ) : (
          //est data for non establishment stages
          <div>
            <Box
              display="flex"
              justifyContent="start"
              style={{ margin: "5vh 0 1vh 0" }}
            >
              <Typography style={{ fontWeight: "bold" }}>
                Accounts Section
              </Typography>
            </Box>
            <Box
              style={{
                backgroundColor: "#eeeeee",
                padding: "1vh 1vh 1vh 1vh",
                borderRadius: "10px",
              }}
            >
              {formInfo.form_data["accounts"] !== undefined &&
              formInfo.form_data["accounts"]["entities"] !== undefined ? (
                formInfo.form_data["accounts"]["entities"].map(
                  (item, index) => {
                    return (
                      <div key={index}>
                        <Grid container spacing={1}>
                          <Grid item xs={2}>
                            <TextField
                              label="From"
                              value={item.from}
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              label="To"
                              value={item.to}
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
                              value={item.mode_of_travel}
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              label="No. of Fares"
                              value={item.num_fares}
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <TextField
                              label="Single Fare"
                              value={item.single_fare}
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <TextField
                              label="Amount"
                              value={item.amount}
                              fullWidth
                              InputProps={{
                                readOnly: true,
                              }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    );
                  }
                )
              ) : (
                <div></div>
              )}
              <Grid container spacing={2} style={{ margin: "1vh 0 0 0" }}>
                <Grid item xs={9} />
                <Grid item xs={1}>
                  <Typography style={{ fontWeight: "bold" }}>Total</Typography>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    name="total"
                    label="Total(₹)"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"]["total"] === undefined
                        ? " "
                        : formInfo.form_data["accounts"]["total"]
                    }
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography>Advance admissible (90% of above):</Typography>
                <TextField
                  name="adv_admissible"
                  label="Advance Admissible(₹)"
                  value={
                    formInfo.form_data["accounts"] === undefined
                      ? ""
                      : formInfo.form_data["accounts"]["adv_admissible"] ===
                        undefined
                      ? " "
                      : formInfo.form_data["accounts"]["adv_admissible"]
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <Typography>Passed for:</Typography>
                <TextField
                  name="passed"
                  label="Passed(₹)"
                  value={
                    formInfo.form_data["accounts"] === undefined
                      ? ""
                      : formInfo.form_data["accounts"]["passed"] === undefined
                      ? " "
                      : formInfo.form_data["accounts"]["passed"]
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <Typography> In Words:</Typography>
                <TextField
                  name="in_words"
                  label="In Words(₹)"
                  value={
                    formInfo.form_data["accounts"] === undefined
                      ? ""
                      : formInfo.form_data["accounts"]["in_words"] === undefined
                      ? " "
                      : formInfo.form_data["accounts"]["in_words"]
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <Typography>
                  Debitable to LTC advance Dr./Mr./Mrs./Ms.:
                  <TextField
                    name="debit_to"
                    label="Name"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"]["debit_to"] ===
                          undefined
                        ? " "
                        : formInfo.form_data["accounts"]["debit_to"]
                    }
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Typography>
              </Grid>
            </Box>
          </div>
        )}
        {commentObj["establishment"] !== undefined ? (
          // commentObj["establishment"][0]["review"] === true ? (
          <div>
            <Typography style={{ fontWeight: "bold", margin: "2vh 0 0 0" }}>
              Establishment Section Comments
            </Typography>
            <List>
              {commentObj.establishment.map((comment, j) => {
                return (
                  <Box
                    style={{
                      backgroundColor: "#eeeeee",
                      margin: "1vh 0 1vh 0",
                      borderRadius: "10px",
                    }}
                    key={j}
                  >
                    {Object.keys(comment["comments"]).map((prop, i) => {
                      return comment["comments"][prop] === undefined ||
                        comment["comments"][prop] === null ||
                        String(comment["comments"][prop]).trim().length ===
                          0 ? (
                        <div key={i}></div>
                      ) : (
                        <ListItem key={i}>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={prop}
                            secondary={
                              (comment["approved"][prop] === true
                                ? "Recommended"
                                : "Not Recommended") +
                              ": " +
                              comment["comments"][prop]
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </Box>
                );
              })}
            </List>
          </div>
        ) : (
          <div></div>
        )}
        {commentObj["audit"] !== undefined ? (
          // commentObj["establishment"][0]["review"] === true ? (
          <div>
            <Typography style={{ fontWeight: "bold", margin: "2vh 0 0 0" }}>
              Audit Section Comments
            </Typography>
            <List>
              {commentObj.audit.map((comment, j) => {
                return (
                  <Box
                    style={{
                      backgroundColor: "#eeeeee",
                      margin: "1vh 0 1vh 0",
                      borderRadius: "10px",
                    }}
                    key={j}
                  >
                    {Object.keys(comment["comments"]).map((prop, i) => {
                      return comment["comments"][prop] === undefined ||
                        comment["comments"][prop] === null ||
                        String(comment["comments"][prop]).trim().length ===
                          0 ? (
                        <div key={i}></div>
                      ) : (
                        <ListItem key={i}>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={prop}
                            secondary={
                              (comment["approved"][prop] === true
                                ? "Recommended"
                                : "Not Recommended") +
                              ": " +
                              comment["comments"][prop]
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </Box>
                );
              })}
            </List>
          </div>
        ) : (
          <div></div>
        )}
        {commentObj["accounts"] !== undefined ? (
          <div>
            <Typography style={{ fontWeight: "bold", margin: "2vh 0 0 0" }}>
              Accounts Section Comments
            </Typography>
            <List>
              {commentObj.accounts.map((comment, j) => {
                return (
                  <Box
                    style={{
                      backgroundColor: "#eeeeee",
                      margin: "1vh 0 1vh 0",
                      borderRadius: "10px",
                    }}
                    key={j}
                  >
                    {Object.keys(comment["comments"]).map((prop, i) => {
                      return comment["comments"][prop] === undefined ||
                        comment["comments"][prop] === null ||
                        String(comment["comments"][prop]).trim().length ===
                          0 ? (
                        <div key={i}></div>
                      ) : (
                        <ListItem key={i}>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={prop}
                            secondary={
                              (comment["approved"][prop] === true
                                ? "Recommended"
                                : "Not Recommended") +
                              ": " +
                              comment["comments"][prop]
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </Box>
                );
              })}
            </List>
          </div>
        ) : (
          <div></div>
        )}
        {commentObj["registrar"] !== undefined ? (
          <div>
            <Typography style={{ fontWeight: "bold", margin: "2vh 0 0 0" }}>
              Registrar Comments
            </Typography>
            <List>
              {commentObj.registrar.map((comment, j) => {
                return (
                  <Box
                    style={{
                      backgroundColor: "#eeeeee",
                      margin: "1vh 0 1vh 0",
                      borderRadius: "10px",
                    }}
                    key={j}
                  >
                    {Object.keys(comment["comments"]).map((prop, i) => {
                      return comment["comments"][prop] === undefined ||
                        comment["comments"][prop] === null ||
                        String(comment["comments"][prop]).trim().length ===
                          0 ? (
                        <div key={i}></div>
                      ) : (
                        <ListItem key={i}>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={prop}
                            secondary={
                              (comment["approved"][prop] === true
                                ? "Recommended"
                                : "Not Recommended") +
                              ": " +
                              comment["comments"][prop]
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </Box>
                );
              })}
            </List>
          </div>
        ) : (
          <div></div>
        )}
        {commentObj["deanfa"] !== undefined ? (
          <div>
            <Typography style={{ fontWeight: "bold", margin: "2vh 0 0 0" }}>
              Dean Comments
            </Typography>
            <List>
              {commentObj.deanfa.map((comment, j) => {
                return (
                  <Box
                    style={{
                      backgroundColor: "#eeeeee",
                      margin: "1vh 0 1vh 0",
                      borderRadius: "10px",
                    }}
                    key={j}
                  >
                    {Object.keys(comment["comments"]).map((prop, i) => {
                      return comment["comments"][prop] === undefined ||
                        comment["comments"][prop] === null ||
                        String(comment["comments"][prop]).trim().length ===
                          0 ? (
                        <div key={i}></div>
                      ) : (
                        <ListItem key={i}>
                          <ListItemIcon>
                            <PersonIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={prop}
                            secondary={
                              (comment["approved"][prop] === true
                                ? "Recommended"
                                : "Not Recommended") +
                              ": " +
                              comment["comments"][prop]
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </Box>
                );
              })}
            </List>
          </div>
        ) : (
          <div></div>
        )}

        {permission !== "client" &&
        process !== "past" &&
        showCommentSection === true ? (
          <div>
            <br />
            <Typography style={{ fontWeight: "bold" }}>Comments</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInputText
                name="comment"
                control={control}
                label="Add new comment"
                defaultValue=" "
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
                options={
                  permission === "deanfa" || permission === "registrar"
                    ? options_no_review
                    : options
                }
              />
              <Box display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <span className="spinner-grow spinner-grow-sm"></span>
                  )}
                  Send
                </Button>
              </Box>
            </form>
          </div>
        ) : (
          <div />
        )}

        {
        showReviewCommentSection === true ? (
          <div>
            <br />
            <Typography style={{ fontWeight: "bold" }}>Comments</Typography>
            <form onSubmit={handleSubmitReview(onSubmitReview)}>
              <FormInputText
                name="comment"
                control={controlReview}
                label="Add new comment"
                defaultValue=" "
                multiline={true}
                rows={4}
              />
              <Box display="flex" justifyContent="start">
                <Typography style={{ fontWeight: "bold" }}>Action</Typography>
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
                name="action"
                control={control}
                label="action"
                options={
                  est_review_options
                }
              />
              <Box display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <span className="spinner-grow spinner-grow-sm"></span>
                  )}
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
