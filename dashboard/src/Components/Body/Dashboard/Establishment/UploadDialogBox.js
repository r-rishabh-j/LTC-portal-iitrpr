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


const UploadDialogBox = ({ request_id }) => {
  const [file, setFile] = useState(null);

  function onUpload(file) {
    console.log('o', file);
    setFile(file);
  }

  function onClick() {
    console.log('f', file);
    if (file.length == 0) {
      alert('No file uploaded!');
      return;
    }
    const formData = new FormData();
    formData.append('request_id', request_id);
    formData.append('office_order', file);
    console.log(formData);
    axios({
      method: 'POST',
      url: '/api/upload-office-order',
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
      <form>
        <DialogTitle>Upload Office Order</DialogTitle>
        <DialogContent><DropzoneArea
          filesLimit={1}
          onChange={onUpload}
        />
          <Box display='flex' justifyContent='center' marginTop={'3vh'}>
            <Button onClick={onClick} variant='contained' color="primary">UPLOAD</Button>
          </Box>
        </DialogContent>
      </form>
    </>
  )
}

export default UploadDialogBox