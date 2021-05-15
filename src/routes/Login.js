import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Auth from "../components/auth/Auth";
import pic from "../mainImage.png";
import { fbAuth } from "../firebase";
import { useHistory } from "react-router";
import { connect } from "react-redux";
import { logined } from "../stores/loginState";

const useStyles = makeStyles((theme) => ({
   root: {
      height: "100vh",
   },
   image: {
      backgroundImage: `url(${pic})`,
      backgroundRepeat: "no-repeat",
      backgroundColor: "white",
      backgroundSize: "contain",
      backgroundPosition: "center",
   },
   paper: {
      margin: theme.spacing(8, 4),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
   },
   avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
   },
   form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1),
   },
   submit: {
      margin: theme.spacing(3, 0, 2),
   },
   img: {
      width: "100%",
      height: "auto",
   },
}));

function Login({ onLogined, isLogined }) {
   const classes = useStyles();
   const history = useHistory();

   useEffect(() => {
      if (!isLogined) {
         fbAuth.onAuthStateChanged((user) => {
            if (user) {
               onLogined(user.uid);
               return history.push("/main");
            }
         });
      }
   }, [history, onLogined, isLogined]);

   return (
      <Grid container component="main" className={classes.root}>
         <CssBaseline />
         <Grid item xs={12} sm={8} md={9} className={classes.image} />
         <Grid
            item
            xs={false}
            sm={4}
            md={3}
            component={Paper}
            elevation={6}
            square
         >
            <Auth />
         </Grid>
      </Grid>
   );
}

function mapDispatchToProps(dispatch) {
   return {
      onLogined: (uid) => dispatch(logined(uid)),
   };
}
function mapStateToProps(state) {
   return {
      isLogined: state.loginReducer.isLogined,
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
