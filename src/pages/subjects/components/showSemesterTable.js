import {
  TextField,
  Datagrid,
  useRecordContext,
  ListContextProvider,
  useList,
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";

import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const SemesterTable = () => {
  const data = useRecordContext();

  const [semesterData, setsemesterData] = useState(data.semesters);
  const tableData = useList({
    data: semesterData,
  });

  const [open, setOpen] = useState(false);

  const handleClickOpen = (props) => {
    console.log(props);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <ListContextProvider value={tableData} emptyWhileLoading>
      <Datagrid bulkActionButtons={false}>
        <TextField source="semester" />
        <ArrayField source="branchSubs" label="Branches">
          <SingleFieldList linkType={false}>
            <ChipField source="branch" />
          </SingleFieldList>
        </ArrayField>

        <Button
          label="Edit"
          startIcon={<EditIcon />}
          onClick={handleClickOpen}
        />
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
            <List>
              <ListItem
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary="Single-line item"
                  secondary={false ? "Secondary text" : null}
                />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleClose}>Save</Button>
          </DialogActions>
        </Dialog>
      </Datagrid>
    </ListContextProvider>
  );
};

export default SemesterTable;
