import {
   Divider,
   IconButton,
   List,
   ListItem,
   ListItemSecondaryAction,
   ListItemText,
   Typography,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { useHistory } from "react-router";
import { fb, fbStorage, fbStore } from "../firebase";
import { Round5Minutes } from "../utils/Round5Minutes";

function PageList({ list, setLoading, uid, setPage, setRefresh, setCurItem }) {
   const history = useHistory();
   const onClick = async (item) => {
      setLoading(true);
      setCurItem(item);
      await fbStorage
         .ref(`${uid}/${item.id}.png`)
         .getDownloadURL()
         .then((data) => {
            setPage(data);
            history.push("/main/pageitem");
            setLoading(false);
         })
         .catch((err) => {
            console.log(err);
            setLoading(false);
         });
   };
   const onDelete = async (item) => {
      setLoading(true);
      if (window.confirm("삭제하시겠습니까?")) {
         await fbStore.collection(`${uid}`).doc(`${item.id}`).delete();
         const deleteObj = {};
         deleteObj[`${item.id}`] = fb.firestore.FieldValue.delete();
         await fbStore
            .collection("schedule")
            .doc(`${Round5Minutes(item.createdAt)}`)
            .update(deleteObj);
         await fbStorage.ref(`${uid}/${item.id}.png`).delete();
         setRefresh((prev) => prev + 1);
      }
      setLoading(false);
   };
   return (
      <>
         <Typography component="h2" variant="h6" color="primary" gutterBottom>
            페이지 리스트
         </Typography>
         <List component="nav" aria-label="main mailbox folders">
            {list.length === 0 ? (
               <>
                  <ListItem
                     button
                     onClick={() => history.push("/main/addpage")}
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
                           key={idx}
                           button
                           onClick={() => onClick(item)}
                        >
                           <ListItemText primary={item.name} />
                           <ListItemSecondaryAction>
                              <IconButton
                                 edge="end"
                                 aria-label="delete"
                                 onClick={() => onDelete(item)}
                              >
                                 <DeleteIcon />
                              </IconButton>
                           </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                     </>
                  );
               })
            )}
         </List>
      </>
   );
}
export default PageList;
