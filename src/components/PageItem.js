import { Button, makeStyles } from "@material-ui/core";
import React from "react";
import { Link, useHistory } from "react-router-dom";
const useStyles = makeStyles(() => ({
   button: {
      maxWidth: "100px",
      margin: "10px 0px",
      float: "left",
   },
   goPage: {
      margin: "10px 0px",
      lineHeight: "36px",
      fontSize: "15px",
      textAlign: "center",
   },
}));

function PageItem({ page, curItem }) {
   const classes = useStyles();
   const history = useHistory();
   const goPage = (url) => {
      window.open(url, "_blank");
   };
   return (
      <>
         {" "}
         <div>
            <Button
               variant="contained"
               color="primary"
               onClick={() => history.goBack()}
               className={classes.button}
            >
               뒤로가기
            </Button>
            <div className={classes.goPage}>
               <Link
                  onClick={() => goPage(curItem.url)}
                  color="primary"
                  underline="none"
               >
                  링크 : {curItem.url}
               </Link>
            </div>
         </div>
         <img src={page} alt="error" />
         <div>
            <Button
               variant="contained"
               color="primary"
               onClick={() => history.goback()}
               className={classes.button}
            >
               뒤로가기
            </Button>
            <div className={classes.goPage}>
               <Link onClick={() => goPage(curItem.url)}>
                  링크 : {curItem.url}
               </Link>
            </div>
         </div>
      </>
   );
}
export default PageItem;
