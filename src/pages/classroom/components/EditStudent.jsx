import * as React from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  NumberInput,
  SimpleForm,
  TextInput,
  useDataProvider,
  useRecordContext,
  useRefresh,
  useNotify,
  SaveButton,
} from "react-admin";
import { MAPPING } from "../../../provider/mapping";
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { autoCapitalize, sortByRoll } from "../../../Utils/helpers";

const CustomDeleteButton = ({ handleDelete }) => {
  const record = useRecordContext();
  const [showDeleteDialouge, setShowDeleteDialouge] = React.useState(false);
  const handleClose = () => setShowDeleteDialouge(!showDeleteDialouge);

  return (
    <div>
      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleClose}
      >
        Delete
      </Button>
      <Dialog open={showDeleteDialouge} keepMounted onClose={handleClose}>
        <DialogTitle>{`Are you sure you want to delete?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {record.email}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button
            onClick={async () => {
              handleDelete(record);
              handleClose();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default function EditStudent({ state }) {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const { id, students } = useRecordContext();
  const { setdialouge, dialouge } = state;
  const { record } = dialouge;
  const newStudents = students;
  const url = MAPPING.STUDENTS;
  const style = { width: 1 };

  const handleSave = async (newRecord) => {
    const index = students.findIndex((e) => e.id === newRecord.id);
    if (index !== -1) newStudents[index] = newRecord;
    else newStudents.push({ userName: "", ...newRecord, id: newRecord.email });

    await dataProvider.update(url, {
      id,
      data: newStudents.sort(sortByRoll),
      prevData: students.sort(sortByRoll),
      record: newRecord,
    });
    refresh();
    notify(`${index === -1 ? "Added" : "Edited"} Student ${newRecord.email}`, {
      type: "success",
    });
    setdialouge(false);
  };

  const handleDelete = async (newRecord) => {
    newStudents.splice(
      students.findIndex((e) => e.id === newRecord.id),
      1
    );

    await dataProvider.update(url, {
      id,
      data: newStudents.sort(sortByRoll),
      prevData: students.sort(sortByRoll),
      record: newRecord,
    });

    notify(`Deleted Student ${newRecord.email}`, { type: "success" });
    refresh();
    setdialouge(false);
  };

  return (
    <Dialog
      open={dialouge.enable}
      onClose={() => setdialouge({ ...dialouge, enable: false })}
      fullWidth={true}
    >
      <SimpleForm record={record} onSubmit={handleSave} toolbar={false}>
        {!dialouge.add && (
          <TextInput source="id" label="Id" disabled={true} sx={style} />
        )}
        <NumberInput
          source="rollNo"
          label="Roll"
          sx={style}
          onWheel={(e) => e.preventDefault()}
          required
        />
        <TextInput
          source="regNo"
          label="Registration Number"
          sx={style}
          required
          format={autoCapitalize}
        />
        <TextInput source="name" label="Name" sx={style} required />
        <TextInput source="email" label="Email" sx={style} required />
        <TextInput source="userName" label="User Name" sx={style} />
        <Stack direction="row" spacing={3}>
          <SaveButton label={dialouge.add ? "Add" : "Save"} />
          {!dialouge.add && <CustomDeleteButton handleDelete={handleDelete} />}
        </Stack>
      </SimpleForm>
    </Dialog>
  );
}
