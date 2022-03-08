import { makeStyles } from "@material-ui/core";
import { teal } from "@material-ui/core/colors";

export const useStyles = makeStyles((theme) => ({
    loginPage: {
        padding : "20px",
        height: "30vh",
        width: 400,
        margin: "100px auto"
    },
    avatar: {
        backgroundColor: teal["500"]
    },
    btn: {
        margin: "36px 0"
    },
    textFieldLogin:{
        margin: "24px 0 8px"
    },
    textFieldPass:{
        margin: "8px 0 8px"
    },
    btnHeader: {
        fontFamily: 'Nunito Sans',
        fontSize: "16px",
        fontWeight: 600,
        color: "var(--grey)",
        margin: "20px 0 10px 0"
      }
}))