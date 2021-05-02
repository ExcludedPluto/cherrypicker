import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import { useHistory } from "react-router";

export const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
   drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.enteringScreen,
      }),
   },
   drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
         easing: theme.transitions.easing.sharp,
         duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
         width: theme.spacing(9),
      },
   },
   toolbarIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar,
   },
}));

const mainListItems = (history) => {
   return (
      <div>
         <ListItem button onClick={() => history.push("/main")}>
            <ListItemIcon>
               <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="홈" />
         </ListItem>
         <ListItem button onClick={() => history.push("/main/addpage")}>
            <ListItemIcon>
               <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText primary="페이지 추가" />
         </ListItem>
         <ListItem button>
            <ListItemIcon>
               <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="고객문의" />
         </ListItem>
      </div>
   );
};

export default function CustomDrawer({ open, handleDrawerClose }) {
   const classes = useStyles();
   const history = useHistory();
   return (
      <>
         <Drawer
            variant="permanent"
            classes={{
               paper: clsx(
                  classes.drawerPaper,
                  !open && classes.drawerPaperClose
               ),
            }}
            open={open}
         >
            <div className={classes.toolbarIcon}>
               <IconButton onClick={handleDrawerClose}>
                  <ChevronLeftIcon />
               </IconButton>
            </div>
            <Divider />
            <List>{mainListItems(history)}</List>
         </Drawer>
      </>
   );
}
