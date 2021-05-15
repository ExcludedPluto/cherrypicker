import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { CircularProgress, makeStyles, Modal, Paper } from "@material-ui/core";
import clsx from "clsx";
import { fbStore } from "../firebase";
import { Route } from "react-router";
import PageList from "../components/PageList";
import PageItem from "../components/PageItem";

const useStyles = makeStyles((theme) => ({
   paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
   },
   fixedHeight: {
      height: "100%",
   },
   content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
   },
   container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
   },

   loading: {
      position: "absolute",
      top: "47%",
      left: "47%",
   },
   appBarSpacer: theme.mixins.toolbar,
}));

function Home({ uid }) {
   const classes = useStyles();
   const [loading, setLoading] = useState(false);
   const [page, setPage] = useState(null);
   const [list, setList] = useState([]);
   const [refresh, setRefresh] = useState(1);
   const [curItem, setCurItem] = useState({});
   const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

   useEffect(() => {
      setLoading(true);
      const getList = async () => {
         await fbStore
            .collection(`${uid}`)
            .get()
            .then((data) => {
               let list = [];
               data.forEach((item) => {
                  if (item.id !== "signUp") {
                     list.push({ ...item.data(), id: item.id });
                  }
               });
               setList(list);
               setLoading(false);
            })
            .catch((err) => {
               console.log(err);
               setLoading(false);
            });
      };
      getList();
   }, [uid, refresh]);

   return (
      <>
         <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
               <Paper className={fixedHeightPaper}>
                  <Route exact path="/main/pageitem">
                     <PageItem
                        page={page}
                        setPage={setPage}
                        curItem={curItem}
                     />
                  </Route>
                  <Route exact path="/main">
                     <PageList
                        setLoading={setLoading}
                        list={list}
                        uid={uid}
                        setPage={setPage}
                        setRefresh={setRefresh}
                        setCurItem={setCurItem}
                     />
                  </Route>
               </Paper>
            </Container>
         </main>{" "}
         <Modal open={loading}>
            <CircularProgress color="secondary" className={classes.loading} />
         </Modal>
      </>
   );
}
export default Home;
