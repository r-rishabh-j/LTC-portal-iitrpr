import React from "react";
import { useState, useEffect, forwardRef } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Grid,
  TextField,
} from "@material-ui/core";
import axios from "axios";

const moment = require("moment");


/**
 * 
 * @description: Print TA form to pdf 
 * @returns 
 */


function formatDate(date) {
  const d = moment(date).format("DD-MM-YYYY");
  return d;
}

const PrintTAForm = forwardRef((props, ref) => {
  console.log("print form for", props.request_id);
  const [formInfo, setFormInfo] = useState({
    created_on: "",
    request_id: "",
    form: { establishment: {} },
    comments: {},
  });
  useEffect(() => {
    const data = { request_id: props.request_id };
    axios({
      method: "post",
      url: "api/ta/print-form",
      data: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        console.log("print preview", response.data.data);
        setFormInfo(response.data.data);
        console.log(response.data.data.signatures.user);
        console.log("sign", response.data.data.signatures.establishment);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          alert("Form not found");
        }
      });
  }, []);
  return (
    <div ref={ref}>
      <Box display="flex" justifyContent="center">
        <img src={require("./iitrpr_logo.png")} width="100px" />
        <center>
          <Typography variant="h5">
            भारतीय प्रौद्योगिकी संस्थान रोपड़
          </Typography>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            INDIAN INSTITUTE OF TECHNOLOGY ROPAR
          </Typography>
        </center>
      </Box>
      <center>
        <Typography variant="h6">
          यात्रा भत्ता प्रगतपगूति/ गनपटारा प्रपत्र
        </Typography>
        <Typography variant="body1">
          TRAVELLING ALLOWANCE REIMBURSEMENT/SETTLEMENT FORM
        </Typography>
      </center>
      <Box
        sx={{
          padding: "1vh 1vh 1vh 1vh",
          margin: "2vh 0 0 0",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              value={
                formInfo.form["name"] === undefined
                  ? " "
                  : formInfo.form["name"]
              }
              // value={getVal(formInfo.form["name"], " ")}
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
                formInfo.form["emp_code"] === undefined
                  ? " "
                  : formInfo.form["emp_code"]
              }
              // value={getVal(formInfo.form["emp_code"], " ")}
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
                formInfo.form["designation"] === undefined
                  ? " "
                  : formInfo.form["designation"]
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
              // value={getVal(formInfo.form["department"], " ")}
              value={
                formInfo.form["department"] === undefined
                  ? " "
                  : formInfo.form["department"]
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
                formInfo.form["band_pay"] === undefined
                  ? " "
                  : formInfo.form["band_pay"]
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
                formInfo.form["budget_head"] === undefined
                  ? " "
                  : formInfo.form["budget_head"]
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
                formInfo.form["advance"] === undefined
                  ? " "
                  : formInfo.form["advance"]
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
                formInfo.form["date"] === undefined
                  ? " "
                  : formatDate(formInfo.form["date"])
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
              formInfo.form["acc_no"] === undefined
                ? " "
                : formInfo.form["acc_no"]
            }
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Box style={{ margin: "3vh 0 0 0" }}>
          <Typography variant="body2" style={{ textDecoration: "underline" }}>
            यात्रा भत्ता प्रगतपगूतिगबल तैयार करनेकेगलए अनदुेश
          </Typography>
          <Typography variant="body2" style={{ textDecoration: "underline" }}>
            INSTRUCTION FOR PREPARING TRAVELLING ALLOWANCE REIMBURSEENT BILLS :
          </Typography>
          <Box syle={{ margin: "2vh 0 0 0" }}>
            <ol>
              <Typography variant="body2">
                <li>
                  Claim must be properly filled in and submitted within 15 days
                  of completion of journey. Failure to do so may entail recovery
                  of advance, drawn if any, in single instalment, from the
                  salary.
                </li>
                <li>
                  Money Receipts/Ticket numbers/PNR (in case of travel by rail)
                  copy of paper ticket or e-ticket with boarding pass (in case
                  of travel by air) should be furnished along with T.A. bill.
                </li>
                <li>
                  Hotels bills and Food bills should invariably be enclosed.
                </li>
                <li>
                  All contingent expenses claimed for which bills are not
                  available should be self-certified.
                </li>
              </Typography>
            </ol>
          </Box>
        </Box>
        <Typography>
          Travel between Cities/Countries including local to and fro
          Airport/Railway station etc.
        </Typography>
        {formInfo.form["items"] !== undefined &&
        formInfo.form["items"].length > 0 ? (
          formInfo.form["items"].map((item, index) => {
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
          <div>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <TextField
                  label="Departure Date"
                  value={""}
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
                  value={""}
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
                  value={""}
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
                  value={""}
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
                  value={""}
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
                  value={""}
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
                  value={""}
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
                  value={""}
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
                  value={""}
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
                  value={""}
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
                  value={""}
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
        <Typography>
          Indicate period and number of days if any, for which the claimant
          doesn’t want to claim DA (Leave or other reasons, In case of foreign
          Travel):
        </Typography>
        <Grid item xs={12}>
          <TextField
            label="Response"
            value={
              formInfo.form["no_da"] === undefined
                ? " "
                : formInfo.form["no_da"]
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
        {formInfo.form["expenses"] !== undefined ? (
          formInfo.form["expenses"].map((item, index) => {
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
          <div>
            <Grid container spacing={4}>
              <Grid item xs={2}>
                <TextField
                  label="Details"
                  value={""}
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
                  value={""}
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
                  value={""}
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
        <Box style={{ margin: "2vh 0 0 0" }}>
          <ul>
            <Typography variant="body2" style={{ fontWeight: "bold" }}>
              Certified that:-{" "}
            </Typography>
            <Typography variant="body2">
              <li>
                All claims mentioned in this form correspond to actual
                expenditure incurred by me for which no reimbursement/claims
                have been made from any other source (Govt./Private/Others)
              </li>
              <li>
                I was not provided with any free
                boarding/lodging/conveyance/registration fee waiver/travel
                coupons for which claim has been made.
              </li>
            </Typography>
          </ul>
        </Box>
        <Box
         display="flex"
         justifyContent="right"
        >
        {formInfo.signatures !== undefined &&
          formInfo.signatures.user !== undefined &&
          formInfo.signatures.user !== null ? (
            <img
              src={`data:image/jpeg;base64,${formInfo.signatures.user.slice(2, -1)}`}
              width="120px"
            />
          ) : (
            // <div width="175px"/>
            <Box minWidth={"120px"}></Box>

          )}
        </Box>
        <Box display="flex" justifyContent="right">
          <Typography ariant="body2">Signature of the Applicant</Typography>
        </Box>
        <Box
         display="flex"
         justifyContent="left"
        >
        {formInfo.signatures !== undefined &&
          formInfo.signatures.section_head !== undefined &&
          formInfo.signatures.section_head !== null ? (
            <img
              src={`data:image/jpeg;base64,${formInfo.signatures.section_head.slice(2, -1)}`}
              width="120px"
            />
          ) : (
            // <div width="175px"/>
            <Box minWidth={"120px"}></Box>

          )}
        </Box>
        <Typography>Journey verified and forwarded.</Typography>
        <Typography style={{ margin: "2vh 0 0 0" }}>
          Signature of HOD/PI
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          style={{ margin: "3vh 0 0 0" }}
        >
          <Typography style={{ fontWeight: "bold" }}>
            (For use by Accounts Section)
          </Typography>
        </Box>
        <Typography>
          Before filling in Amount column, separate Sheet to be prepared and
          checked by the concerned Officials/Officers. There should be no
          cutting and overwriting in the figures.
        </Typography>
        <Typography>A-1: Actual fares(A/T/R(etc.))</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              name="actual_fares_rate"
              label="Rate"
              value={
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["actual_fares_rate"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["actual_fares_rate"]
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
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["actual_fares_amount"] ===
                    undefined
                  ? " "
                  : formInfo.form["accounts"]["actual_fares_amount"]
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
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["mileage_rate"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["mileage_rate"]
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
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["mileage_amount"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["mileage_amount"]
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
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["da_rate"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["da_rate"]
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
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["da_amount"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["da_amount"]
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
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["food_rate"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["food_rate"]
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
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["food_amount"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["food_amount"]
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
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["other_rate"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["other_rate"]
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
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["other_amount"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["other_amount"]
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
              formInfo.form["accounts"] === undefined
                ? ""
                : formInfo.form["accounts"]["total_amount"] === undefined
                ? " "
                : formInfo.form["accounts"]["total_amount"]
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
              formInfo.form["accounts"] === undefined
                ? ""
                : formInfo.form["accounts"]["advance_deducted"] === undefined
                ? " "
                : formInfo.form["accounts"]["advance_deducted"]
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
              formInfo.form["accounts"] === undefined
                ? ""
                : formInfo.form["accounts"]["net_amount"] === undefined
                ? " "
                : formInfo.form["accounts"]["net_amount"]
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
              formInfo.form["accounts"] === undefined
                ? ""
                : formInfo.form["accounts"]["agent_amount"] === undefined
                ? " "
                : formInfo.form["accounts"]["agent_amount"]
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
              formInfo.form["accounts"] === undefined
                ? ""
                : formInfo.form["accounts"]["claimant_amount"] === undefined
                ? " "
                : formInfo.form["accounts"]["claimant_amount"]
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
            formInfo.form["accounts"] === undefined
              ? ""
              : formInfo.form["accounts"]["passed_amount"] === undefined
              ? " "
              : formInfo.form["accounts"]["passed_amount"]
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
            formInfo.form["accounts"] === undefined
              ? ""
              : formInfo.form["accounts"]["debit_to"] === undefined
              ? " "
              : formInfo.form["accounts"]["debit_to"]
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
            formInfo.form["accounts"] === undefined
              ? ""
              : formInfo.form["accounts"]["budget_head"] === undefined
              ? " "
              : formInfo.form["accounts"]["budget_head"]
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
            formInfo.form["accounts"] === undefined
              ? ""
              : formInfo.form["accounts"]["project"] === undefined
              ? " "
              : formInfo.form["accounts"]["project"]
          }
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{ shrink: true }}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ margin: "2vh 0 0 0" }}
        >
          {formInfo.signatures !== undefined &&
          formInfo.signatures.audit !== undefined &&
          formInfo.signatures.audit !== null &&
          formInfo.signatures.audit[
            "Assistant Audit Officer"
          ] !== null &&
          formInfo.signatures.audit[
            "Assistant Audit Officer"
          ] !== undefined ? (
            <img
              src={`data:image/jpeg;base64,${formInfo.signatures.audit[
                "Assistant Audit Officer"
              ].slice(2, -1)}`}
              width="120px"
            />
          ) : (
            <Box minWidth={"120px"}></Box>
            // <div width="175px"/>
          )}
          {formInfo.signatures !== undefined &&
          formInfo.signatures.audit !== undefined &&
          formInfo.signatures.audit !== null &&
          formInfo.signatures.audit[
            "Senior Audit Officer"
          ] !== null &&
          formInfo.signatures.audit[
            "Senior Audit Officer"
          ] !== undefined ? (
            <img
              src={`data:image/jpeg;base64,${formInfo.signatures.audit[
                "Senior Audit Officer"
              ].slice(2, -1)}`}
              width="120px"
            />
          ) : (
            // <div width="175px"/>
            <Box minWidth={"120px"}></Box>
          )}
          {formInfo.signatures !== undefined &&
          formInfo.signatures.establishment !== undefined &&
          formInfo.signatures.establishment !== null &&
          formInfo.signatures.establishment[
            "Establishment Assistant Registrar"
          ] !== null &&
          formInfo.signatures.establishment[
            "Establishment Assistant Registrar"
          ] !== undefined ? (
            <img
              src={`data:image/jpeg;base64,${formInfo.signatures.establishment[
                "Establishment Assistant Registrar"
              ].slice(2, -1)}`}
              width="120px"
            />
          ) : (
            // <div width="175px"/>
            <Box minWidth={"120px"}></Box>
          )}
          {formInfo.signatures !== undefined &&
          formInfo.signatures.establishment !== undefined &&
          formInfo.signatures.establishment !== null &&
          formInfo.signatures.establishment[
            "Establishment Deputy Registrar"
          ] !== null &&
          formInfo.signatures.establishment[
            "Establishment Deputy Registrar"
          ] !== undefined ? (
            <img
              src={`data:image/jpeg;base64,${formInfo.signatures.establishment[
                "Establishment Deputy Registrar"
              ].slice(2, -1)}`}
              width="120px"
            />
          ) : (
            // <div width="175px"/>
            <Box minWidth={"120px"}></Box>

          )}
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          style={{ margin: "2vh 0 0 0" }}
        >
          
          <Typography variant="body2" >
            Dealing Assistant
          </Typography>
          <Typography variant="body2" >
            Senior A.O.
          </Typography>
          <Typography variant="body2" >
            AR (A/Cs)
          </Typography>
          <Typography variant="body2">
            Dy Registrar
          </Typography>
        </Box>
        <Box
         display="flex"
         justifyContent="left"
         margin="5vh 0 0 0"
        >
        {formInfo.signatures !== undefined &&
          formInfo.signatures.registrar !== undefined &&
          formInfo.signatures.registrar !== null &&
          formInfo.signatures.registrar[
            "Registrar"
          ] !== null &&
          formInfo.signatures.registrar[
            "Registrar"
          ] !== undefined ? (
            <img
              src={`data:image/jpeg;base64,${formInfo.signatures.registrar[
                "Registrar"
              ].slice(2, -1)}`}
              width="120px"
            />
          ) : (
            // <div width="175px"/>
            <Box minWidth={"120px"}></Box>

          )}
        </Box>
        <Typography style={{margin: "2vh 0 0 0", textDecoration: "underline"}}>Registrar</Typography>
      </Box>
    </div>
  );
});

export default PrintTAForm;
