import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useRecordContext,
  Button,
  useDataProvider,
  useRefresh,
  useNotify,
  useListContext,
  useUnselectAll,
  useRedirect,
} from "react-admin";
import { useState } from "react";
import { MAPPING } from "../../../provider/mapping";

const resource = MAPPING.CLASSROOMS;

export const CustomSubjectBulkDeleteButton = ({
  semester,
  branch,
  teacher,
  subject,
}) => {
  const dataProvider = useDataProvider();
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const { selectedIds } = useListContext();
  const unselectAll = useUnselectAll(resource);
  const count = selectedIds.length;

  const [showDeleteDialouge, setShowDeleteDialouge] = useState(false);

  const handleClose = () => setShowDeleteDialouge(!showDeleteDialouge);

  const handleDelete = async () => {
    const data = record;

    const subjects_new = data.subjects?.filter(
      (e) => !selectedIds.includes(e.id)
    );
    data.subjects = subjects_new;

    await dataProvider.update(resource, {
      id: record.id,
      data,
    });

    unselectAll();
    refresh();
    notify(`Deleted ${count} Subjects`, { type: "success" });
  };

  return (
    <div>
      <Button
        variant="text"
        label="Delete"
        startIcon={<DeleteIcon />}
        onClick={handleClose}
      />
      <Dialog open={showDeleteDialouge} keepMounted onClose={handleClose}>
        <DialogTitle>{"Are you sure you want to delete?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {count} Subjects
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button label="No" onClick={handleClose} />
          <Button
            label="Yes"
            onClick={async () => {
              handleDelete();
              handleClose();
            }}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};
