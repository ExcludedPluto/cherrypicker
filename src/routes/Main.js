import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import CustomDrawer from "../components/dashbord/CustomDrawer";
import { connect } from "react-redux";
import CustomToolbar from "../components/dashbord/CustomToolbar";
import { Route, Switch } from "react-router";
import AddPage from "./AddPage";
import Home from "./Home";

const useStyles = makeStyles((theme) => ({
   root: {
      display: "flex",
   },
}));

function Main({ isLogined, uid, history }) {
   const classes = useStyles();
   const [open, setOpen] = React.useState(true);
   const handleDrawerOpen = () => {
      setOpen(true);
   };
   const handleDrawerClose = () => {
      setOpen(false);
   };

   useEffect(() => {
      if (
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
         )
      ) {
         setOpen(false);
      }
      if (!isLogined) {
         history.push("/");
      }
   }, [isLogined, history]);

   return (
      <div className={classes.root}>
         <CssBaseline />
         <CustomToolbar open={open} handleDrawerOpen={handleDrawerOpen} />
         <CustomDrawer open={open} handleDrawerClose={handleDrawerClose} />
         <Switch>
            <Route exact path="/main/addpage">
               <AddPage uid={uid} />
            </Route>
            <Route path="/main">
               <Home uid={uid} />
            </Route>
         </Switch>
      </div>
   );
}

function mapStateToProps(state) {
   return {
      isLogined: state.loginReducer.isLogined,
      uid: state.loginReducer.uid,
   };
}
export default connect(mapStateToProps)(Main);
