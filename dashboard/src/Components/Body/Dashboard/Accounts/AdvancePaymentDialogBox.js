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
import { useForm, Controller, useFieldArray, register } from "react-hook-form";
import { FormInputText } from "../../../Utilities/FormInputText";
import "bootstrap/dist/css/bootstrap.min.css";
import { FormInputNumber } from "../../../Utilities/FormInputNumber";


const AdvancePaymentDialogBox = ({ request_id }) => {
    const [file, setFile] = useState(null);

    const { handleSubmit, control, register, formState: { isSubmitting } } = useForm();

    function onUpload(file) {
        console.log('o', file);
        setFile(file[0]);
    }

    const [editing, setEditing] = useState(false);

    function onClick(data) {
        // e.preventDefault();
        if (file === undefined || file.length === 0) {
            alert('No file uploaded!');
            return;
        }
        const formData = new FormData();
        formData.append('request_id', request_id);
        formData.append('amount', data.amount_paid);
        formData.append('comments', data.comments);
        formData.append('payment_proof', file);
        console.log(formData);
        return axios({
            method: 'POST',
            url: '/api/update-advance-payment',
            data: formData,
        }).then((response) => {
            alert('Updated!');
            window.location.reload();
        }).catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log(error.response.status);
                console.log(error.response.headers);
                alert(error.response);
            }
        })
    }
    return (
        <>
            <DialogTitle>Advance Payment Details</DialogTitle>
            <form onSubmit={handleSubmit(onClick)}>
                <DialogContent>
                    <FormInputNumber
                        name={"amount_paid"}
                        label={"Amount paid (₹)"}
                        control={control}
                        required={true}
                        disabled={false}
                        adornment={true}
                        // autofill={false}
                        // defaultValue={''}
                    ></FormInputNumber>
                    <FormInputText
                        name={"comments"}
                        label={"Comments"}
                        control={control}
                        required={true}
                        disabled={false}
                        autofill={false}
                        multiline={true}
                        defaultValue={''}
                    ></FormInputText>
                    <div>Payment Proof *</div>
                    <br></br>
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

export default AdvancePaymentDialogBox