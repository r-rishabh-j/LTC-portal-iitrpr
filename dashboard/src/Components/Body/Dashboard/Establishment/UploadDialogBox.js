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
import { DropzoneArea } from 'material-ui-dropzone';
import "bootstrap/dist/css/bootstrap.min.css";
import { useForm, Controller, useFieldArray, register } from "react-hook-form";


const UploadDialogBox = ({ request_id, api }) => {
  const [file, setFile] = useState(null);

  const { handleSubmit, control, register, formState: { isSubmitting } } = useForm();

  function onUpload(file) {
    setFile(file[0]);
  }

  async function onClick() {
    if (file === undefined || file.length === 0) {
      alert('No file uploaded!');
      return;
    }

    const formData = new FormData();
    formData.append('request_id', request_id);
    formData.append('office_order', file);
    console.log(formData);
    return axios({
      method: 'POST',
      url: api,
      data: formData,
    }).then((response) => {
      alert('Office Order Uploaded!');
      window.location.reload();
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
        alert('Error. Please try logging in again');
      }
    })
  }
  return (
    <>
      <form onSubmit={handleSubmit(onClick)}>
        <DialogTitle>Upload Office Order</DialogTitle>
        <DialogContent><DropzoneArea
          filesLimit={1}
          onChange={onUpload}
          acceptedFiles={['.pdf', '.zip']}
        />
          <Box display='flex' justifyContent='center' marginTop={'3vh'}>
            <Button type="submit" variant='contained' color="primary" disabled={isSubmitting}>
              {isSubmitting && (
                <span className="spinner-grow spinner-grow-sm"></span>
              )}
              UPLOAD</Button>
          </Box>
        </DialogContent>
      </form>
    </>
  )
}

export default UploadDialogBox