import React from 'react'
import { Hidden, Drawer} from "@material-ui/core";
import SideNavData from './SideNavData';
import { useStyles } from './HeaderStyles';


export default function SideNav({mobileOpen, handleDrawerToggle, handleDrawerClose, userType}) {
    const classes = useStyles();
    

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={"left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <SideNavData
            handleDrawerClose={handleDrawerClose}
            userType={userType}
          />
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          <SideNavData
            handleDrawerClose={handleDrawerClose}
            userType={userType}
          />
        </Drawer>
      </Hidden>
    </nav>
  );
}
