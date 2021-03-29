import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import CustomDrawer from "../components/dashbord/CustomDrawer";
import { connect } from "react-redux";
import MainBoard from "../components/dashbord/MainBoard";
import CustomToolbar from "../components/dashbord/CustomToolbar";

const useStyles = makeStyles((theme) => ({
   root: {
      display: "flex",
   },
}));

function Main({ isLogined, uid, onLogout, history }) {
   const classes = useStyles();
   const [open, setOpen] = React.useState(true);
   const handleDrawerOpen = () => {
      setOpen(true);
   };
   const handleDrawerClose = () => {
      setOpen(false);
   };

   useEffect(() => {
      if (!isLogined) {
         history.push("/");
      }
   }, [isLogined, history]);

   return (
      <div className={classes.root}>
         <CssBaseline />
         <CustomToolbar open={open} handleDrawerOpen={handleDrawerOpen} />
         <CustomDrawer open={open} handleDrawerClose={handleDrawerClose} />
         <MainBoard />
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
