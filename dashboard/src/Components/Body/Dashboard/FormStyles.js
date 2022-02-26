import { makeStyles } from "@material-ui/core";
import { teal } from "@material-ui/core/colors";
import { NavigationType } from "react-router-dom";

export const useStyles = makeStyles((theme) => ({
  form: {
    padding: "auto",
    height: "90%",
    width: "90%",
    margin: "auto",
  },
  div:{
    backgroundColor:"black",
  },
  avatar: {
    backgroundColor: teal["500"],
  },
  btn: {
    margin: "36px 0",
  },
  textField: "filed",
  textFieldLogin: {
    margin: "24px 0 8px",
  },
  textFieldPass: {
    margin: "8px 0 8px",
  },
}));
