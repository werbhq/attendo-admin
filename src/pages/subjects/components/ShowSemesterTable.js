import {
  TextField,
  Datagrid,
  useRecordContext,
  ListContextProvider,
  useList,
  ArrayField,
  SingleFieldList,
  ChipField,
  TextInput,
  SimpleForm,
  ArrayInput,
  SimpleFormIterator,
  FunctionField,
  useRefresh,
  useNotify,
} from "react-admin";

import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

import { Button, Dialog } from "@mui/material";
import { customAdd, customDelete } from "./customButton";
import { dataProvider } from "../../../provider/firebase";
import { MAPPING } from "../../../provider/mapping";

const SemesterTable = () => {
  const data = useRecordContext();
  const url = MAPPING.SUBJECT;
  const [semesterData,setSemesterData] = useState(data.semesters);
  const [semData, setSemData] = useState(data.semesters[0]);

  const tableData = useList({
    data: semesterData,
  });
  const refresh = useRefresh();
  const notify = useNotify();
  const [open, setOpen] = useState(false);

  const handleClickOpen = (record) => {
    setSemData(record);
    setOpen(true);
  };
  const updateBranch = (newData) => {
    const updateData = data;
    const updateIndex = updateData.semesters.findIndex(
      (e) => e.semester === semData.semester
    );
    updateData.semesters[updateIndex] = newData;
    console.log(updateData);
    dataProvider
      .update(url, { id: data.id, data: updateData, oldData: data })
      .then((response) => {
        console.log(response); // { id: 123, title: "hello, world" }
      });
    setSemesterData(updateData.semester);
    refresh();
    notify("Classroom Inputed");
    handleClose();
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
        <FunctionField
          render={(record) => (
            <Button
              label="Edit"
              startIcon={<EditIcon />}
              onClick={() => handleClickOpen(record)}
            >
              Edit
            </Button>
          )}
        />
        <Dialog open={open} onClose={handleClose}>
          <SimpleForm onSubmit={updateBranch} record={semData}>
            <ArrayInput source="branchSubs" label="Branches" fullWidth="flase">
              <SimpleFormIterator
                addButton={customAdd()}
                removeButton={customDelete()}
                disableReordering
              >
                <TextInput source="branch" label="branch" />
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleForm>
          {/* <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
            <TextInput source="" label="Roll"  required/>
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
                  secondary={true ? "Secondary text" : null}
                />
              </ListItem>
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleClose}>Save</Button>
          </DialogActions> */}
        </Dialog>
      </Datagrid>
    </ListContextProvider>
  );
};

export default SemesterTable;
