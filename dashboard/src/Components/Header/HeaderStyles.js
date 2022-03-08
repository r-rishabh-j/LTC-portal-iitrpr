import { makeStyles } from "@material-ui/core";
import { blueGrey, blue } from "@material-ui/core/colors";
import { textTransform } from "@mui/system";

const drawerWidth = 280

export const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "#efefef",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    position: "absolute"
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    marginTop: "65px",
    [theme.breakpoints.down("sm")]: {
      marginTop: "0px",
    },
  },

  navButton: {
    width: "100%",
    textTransform: "capitalize",
  },

  //wrapper
  wrapper: {
    height: "100%",
    background: "#efefef",
    padding: theme.spacing(2, 2, 0, 32),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(2, 2),
    },
  },

  navlinks: {
    color: blueGrey["A400"],
    " & :hover, &:hover div": {
      color: blue["A400"],
    },
    " & div": {
      color: blueGrey["A400"],
    },
  },

  activeNavlinks: {
    color: blue["A700"],
    " & div": {
      color: blue["A700"],
    },
  },
}));
