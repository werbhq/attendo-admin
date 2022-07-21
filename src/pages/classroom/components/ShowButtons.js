import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import {
  useRecordContext,
  useListContext,
  useNotify,
  useRefresh,
  useDataProvider,
  useUnselectAll,
  FunctionField,
} from "react-admin";
import { useState } from "react";
import { MAPPING } from "../../../provider/mapping";
import { sortByRoll } from "../../../Utils/helpers";

const resource = MAPPING.STUDENTS;

export const CustomStudentEditButton = ({ state }) => {
  const { setdialouge, dialouge } = state;
  return (
    <FunctionField
      label="Edit"
      render={(record) => {
        return (
          <Button
            startIcon={<EditIcon />}
            onClick={() => {
              setdialouge({
                ...dialouge,
                enable: true,
                add: false,
                record,
              });
            }}
          />
        );
      }}
    />
  );
};

export const CustomStudentBulkDeleteButton = () => {
  const dataProvider = useDataProvider();
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const { selectedIds } = useListContext();

  const unselectAll = useUnselectAll(resource);

  const students = record.students.filter((e) => !selectedIds.includes(e.id));
  const count = selectedIds.length;

  const [showDeleteDialouge, setShowDeleteDialouge] = useState(false);

  const handleClose = () => setShowDeleteDialouge(!showDeleteDialouge);

  const handleDelete = async () => {
    await dataProvider.updateMany(resource, {
      id: record.id,
      data: students.sort(sortByRoll),
    });
    unselectAll();
    refresh();
    notify(`Deleted ${count} Student`, { type: "success" });
  };

  return (
    <div>
      <Button
        variant="text"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleClose}
      >
        Delete
      </Button>
      <Dialog open={showDeleteDialouge} keepMounted onClose={handleClose}>
        <DialogTitle>{"Are you sure you want to delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {count} Students
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button
            onClick={async () => {
              handleDelete();
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

export const CustomVirtualStudentSaveButton = ({ list, callback }) => {
  const dataProvider = useDataProvider();
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();

  const { selectedIds } = useListContext();

  const students = list.filter((e) => selectedIds.includes(e.id));
  const count = selectedIds.length;

  const handleClose = async () => {
    await dataProvider.updateMany(resource, {
      id: record.id,
      data: students.sort(sortByRoll),
    });
    refresh();
    notify(`Added ${count} Student`, { type: "success" });
    await callback(students.sort(sortByRoll));
  };

  return (
    <Button
      variant="text"
      color="primary"
      startIcon={<SaveIcon />}
      onClick={handleClose}
    >
      Save
    </Button>
  );
};
