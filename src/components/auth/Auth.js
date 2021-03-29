import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router";
import { fbAuth, fbStore } from "../../firebase";
import styled from "styled-components";
import { connect } from "react-redux";
import { logined } from "../../stores/loginState";
import Copyright from "../Copyright";

const ErrorMessege = styled.div`
   padding-left: 10px;
   color: red;
`;
const useStyles = makeStyles((theme) => ({
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
}));
function Auth({ onLogined }) {
   const history = useHistory();
   const [signUp, setSignUp] = useState(false);
   const [email, setEmail] = useState("");
   const [pw, setPw] = useState("");
   const [errMsg, setErrMsg] = useState("");
   const classes = useStyles();

   const onLogin = () => {
      fbAuth
         .signInWithEmailAndPassword(email, pw)
         .then((user) => {
            onLogined(user.user.uid);
            setEmail("");
            setPw("");
            history.push("/main");
         })
         .catch((error) => {
            setErrMsg(error.message);
         });
   };
   const onSignUp = () => {
      fbAuth
         .createUserWithEmailAndPassword(email, pw)
         .then((user) => {
            fbStore
               .collection(user.user.uid)
               .doc("signUp")
               .set({
                  signUpAt: new Date(),
               })
               .then((docRef) => {
                  onLogin();
               })
               .catch((error) => {
                  setErrMsg(error.message);
               });
         })
         .catch((error) => {
            setErrMsg(error.message);
         });
   };

   const onClick = (e) => {
      e.preventDefault();
      if (signUp) {
         onSignUp();
      } else {
         onLogin();
      }
   };
   const onChangeEmail = (e) => {
      setEmail(e.target.value);
   };
   const onChangePw = (e) => {
      setPw(e.target.value);
   };

   return (
      <div className={classes.paper}>
         <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
         </Avatar>
         <Typography component="h1" variant="h5">
            {signUp ? "Sign Up" : "Sign In"}
         </Typography>
         <form className={classes.form} noValidate>
            <TextField
               variant="outlined"
               margin="normal"
               required
               fullWidth
               id="email"
               label="Email Address"
               name="email"
               autoComplete="email"
               value={email}
               onChange={onChangeEmail}
               autoFocus
            />
            <TextField
               variant="outlined"
               margin="normal"
               required
               fullWidth
               name="password"
               label="Password"
               type="password"
               id="password"
               value={pw}
               onChange={onChangePw}
               autoComplete="current-password"
            />
            <ErrorMessege>{errMsg}</ErrorMessege>
            <FormControlLabel
               control={<Checkbox value="remember" color="primary" />}
               label="Remember me"
            />
            <Button
               type="submit"
               fullWidth
               variant="contained"
               color="primary"
               className={classes.submit}
               onClick={onClick}
            >
               {signUp ? "Sign Up" : "Sign In"}
            </Button>
            <Grid container>
               <Grid item xs>
                  <Link href="#" variant="body2">
                     Forgot password?
                  </Link>
               </Grid>
               <Grid item onClick={() => setSignUp((prev) => !prev)}>
                  <Link href="#" variant="body2">
                     {signUp
                        ? "Let's Sign In"
                        : "Don't have an account? Sign Up"}
                  </Link>
               </Grid>
            </Grid>
            <Box mt={5}>
               <Copyright />
            </Box>
         </form>
      </div>
   );
}

function mapDispatchToProps(dispatch) {
   return {
      onLogined: (uid) => dispatch(logined(uid)),
   };
}

export default connect(null, mapDispatchToProps)(Auth);
