import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormInputText } from "../../../Utilities/FormInputText";
import axios from "axios";
import {
  DialogTitle,
  DialogContent,
  TextField,
  Grid,
  Typography,
  Button,
  Box,
} from "@material-ui/core";
import DropUserForm from "./DropUserForm";

const DropUser = () => {
  const { handleSubmit, control } = useForm();
  const [email, setEmail] = useState();
  const [view, setView] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
    setEmail(data.email);
    setView(true);
  };
  return (
    <div>
      <DialogTitle>Drop User</DialogTitle>
      <DialogContent>
        {view === false ? (
          <>
            <Typography>Search by email the user you want to delete:</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormInputText
                name={"email"}
                control={control}
                label={"Email ID"}
                required={true}
                defaultValue={""}
              />
              <Box display="flex" justifyContent="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ margin: "2vh 0 0 0" }}
                >
                  Search
                </Button>
              </Box>
            </form>
          </>
        ) : (
          <div>
            <DropUserForm email={email} setView={setView} />
          </div>
        )}
      </DialogContent>
    </div>
  );
};

export default DropUser;
