import React from 'react'
import { useState, useEffect } from 'react'
import {
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Typography,
  Button,
  Box,
  Tooltip,
} from "@material-ui/core";
import axios from "axios"
import ReviewUserForm from './ReviewUserForm';


/**
 * 
 * @description: User review 
 * @returns 
 */


const ReviewBox = ({request_id}) => {

    const [formInfo, setFormInfo] = useState({ request_id: "", form_data: {} });
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

  return (
      <>
    <DialogTitle>LTC Application ID {formInfo.request_id}</DialogTitle>
    <DialogContent>
        <ReviewUserForm user_data = {formInfo.form_data} request_id={request_id}/>
    </DialogContent>
    </>

  )
}

export default ReviewBox