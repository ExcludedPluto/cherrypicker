import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
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
   const [rememberMe, setRememberMe] = useState(false);
   const [findPassword, setFindPassword] = useState(false);
   const [resetEmailSent, setResetEmailSent] = useState(false);
   const classes = useStyles();

   const errorHandle = (err) => {
      if (err.code === "auth/user-not-found") {
         setErrMsg("가입되지 않은 이메일입니다.");
      } else if (err.code === "auth/invalid-email") {
         setErrMsg("이메일 형식을 지켜주세요.");
      } else if (err.code === "auth/wrong-password") {
         setErrMsg("잘못된 비밀번호 입니다.");
      } else if (err.code === "auth/weak-password") {
         setErrMsg("비밀번호는 최소 6자 이상이어야 합니다.");
      } else if (err.code === "auth/email-already-in-use") {
         setErrMsg("이미 사용중인 이메일입니다.");
      } else if (err.code === "auth/user-disabled") {
         setErrMsg("차단된 회원입니다.");
      } else {
         setErrMsg(err.message);
      }
   };
   const login = () => {
      fbAuth
         .signInWithEmailAndPassword(email, pw)
         .then((user) => {
            onLogined(user.user.uid);
            setEmail("");
            setPw("");
            history.push("/main");
         })
         .catch((error) => {
            errorHandle(error);
         });
   };

   const onLoginCheckIsRememberMe = () => {
      if (rememberMe) {
         fbAuth.setPersistence("local").then(() => {
            return login();
         });
      } else {
         login();
      }
   };

   const initValue = () => {
      setErrMsg("");
      setPw("");
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
                  login();
               })
               .catch((error) => {
                  errorHandle(error);
               });
         })
         .catch((error) => {
            errorHandle(error);
         });
   };

   const resetPassword = () => {
      fbAuth
         .sendPasswordResetEmail(email)
         .then(() => {
            initValue();
            setResetEmailSent(true);
         })
         .catch((err) => {
            errorHandle(err);
         });
   };
   const onClick = (e) => {
      e.preventDefault();
      if (resetEmailSent) {
         setFindPassword(false);
         setSignUp(false);
         setResetEmailSent(false);
      } else {
         if (findPassword) {
            resetPassword();
         } else {
            if (signUp) {
               onSignUp();
            } else {
               onLoginCheckIsRememberMe();
            }
         }
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
            {!findPassword ? (signUp ? "회원가입" : "로그인") : "비밀번호 찾기"}
         </Typography>
         <form className={classes.form} noValidate>
            {" "}
            {!resetEmailSent ? (
               <>
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
                  {!findPassword && (
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
                  )}
                  <ErrorMessege>{errMsg}</ErrorMessege>
               </>
            ) : (
               <>
                  {" "}
                  비밀번호 재설정 이메일이 발송되었습니다. <br />
                  재설정 후 다시 로그인해주세요.
               </>
            )}
            {!findPassword && !signUp && (
               <FormControlLabel
                  control={
                     <Checkbox
                        value={rememberMe}
                        color="primary"
                        onChange={() => setRememberMe((prev) => !prev)}
                     />
                  }
                  label="자동로그인"
               />
            )}
            <Button
               type="submit"
               fullWidth
               variant="contained"
               color="primary"
               className={classes.submit}
               onClick={onClick}
            >
               {!resetEmailSent
                  ? !findPassword
                     ? signUp
                        ? "회원가입"
                        : "로그인"
                     : "비밀번호 재설정"
                  : "로그인 하기"}
            </Button>
            {!findPassword && (
               <Grid container>
                  <Grid item xs>
                     <Link
                        variant="body2"
                        onClick={() => {
                           setFindPassword(true);
                           initValue();
                        }}
                     >
                        비밀번호찾기
                     </Link>
                  </Grid>
                  <Grid
                     item
                     onClick={() => {
                        setSignUp((prev) => !prev);
                        initValue();
                     }}
                  >
                     <Link href="#" variant="body2">
                        {signUp ? "로그인" : "회원가입"}
                     </Link>
                  </Grid>
               </Grid>
            )}
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
