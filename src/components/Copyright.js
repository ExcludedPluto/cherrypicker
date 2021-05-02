import { Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";

function Copyright() {
   return (
      <Typography variant="body2" color="textSecondary" align="center">
         {"Copyright © "}
         <Link to="https://material-ui.com/" color="inherit">
            Your Website
         </Link>{" "}
         {new Date().getFullYear()}
         {"."}
      </Typography>
   );
}
export default Copyright;
