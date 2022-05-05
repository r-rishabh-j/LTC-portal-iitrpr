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
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";

const SignatureUploadDialog = ({ profile }) => {
  const [file, setFile] = useState(null);

  const { handleSubmit, formState: { isSubmitting } } = useForm();

  function onUpload(file) {
    console.log('o', file);
    setFile(file[0]);
  }

  async function onClick(data) {
    if (file === undefined || file.length === 0) {
      alert('No file uploaded!');
      return;
    }

    const ext = String(file.path.split('.').pop()).toLowerCase();

    console.log('ext', ext === 'png');

    if (ext !== 'jpg' && ext !== 'jpeg' && ext !== 'png') {
      alert('Only png, jpg/jpeg files allowed!');
      return;
    }

    const formData = new FormData();
    formData.append('signature', file);
    console.log(formData);
    return axios({
      method: 'POST',
      url: '/api/upload-signature',
      data: formData,
    }).then((response) => {
      alert('Updated!');
      window.location.reload();
    }).catch((error) => {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
        alert(error.response.data.error);
      }
    })
  }
  return (
    <>
      <DialogTitle>Upload New Signature</DialogTitle>
      <Typography style={{marginLeft: "1.5vw"}}>Only png, jpg/jpeg files allowed</Typography>
      
      <form onSubmit={handleSubmit(onClick)}>
        <DialogContent>
          <DropzoneArea
            filesLimit={1}
            onChange={onUpload}
          />
          <Box display='flex' justifyContent='center' marginTop={'3vh'}>
            <Button
              type="submit" variant='contained' color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <span className="spinner-grow spinner-grow-sm"></span>
              )}
              UPLOAD
            </Button>
          </Box>
        </DialogContent>
      </form>
    </>
  )
}

export default SignatureUploadDialog