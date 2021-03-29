import React from "react";
import Chart from "./elements/Chart";
import Deposits from "./elements/Deposits";
import Orders from "./elements/Orders";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";
import clsx from "clsx";
import Copyright from "../Copyright";

const useStyles = makeStyles((theme) => ({
   paper: {
      padding: theme.spacing(2),
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
   },
   fixedHeight: {
      height: 240,
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

   appBarSpacer: theme.mixins.toolbar,
}));
function MainBoard() {
   const classes = useStyles();

   const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

   return (
      <>
         <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
               <Grid container spacing={3}>
                  {/* Chart */}
                  <Grid item xs={12} md={8} lg={9}>
                     <Paper className={fixedHeightPaper}>
                        <Chart />
                     </Paper>
                  </Grid>
                  {/* Recent Deposits */}
                  <Grid item xs={12} md={4} lg={3}>
                     <Paper className={fixedHeightPaper}>
                        <Deposits />
                     </Paper>
                  </Grid>
                  {/* Recent Orders */}
                  <Grid item xs={12}>
                     <Paper className={classes.paper}>
                        <Orders />
                     </Paper>
                  </Grid>
               </Grid>
               <Box pt={4}>
                  <Copyright />
               </Box>
            </Container>
         </main>
      </>
   );
}
export default MainBoard;
