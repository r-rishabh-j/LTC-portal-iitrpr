import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  container: {
    margin: "0 0.5vw 0 3vw",
    height: "100vh",
    width: "100%",
    display: "flex",
  },
  dialogPaper: {
    minHeight: "50vh",
    maxHeight: "55vh",
    minWidth: '50vw',
    maxWidth: '55vw'
  },
}));