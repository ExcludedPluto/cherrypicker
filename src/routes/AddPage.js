import {
   Button,
   CircularProgress,
   Container,
   FormControl,
   FormHelperText,
   IconButton,
   InputAdornment,
   InputLabel,
   makeStyles,
   Modal,
   OutlinedInput,
} from "@material-ui/core";
import { AddBox } from "@material-ui/icons";
import React, { useState } from "react";
import clsx from "clsx";
import { fbStore } from "../firebase";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
   paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
   },

   margin: {
      margin: theme.spacing(1),
   },
   content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
   },
   field: {
      margin: "10px 0px",
   },
   textField: {
      width: "100%",
      margin: "10px 0px",
   },
   container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
   },
   submit: {
      width: "100px",
   },
   loading: {
      position: "absolute",
      top: "47%",
      left: "47%",
   },
   error: {
      color: "red",
   },
   appBarSpacer: theme.mixins.toolbar,
}));

function AddPage({ uid }) {
   const classes = useStyles();
   const [info, setInfo] = useState({
      name: "",
      url: "",
   });
   const [loading, setLoading] = useState(false);
   const [wrong, setWrong] = useState({
      url: false,
   });

   const onSubmit = async () => {
      if (info.name && info.name.length >= 4) {
         setWrong((prev) => ({ ...prev, name: false }));
         if (
            info.url.match(
               /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
            )
         ) {
            setWrong((prev) => ({ ...prev, url: false }));
            setLoading(true);
            await fbStore
               .collection(`${uid}`)
               .doc(`${info.name}`)
               .set({
                  url: info.url,
                  createdAt: Date.now(),
               })
               .then(async () => {
                  await axios
                     .post(
                        "https://us-central1-cherrypicker-6c0fa.cloudfunctions.net/crawl",
                        {
                           uid: uid,
                           name: info.name,
                           url: info.url,
                        }
                     )
                     .then(async (res) => {
                        console.log(res);
                        const updateObj = {};
                        updateObj[`${Date.now()}`] = {
                           uid: uid,
                           name: info.name,
                           url: info.url,
                        };
                        await fbStore
                           .collection("schedule")
                           .doc(`${new Date().getHours()}`)
                           .update(updateObj);
                        setLoading(false);
                     })
                     .catch((err) => {
                        console.log(err);
                        setLoading(false);
                     });
                  setInfo({ name: "", url: "" });
               });
         } else {
            setWrong((prev) => ({ ...prev, url: true }));
         }
      } else {
         setWrong((prev) => ({ ...prev, name: true }));
      }
   };
   return (
      <>
         <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
               <div className={classes.field}>
                  1. 이름을 적어주세요.
                  <br />
                  <FormControl
                     className={clsx(classes.margin, classes.textField)}
                     variant="outlined"
                  >
                     <InputLabel htmlFor="name">이름</InputLabel>
                     <OutlinedInput
                        id="name"
                        type="text"
                        value={info.name}
                        onChange={(e) =>
                           setInfo((prev) => ({
                              ...prev,
                              name: e.target.value,
                           }))
                        }
                        labelWidth={30}
                     />
                     <FormHelperText id="name-helper-text">
                        성함이 아닌, 이 페이지를 위한 이름입니다.
                     </FormHelperText>
                  </FormControl>
                  {wrong.name && (
                     <div className={classes.error}>
                        최소 4자리 이상의 이름을 입력해주세요.
                     </div>
                  )}
               </div>
               <div className={classes.field}>
                  2. 이미지를 찍을 페이지 주소를 등록하세요.
                  <br />
                  <FormControl
                     className={clsx(classes.margin, classes.textField)}
                     variant="outlined"
                  >
                     <InputLabel htmlFor="url">주소</InputLabel>
                     <OutlinedInput
                        id="url"
                        type="text"
                        value={info.url}
                        onChange={(e) =>
                           setInfo((prev) => ({ ...prev, url: e.target.value }))
                        }
                        endAdornment={
                           <InputAdornment position="end">
                              <IconButton
                                 onClick={() =>
                                    console.log("click icon button")
                                 }
                                 edge="end"
                              >
                                 <AddBox />
                              </IconButton>
                           </InputAdornment>
                        }
                        labelWidth={30}
                     />
                     <FormHelperText id="url-helper-text">
                        https:// 또는 http:// 형식으로 시작하여야합니다.
                     </FormHelperText>
                  </FormControl>
                  {wrong.url && (
                     <div className={classes.error}>
                        url 형식을 지켜주세요. 주소창에서 전체를 복사하면
                        됩니다.
                     </div>
                  )}
               </div>
               <Button
                  color="primary"
                  className={classes.submit}
                  variant="contained"
                  onClick={onSubmit}
                  disableElevation
               >
                  등록
               </Button>
            </Container>
            <Modal open={loading}>
               <CircularProgress
                  color="secondary"
                  className={classes.loading}
               />
            </Modal>
         </main>
      </>
   );
}
export default AddPage;
