import { createReducer } from "@reduxjs/toolkit";

const LOGINED = "LOGINED";
const LOGOUT = "LOGOUT";

export const logined = (uid) => ({ type: LOGINED, uid });

export const logout = () => ({ type: LOGOUT });

const loginReducer = createReducer(
   { isLogined: false, uid: "" },
   {
      [LOGINED]: (state, action) => ({
         isLogined: true,
         uid: action.uid,
      }),
      [LOGOUT]: () => ({ isLogined: false }),
   }
);

export default loginReducer;
