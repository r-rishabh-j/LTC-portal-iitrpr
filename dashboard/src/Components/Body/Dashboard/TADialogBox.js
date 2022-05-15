import React from 'react'
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  DialogTitle,
  DialogContent,
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
import PersonIcon from "@material-ui/icons/Person";
import InfoIcon from "@material-ui/icons/Info";
import { useForm } from "react-hook-form";
import { FormInputText } from "../../Utilities/FormInputText";
import { FormInputRadio } from "../../Utilities/FormInputRadio";
import AccountsSectionTAForm from './Accounts/AccountsSectionTAForm';
const moment = require("moment");

const TADialogBox = ({request_id, showCommentSection, permission}) => {
  console.log("TA dialog permission", request_id)
    const [formInfo, setFormInfo] = useState({
      created_on: "",
      request_id: "",
      form_data: { accounts: {} },
      comments: {},
    });
    const [comments, setComments] = useState([]);
    const [commentObj, setCommentObj] = useState({});
    
    let array = [];
    const {
      handleSubmit,
      control,
      formState: { isSubmitting },
    } = useForm({});

     const [edit, setEdit] = useState(false);
     const setEditState = (state) => {
       setEdit(state);
     };

    function getVal(val, default_val) {
      if (val === undefined) {
        return default_val;
      } else {
        return val;
      }
    }

    function formatDate(date) {
      const d = moment(date).format("DD-MM-YYYY");
      return d;
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

    const options_hod = [
      {
        index: 1,
        label: "Recommend",
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

    useEffect(() => {
      const data = { request_id: request_id };
      axios({
        method: "post",
        url: "api/ta/getformdata",
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
            setCommentObj(commentObject);
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
      // if (edit) {
      //   alert(
      //     "Section Data was edited but not saved. Kindly save before submitting."
      //   );
      //   return;
      // }

      const req_data = {
        request_id: request_id,
        comment: data.comment,
        approval: data.approval,
      };
      return axios({
        method: "POST",
        url: "/api/ta/comment",
        data: req_data,
      })
        .then((response) => {
          // console.log("s", response.status);
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

    

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Box text-overflow="wrap">
          <DialogTitle>
            TA ID {formInfo.request_id}:{" "}
            {formInfo.form_data["name"] === undefined
              ? " "
              : formInfo.form_data["name"]}
            , {formInfo["email"] === undefined ? " " : formInfo["email"]}{" "}
          </DialogTitle>
        </Box>
        <Box margin="2vh 2vh 0 0" display="flex" justifyContent="right">
          {/* <ReactToPrint
            trigger={() => ( */}
          <Button variant="contained" color="primary">
            PDF
          </Button>
          {/* )}
            content={() => printComponentRef.current}
            pageStyle={"@page {size: A4; margin: 200mm !important}"}
          /> */}
          {/* <Button variant="contained" color="primary">
            
            PDF
          </Button> */}
          &nbsp;
          <Button
            variant="contained"
            color="primary"
            //onClick={handleAttachmentClick}
          >
            Attachment
          </Button>
          &nbsp;
          {/* {status === "advance_pending" || status === "approved" ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleOfficeOrderClick}
            >
              Office Order
            </Button>
          ) : (
            <></>
          )} */}
          <Button variant="contained" color="primary">
            Office Order
          </Button>
        </Box>
      </Box>
      <DialogContent>
        {/* <div style={{ display: "none" }}>
          <PrintForm ref={printComponentRef} request_id={request_id} />
        </div> */}
        {/* <DialogContentText>hello</DialogContentText> */}
        {/* <TextField label="Field" name = "Field" value = {formInfo.created_on}/> */}
        <Box
          sx={{
            // backgroundColor: "#eeeeee",
            padding: "1vh 1vh 1vh 1vh",
            borderRadius: "10px",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Budget Head"
                value={
                  formInfo.form_data["budget_head"] === undefined
                    ? " "
                    : formInfo.form_data["budget_head"]
                }
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Advance Drawn(₹)"
                value={
                  formInfo.form_data["advance"] === undefined
                    ? " "
                    : formInfo.form_data["advance"]
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
                label="Date"
                value={String(
                  formInfo.form_data["date"] === undefined
                    ? " "
                    : formatDate(formInfo.form_data["date"])
                ).slice(0, 10)}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Account No. (SBI/Any other)"
              value={
                formInfo.form_data["acc_no"] === undefined
                  ? " "
                  : formInfo.form_data["acc_no"]
              }
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {formInfo.form_data["items"] !== undefined ? (
            formInfo.form_data["items"].map((item, index) => {
              return (
                <div key={index}>
                  <Grid container spacing={1}>
                    <Grid item xs={2}>
                      <TextField
                        label="Departure Date"
                        value={item.dep_date}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Departure Time"
                        value={item.dep_time}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Departure Place"
                        value={item.dep_place}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Arrival Date"
                        value={item.arr_date}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Arrival Time"
                        value={item.arr_time}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Arrival Place"
                        value={item.arr_place}
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
                        value={item.mode}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Km for road/air/steamer"
                        value={item.km}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="Fare"
                        value={item.fare}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        label="PNR No. and/or Ticket No."
                        value={item.ticket}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Remarks"
                        value={item.remarks}
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
          <Typography>
            Indicate period and number of days if any, for which the claimant
            doesn’t want to claim DA (Leave or other reasons, In case of foreign
            Travel):
          </Typography>
          <Grid item xs={12}>
            <TextField
              label="Response"
              value={
                formInfo.form_data["no_da"] === undefined
                  ? " "
                  : formInfo.form_data["no_da"]
              }
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Typography>
            Any other expenses (Lodging, Boarding, Registration fee, Visa fee,
            Insurance, etc.):
          </Typography>
          {formInfo.form_data["expenses"] !== undefined ? (
            formInfo.form_data["expenses"].map((item, index) => {
              return (
                <div key={index}>
                  <Grid container spacing={4}>
                    <Grid item xs={2}>
                      <TextField
                        label="Details"
                        value={item.details}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Amount Paid"
                        value={item.amount}
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        label="Receipt Details"
                        value={item.receipt_details}
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
        </Box>

        {permission === "accounts" ? (
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
                // backgroundColor: "#eeeeee",
                padding: "1vh 1vh 1vh 1vh",
                borderRadius: "10px",
              }}
            >
              <AccountsSectionTAForm
                acc_data={
                  formInfo.form_data["accounts"] === undefined
                    ? {}
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
                // backgroundColor: "#eeeeee",
                padding: "1vh 1vh 1vh 1vh",
                borderRadius: "10px",
              }}
            >
              <Typography>A-1: Actual fares(A/T/R(etc.))</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    name="actual_fares_rate"
                    label="Rate"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"][
                            "actual_fares_rate"
                          ] === undefined
                        ? " "
                        : formInfo.form_data["accounts"]["actual_fares_rate"]
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
                    name="actual_fares_amount"
                    label="Amount"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"][
                            "actual_fares_amount"
                          ] === undefined
                        ? " "
                        : formInfo.form_data["accounts"]["actual_fares_amount"]
                    }
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <Typography>A-2: Road Mileage</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    name="mileage_rate"
                    label="Rate"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"]["mileage_rate"] ===
                          undefined
                        ? " "
                        : formInfo.form_data["accounts"]["mileage_rate"]
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
                    name="mileage_amount"
                    label="Amount"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"]["mileage_amount"] ===
                          undefined
                        ? " "
                        : formInfo.form_data["accounts"]["mileage_amount"]
                    }
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Typography>A-3: D.A</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    name="da_rate"
                    label="Rate"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"]["da_rate"] ===
                          undefined
                        ? " "
                        : formInfo.form_data["accounts"]["da_rate"]
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
                    name="da_amount"
                    label="Amount"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"]["da_amount"] ===
                          undefined
                        ? " "
                        : formInfo.form_data["accounts"]["da_amount"]
                    }
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Typography>A-4: Food expenses and hotel charges</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    name="food_rate"
                    label="Rate"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"]["food_rate"] ===
                          undefined
                        ? " "
                        : formInfo.form_data["accounts"]["food_rate"]
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
                    name="food_amount"
                    label="Amount"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"]["food_amount"] ===
                          undefined
                        ? " "
                        : formInfo.form_data["accounts"]["food_amount"]
                    }
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Typography>B: Other Expenses</Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    name="other_rate"
                    label="Rate"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"]["other_rate"] ===
                          undefined
                        ? " "
                        : formInfo.form_data["accounts"]["other_rate"]
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
                    name="other_amount"
                    label="Amount"
                    value={
                      formInfo.form_data["accounts"] === undefined
                        ? ""
                        : formInfo.form_data["accounts"]["other_amount"] ===
                          undefined
                        ? " "
                        : formInfo.form_data["accounts"]["other_amount"]
                    }
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              <Typography>C: Total Amount</Typography>
              <Grid item xs={8}>
                <TextField
                  name="total_amount"
                  label="Amount"
                  value={
                    formInfo.form_data["accounts"] === undefined
                      ? ""
                      : formInfo.form_data["accounts"]["total_amount"] ===
                        undefined
                      ? " "
                      : formInfo.form_data["accounts"]["total_amount"]
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Typography>D: Advance if any to be deducted</Typography>
              <Grid item xs={8}>
                <TextField
                  name="advance_deducted"
                  label="Amount"
                  value={
                    formInfo.form_data["accounts"] === undefined
                      ? ""
                      : formInfo.form_data["accounts"]["advance_deducted"] ===
                        undefined
                      ? " "
                      : formInfo.form_data["accounts"]["advance_deducted"]
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Typography>E: Net amount to be reimbursed (C-D)</Typography>
              <Grid item xs={8}>
                <TextField
                  name="net_amount"
                  label="Amount"
                  value={
                    formInfo.form_data["accounts"] === undefined
                      ? ""
                      : formInfo.form_data["accounts"]["net_amount"] ===
                        undefined
                      ? " "
                      : formInfo.form_data["accounts"]["net_amount"]
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Typography>
                E-1: To be reimbursed to the travel agent (if any)
              </Typography>
              <Grid item xs={8}>
                <TextField
                  name="agent_amount"
                  label="Amount"
                  value={
                    formInfo.form_data["accounts"] === undefined
                      ? ""
                      : formInfo.form_data["accounts"]["agent_amount"] ===
                        undefined
                      ? " "
                      : formInfo.form_data["accounts"]["agent_amount"]
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Typography>E-2: To the claimant</Typography>
              <Grid item xs={8}>
                <TextField
                  name="claimant_amount"
                  label="Amount"
                  value={
                    formInfo.form_data["accounts"] === undefined
                      ? ""
                      : formInfo.form_data["accounts"]["claimant_amount"] ===
                        undefined
                      ? " "
                      : formInfo.form_data["accounts"]["claimant_amount"]
                  }
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Typography>Passed for payment of:</Typography>

              <TextField
                name="passed_amount"
                label="Amount"
                value={
                  formInfo.form_data["accounts"] === undefined
                    ? ""
                    : formInfo.form_data["accounts"]["passed_amount"] ===
                      undefined
                    ? " "
                    : formInfo.form_data["accounts"]["passed_amount"]
                }
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
              />

              <Typography>Debitable to:</Typography>

              <TextField
                name="debit_to"
                label="Name"
                value={
                  formInfo.form_data["accounts"] === undefined
                    ? ""
                    : formInfo.form_data["accounts"]["debit_to"] === undefined
                    ? " "
                    : formInfo.form_data["accounts"]["debit_to"]
                }
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                name="budget_head"
                label="Budget Head"
                value={
                  formInfo.form_data["accounts"] === undefined
                    ? ""
                    : formInfo.form_data["accounts"]["budget_head"] ===
                      undefined
                    ? " "
                    : formInfo.form_data["accounts"]["budget_head"]
                }
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="project"
                label="Project/ Institute/ Any other"
                value={
                  formInfo.form_data["accounts"] === undefined
                    ? ""
                    : formInfo.form_data["accounts"]["project"] === undefined
                    ? " "
                    : formInfo.form_data["accounts"]["project"]
                }
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{ shrink: true }}
              />
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

        {showCommentSection === true ? (
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
                required={true}
                rows={4}
              />
              <Box display="flex" justifyContent="start">
                <Typography style={{ fontWeight: "bold" }}>Approve</Typography>
                {/* <Tooltip
                  title={
                    <div style={{ fontSize: "1.5em" }}>
                      Section Heads must ensure that the section specific
                      information is filled before sending the form forward
                    </div>
                  }
                >
                  <InfoIcon />
                </Tooltip> */}
              </Box>
              <FormInputRadio
                name="approval"
                control={control}
                label="Approve"
                options={
                  permission === "deanfa" || permission === "registrar"
                    ? options_no_review
                    : options_hod
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
}

export default TADialogBox