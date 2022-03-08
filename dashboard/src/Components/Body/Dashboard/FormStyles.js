import { makeStyles } from "@material-ui/core";
import { teal } from "@material-ui/core/colors";
import { NavigationType } from "react-router-dom";

export const useStyles = makeStyles((theme) => ({
  contain: {
    margin: "0 0.5vw 0 3vw",
    height: "100%",
    width: "100%",
  },

  form: {
    padding: "1vw",
    // height: "100%",
    // width: "100%",
    margin: "auto",
    "& .MultiFormControl-root": {
      width: "100%",
      
    },
  },
  div: {
    backgroundColor: "black",
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
