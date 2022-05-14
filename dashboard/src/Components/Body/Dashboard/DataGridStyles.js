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
    maxHeight: "95vh",
    minWidth: "80vw",
    maxWidth: "95vw",
    // backgroundColor: "#cfd8dc"
  },
  uploadDialogPaper: {
    minHeight: "50vh",
    maxHeight: "60vh",
    minWidth: "50vw",
    maxWidth: "55vw",
  },
  addUserDialogPaper: {
    minHeight: "50vh",
    maxHeight: "81vh",
    minWidth: "50vw",
    maxWidth: "55vw",
  },
  advPaymentDialogPaper: {
    minHeight: "50vh",
    maxHeight: "auto",
    minWidth: "50vw",
    maxWidth: "55vw",
  },
  signatureUploadDialogPaper: {
    minHeight: "30vh",
    maxHeight: "auto",
    minWidth: "30vw",
    maxWidth: "55vw",
    marginLeft: "18vw",
  },
}));