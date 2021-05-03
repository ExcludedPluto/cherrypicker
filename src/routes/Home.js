import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import {
   Button,
   CircularProgress,
   Divider,
   List,
   ListItem,
   ListItemText,
   makeStyles,
   Modal,
   Paper,
   Typography,
} from "@material-ui/core";
import clsx from "clsx";
import { fbStorage } from "../firebase";
import { DeleteExtension } from "../utils/DeleteExtension";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
   paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
   },
   button: {
      maxWidth: "100px",
      margin: "10px 0px",
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

function ListItemLink(props) {
   return <ListItem button component="a" {...props} />;
}

function Home({ uid }) {
   const classes = useStyles();
   const [loading, setLoading] = useState(false);
   const [isPage, setIsPage] = useState(false);
   const [page, setPage] = useState(null);
   const [list, setList] = useState([]);
   const history = useHistory();
   const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

   useEffect(() => {
      setLoading(true);
      const getList = async () => {
         await fbStorage
            .ref()
            .child(`${uid}`)
            .listAll()
            .then((data) => {
               setList(data.items);
               setLoading(false);
            })
            .catch((err) => {
               console.log(err);
               setLoading(false);
            });
      };
      getList();
   }, [uid]);

   const onClick = async (item) => {
      setLoading(true);
      console.log(item);
      await item
         .getDownloadURL()
         .then((data) => {
            setPage(data);
            setLoading(false);
         })
         .catch((err) => {
            console.log(err);
            setLoading(false);
         });
   };
   return (
      <>
         <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
               <Paper className={fixedHeightPaper}>
                  {page ? (
                     <>
                        <Button
                           variant="contained"
                           color="primary"
                           onClick={() => setPage(null)}
                           className={classes.button}
                        >
                           뒤로가기
                        </Button>
                        <img src={page} alt="error" />
                        <Button
                           variant="contained"
                           color="primary"
                           onClick={() => setPage(null)}
                           className={classes.button}
                        >
                           뒤로가기
                        </Button>
                     </>
                  ) : (
                     <>
                        <Typography
                           component="h2"
                           variant="h6"
                           color="primary"
                           gutterBottom
                        >
                           페이지 리스트
                        </Typography>
                        <List component="nav" aria-label="main mailbox folders">
                           {list.length === 0 ? (
                              <>
                                 <ListItem
                                    button
                                    onClick={() =>
                                       history.push("/main/addpage")
                                    }
                                 >
                                    <ListItemText primary="등록된 페이지가 없습니다." />
                                 </ListItem>
                                 <Divider />
                              </>
                           ) : (
                              list.map((item, idx) => {
                                 return (
                                    <>
                                       <ListItem
                                          id={idx}
                                          button
                                          onClick={() => onClick(item)}
                                       >
                                          <ListItemText
                                             primary={DeleteExtension(
                                                item.name
                                             )}
                                          />
                                       </ListItem>
                                       <Divider />
                                    </>
                                 );
                              })
                           )}
                        </List>
                     </>
                  )}
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
