import { List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { Box } from "@mui/system";
import React from "react";
import { useState, useEffect, forwardRef } from "react";
import axios from "axios";
import { Grid, TextField } from "@material-ui/core";

const moment = require("moment");

/**
 * 
 * @description: Print LTC form to PDF 
 * @returns 
 */


function formatDate(date) {
  const d = moment(date).format("DD-MM-YYYY");
  return d;
}

const PrintForm = forwardRef((props, ref) => {
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
      url: "api/print-form",
      data: JSON.stringify(data),
      headers: { "Content-type": "application/json" },
    })
      .then((response) => {
        console.log("print preview", response.data.data);
        setFormInfo(response.data.data);
        console.log(response.data.data.signatures.user);
        console.log('sign', response.data.data.signatures.establishment);
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
      <Box display="flex" justifyContent="space-between">
        <Box>
          <img src={require("./iitrpr_logo.png")} width="100px" />
        </Box>
        <Box>
          <Box display="flex" justifyContent="right">
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              भारतीय प्रौद्योगिकी संस्थान रोपड़
            </Typography>
          </Box>
          <Box display="flex" justifyContent="right">
            <Typography variant="h5" style={{ fontWeight: "bold" }}>
              INDIAN INSTITUTE OF TECHNOLOGY ROPAR
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Typography style={{ fontWeight: "bold" }}>
          APPLICATION FOR LEAVE TRAVEL CONCESSION
        </Typography>
      </Box>
      <Box
        sx={{
          padding: "1vh 1vh 1vh 1vh",
          //   border: 1,
          //   borderColor: "grey.500",
          scale: "0.6",
        }}
      >
        <Grid item xs={12}>
          <TextField
            label="Name"
            value={
              formInfo.form["name"] === undefined ? " " : formInfo.form["name"]
            }
            // value={getVal(formInfo.form["name"], " ")}
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
          <Grid item xs={4}>
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
          <Grid item xs={8}>
            <TextField
              label="Date of entering the Central Government
Service/Date of Joining with IIT Ropar"
              value={String(
                formInfo.form["joining_date"] === undefined
                  ? " "
                  : formatDate(formInfo.form["joining_date"])
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
            formInfo.form["band_pay"] === undefined
              ? " "
              : formInfo.form["band_pay"]
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
            formInfo.form["nature"] === undefined
              ? " "
              : formInfo.form["nature"]
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
                formInfo.form["nature_from"] === undefined
                  ? " "
                  : formatDate(formInfo.form["nature_from"])
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
                formInfo.form["nature_to"] === undefined
                  ? " "
                  : formatDate(formInfo.form["nature_to"])
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
                formInfo.form["num_days"] === undefined
                  ? " "
                  : formInfo.form["num_days"]
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
                formInfo.form["prefix_from"] === undefined
                  ? " "
                  : formatDate(formInfo.form["prefix_from"])
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
                formInfo.form["prefix_to"] === undefined
                  ? " "
                  : formatDate(formInfo.form["prefix_to"])
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
                formInfo.form["suffix_from"] === undefined
                  ? " "
                  : formatDate(formInfo.form["suffix_from"])
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
                formInfo.form["suffix_to"] === undefined
                  ? " "
                  : formatDate(formInfo.form["suffix_to"])
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
            formInfo.form["spouse_is_employed"] === undefined
              ? " "
              : formInfo.form["spouse_is_employed"]
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
                formInfo.form["self_date_outward"] === undefined
                  ? " "
                  : formatDate(formInfo.form["self_date_outward"])
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
                formInfo.form["self_date_inward"] === undefined
                  ? " "
                  : formatDate(formInfo.form["self_date_inward"])
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
                formInfo.form["family_date_outward"] === undefined
                  ? " "
                  : formatDate(formInfo.form["family_date_outward"])
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
                formInfo.form["family_date_inward"] === undefined
                  ? " "
                  : formatDate(formInfo.form["family_date_inward"])
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
            formInfo.form["home_town"] === undefined
              ? " "
              : formInfo.form["home_town"]
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
            formInfo.form["ltc_nature"] === undefined
              ? " "
              : formInfo.form["ltc_nature"]
          }
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          label="If, anywhere in India, the place to be visited"
          value={
            formInfo.form["place"] === undefined ? " " : formInfo.form["place"]
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
                formInfo.form["est_fare"] === undefined
                  ? " "
                  : formInfo.form["est_fare"]
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

        {formInfo.form["dependents"] !== undefined ? (
          formInfo.form["dependents"].map((item, index) => {
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
                formInfo.form["adv_is_required"] === undefined
                  ? " "
                  : formInfo.form["adv_is_required"]
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
                formInfo.form["encashment_is_required"] === undefined
                  ? " "
                  : formInfo.form["encashment_is_required"]
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
            formInfo.form["encashment_days"] === undefined
              ? " "
              : formInfo.form["encashment_days"]
          }
          fullWidth
          InputProps={{
            readOnly: true,
          }}
        />
      </Box>
      <Box style={{ margin: "1vh 0 0 0" }}>
        <Typography variant="body2">
          I undertake (a) to produce the tickets for the journey within ten days
          of receipt of the advance (b) to refund the entire advance in lump
          sum, in the event of cancellation of the journey within two months
          from the date of drawl of the advance or failure to produce the
          tickets within 10 days of drawl the advance (c) to travel by
          Air/Rail/Road as per my entitlement and as per GOI LTC rules or
          specific rules as adopted by the Institute (d) to refund the excess
          advance drawn, if any, within 7 working days of completion of the
          journey (e) to submit necessary bills, money receipts and other
          documents** as required under the Rules and Regulations of the
          Institute within one month (where advance is drawn) / three months
          (where no advance is drawn), from the date of completion of the
          journey. I will communicate to the competent authority about any
          change of declared place of visit or change of dates before the
          commencement of the journey.
        </Typography>
        <br />
        <ol>
          <Typography variant="body2" style={{ fontWeight: "bold" }}>
            Certified that:-{" "}
          </Typography>
          <Typography variant="body2">
            <li>
              The information, as given above is true to the best of my
              knowledge and belief; and{" "}
            </li>
            <li>
              My spouse is not employed in Government service / my spouse is
              employed in government service and the concession has not been
              availed of by him/her separately of himself/herself or for any of
              the family members for the &nbsp;
              {formInfo.form["establishment"] === undefined
                ? ""
                : formInfo.form["establishment"]["est_data_block_year"] ===
                  undefined
                  ? " "
                  : formInfo.form["establishment"]["est_data_block_year"]}
              &nbsp; block year.
            </li>
          </Typography>
        </ol>
      </Box>
      <Box
        // display="flex" justifyContent="right"
        display="flex"
        justifyContent="space-between"
        style={{ margin: "0 0 0 0" }}

      >
        {/* <img src=`data:image/png;base64,${formInfo.sig}` width="100px" /> */}
        {formInfo.signatures !== undefined &&
          formInfo.signatures.section_head !== undefined &&
          formInfo.signatures.section_head !== null ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures["section_head"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>
        )}
        {formInfo.signatures !== undefined &&
          formInfo.signatures.user !== undefined &&
          formInfo.signatures.user !== null ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures["user"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>
        )}
      </Box>
      <Box display="flex" justifyContent="left">
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Section Head
        </Typography>
      </Box>
      <Box style={{ margin: "0 0 0 0" }}>
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Forwarded please.
        </Typography>
      </Box>
      <Box display="flex" justifyContent="right">
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Signature of the Applicant
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        style={{ margin: "4vh 0 0 0" }}
      >
        <Typography style={{ fontWeight: "bold" }} variant="body1">
          FOR USE OF ESTABLISHMENT SECTION
        </Typography>
      </Box>
      <Box
        style={{
          padding: "1vh 1vh 1vh 1vh",
        }}
      >
        <Typography>
          Fresh Recruit i.e. joining Govt. Service after 01.09.2008 /otherwise,
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <TextField
              name="est_data_joining_date"
              label="Date of joining"
              value={
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"]["est_data_joining_date"] ===
                    undefined
                    ? " "
                    : formatDate(
                      formInfo.form["establishment"]["est_data_joining_date"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"]["est_data_block_year"] ===
                    undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_block_year"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"]["est_data_nature_last"] ===
                    undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_nature_last"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_nature_current"
                  ] === undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_nature_current"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_period_last_from"
                  ] === undefined
                    ? " "
                    : formatDate(formInfo.form["establishment"]["est_data_period_last_from"])
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_period_last_to"
                  ] === undefined
                    ? " "
                    : formatDate(formInfo.form["establishment"]["est_data_period_last_to"])
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_period_current_from"
                  ] === undefined
                    ? " "
                    : formatDate(formInfo.form["establishment"][
                    "est_data_period_current_from"
                    ])
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_period_current_to"
                  ] === undefined
                    ? " "
                    : formatDate(formInfo.form["establishment"]["est_data_period_current_to"])
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"]["est_data_last_ltc_for"] ===
                    undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_last_ltc_for"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_current_ltc_for"
                  ] === undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_current_ltc_for"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"]["est_data_last_ltc_days"] ===
                    undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_last_ltc_days"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_current_ltc_days"
                  ] === undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_current_ltc_days"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_last_earned_leave_on"
                  ] === undefined
                    ? " "
                    : formatDate(formInfo.form["establishment"][
                    "est_data_last_earned_leave_on"
                    ])
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_current_earned_leave_on"
                  ] === undefined
                    ? " "
                    : formatDate(formInfo.form["establishment"][
                    "est_data_current_earned_leave_on"
                    ])
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"]["est_data_last_balance"] ===
                    undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_last_balance"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_current_balance"
                  ] === undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_current_balance"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_last_encashment_adm"
                  ] === undefined
                    ? " "
                    : formInfo.form["establishment"][
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_current_encashment_adm"
                  ] === undefined
                    ? " "
                    : formInfo.form["establishment"][
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"]["est_data_last_nature"] ===
                    undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_last_nature"]
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
                formInfo.form["establishment"] === undefined
                  ? ""
                  : formInfo.form["establishment"][
                    "est_data_current_nature"
                  ] === undefined
                    ? " "
                    : formInfo.form["establishment"]["est_data_current_nature"]
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
      <Box style={{ margin: "1vh 0 0 0" }}>
        <Typography variant="body2">
          May consider and approve the above LTC (Home Town/Anywhere in India),
          Leave and Encashment of Leave.
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "0 0 0 0" }}
      >
        {formInfo.signatures !== undefined &&
          formInfo.signatures.establishment !== undefined &&
          formInfo.signatures.establishment !== null && formInfo.signatures.establishment["Establishment Junior Assistant"] !== null && formInfo.signatures.establishment["Establishment Junior Assistant"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.establishment["Establishment Junior Assistant"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>
        )}
        {formInfo.signatures !== undefined &&
          formInfo.signatures.establishment !== undefined &&
          formInfo.signatures.establishment !== null && formInfo.signatures.establishment["Establishment Junior Superintendent"] !== null && formInfo.signatures.establishment["Establishment Junior Superintendent"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.establishment["Establishment Junior Superintendent"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>

        )}
        {formInfo.signatures !== undefined &&
          formInfo.signatures.establishment !== undefined &&
          formInfo.signatures.establishment !== null && formInfo.signatures.establishment["Establishment Assistant Registrar"] !== null && formInfo.signatures.establishment["Establishment Assistant Registrar"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.establishment["Establishment Assistant Registrar"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>
        )}
        {formInfo.signatures !== undefined &&
          formInfo.signatures.establishment !== undefined &&
          formInfo.signatures.establishment !== null && formInfo.signatures.establishment["Establishment Deputy Registrar"] !== null && formInfo.signatures.establishment["Establishment Deputy Registrar"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.establishment["Establishment Deputy Registrar"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "2vh 0 0 0" }}
      >
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Junior Assistant
        </Typography>
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Junior Superintendent
        </Typography>
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Assistant Registrar
        </Typography>
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Deputy Registrar
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        style={{ margin: "4vh 0 0 0" }}
      >
        <Typography style={{ fontWeight: "bold" }} variant="body1">
          FOR USE OF AUDIT SECTION
        </Typography>
      </Box>
      <Box
        style={{
          padding: "0vh 1vh 1vh 0vh",
        }}
        sx={{ border: 1 }}
      >
        {
          formInfo.comments !== undefined && formInfo.comments !== null &&
            formInfo.comments.audit !== undefined && formInfo.comments.audit !== null
            ?
            (<List>
              {
                Object.keys(formInfo.comments.audit[formInfo.comments.audit.length - 1]['comments']).map((prop, i) => {
                  return formInfo.comments.audit[formInfo.comments.audit.length - 1]['approved'][prop] !== null ? (<ListItem key={i}>
                    <ListItemText
                      primary={formInfo.comments.audit[formInfo.comments.audit.length - 1]['comments'][prop]}>
                    </ListItemText>
                  </ListItem>) : <div key={i}></div>
                })}
            </List>)
            : <div></div>
        }
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "0 0 0 0" }}
      >
        {formInfo.signatures !== undefined &&
          formInfo.signatures.audit !== undefined &&
          formInfo.signatures.audit !== null && formInfo.signatures.audit["Assistant Audit Officer"] !== null && formInfo.signatures.audit["Assistant Audit Officer"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.audit["Assistant Audit Officer"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>
        )}
        {formInfo.signatures !== undefined &&
          formInfo.signatures.audit !== undefined &&
          formInfo.signatures.audit !== null && formInfo.signatures.audit["Senior Audit Officer"] !== null && formInfo.signatures.audit["Senior Audit Officer"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.audit["Senior Audit Officer"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>
          
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "2vh 0 0 0" }}
      >
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Assistant Audit Officer
        </Typography>
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Senior Audit Officer
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        style={{ margin: "4vh 0 0 0" }}
      >
        <Typography style={{ fontWeight: "bold" }} variant="body1">
          FOR USE OF ACCOUNTS SECTION
        </Typography>
      </Box>

      <Box
        style={{
          padding: "1vh 1vh 1vh 1vh",
        }}
      >
        {formInfo.form["accounts"] !== undefined &&
          formInfo.form["accounts"]["entities"] !== undefined ? (
          formInfo.form["accounts"]["entities"].map((item, index) => {
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
          })
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
                formInfo.form["accounts"] === undefined
                  ? ""
                  : formInfo.form["accounts"]["total"] === undefined
                    ? " "
                    : formInfo.form["accounts"]["total"]
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
              formInfo.form["accounts"] === undefined
                ? ""
                : formInfo.form["accounts"]["adv_admissible"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["adv_admissible"]
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
              formInfo.form["accounts"] === undefined
                ? ""
                : formInfo.form["accounts"]["passed"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["passed"]
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
              formInfo.form["accounts"] === undefined
                ? ""
                : formInfo.form["accounts"]["in_words"] === undefined
                  ? " "
                  : formInfo.form["accounts"]["in_words"]
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
          </Typography>
        </Grid>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "0 0 0 0" }}
      >
        {formInfo.signatures !== undefined &&
          formInfo.signatures.accounts !== undefined &&
          formInfo.signatures.accounts["Junior Accountant"] !== null && formInfo.signatures.accounts["Junior Accountant"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.accounts["Junior Accountant"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>
        )}
        {formInfo.signatures !== undefined &&
          formInfo.signatures.accounts !== undefined &&
          formInfo.signatures.accounts["Junior Accounts Officer"] !== null && formInfo.signatures.accounts["Junior Accounts Officer"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.accounts["Junior Accounts Officer"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>

        )}
        {formInfo.signatures !== undefined &&
          formInfo.signatures.accounts !== undefined &&
          formInfo.signatures.accounts["Accounts Assistant Registrar"] !== null && formInfo.signatures.accounts["Accounts Assistant Registrar"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.accounts["Accounts Assistant Registrar"].slice(
              2,
              -1
            )}`}
            width="175px"
          />
        ) : (
          <div />
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "2vh 0 0 0" }}
      >
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Junior Accountant
        </Typography>
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Junior Accounts Officer
        </Typography>
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Assistant Registrar
        </Typography>
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Deputy Registrar
        </Typography>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "0 0 0 0" }}
      >
        {formInfo.signatures !== undefined &&
          formInfo.signatures.registrar !== undefined &&
          formInfo.signatures.registrar !== null && formInfo.signatures.registrar["Registrar"] !== null && formInfo.signatures.registrar["Registrar"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.registrar["Registrar"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>

        )}
        {formInfo.signatures !== undefined &&
          formInfo.signatures.deanfa !== undefined &&
          formInfo.signatures.deanfa !== null && formInfo.signatures.deanfa["Dean FA"] !== null && formInfo.signatures.deanfa["Dean FA"] !== undefined ? (
          <img
            src={`data:image/jpeg;base64,${formInfo.signatures.deanfa["Dean FA"].slice(
              2,
              -1
            )}`}
            width="120px"
          />
        ) : (
          <Box width="120px"></Box>

        )}
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        style={{ margin: "2vh 0 0 0" }}
      >
        <Typography variant="body2">Recommended & Forwarded</Typography>
        <Typography variant="body2">Approved/Not Approved</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Registrar
        </Typography>
        <Typography variant="body2" style={{ fontWeight: "bold" }}>
          Dean (FA&A)
        </Typography>
      </Box>
    </div>
  );
});

export default PrintForm;
