import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  container: {
    margin: "0 0.5vw 0 3vw",
    height: "100vh",
    width: "100%",
    display: "flex",
  },
  dialogPaper: {
    minHeight: "80vh",
    maxHeight: "80vh",
    minWidth: '80vw',
    maxWidth: '80vw'
  },
}));