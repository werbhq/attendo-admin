import {
  Button as B,
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

const resource = MAPPING.SUBJECT;





export const CustomSubjectBulkDeleteButton = ({ semester, branch }) => {
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
    const classInSemIndex = data.semesters.findIndex(
      (e) => e.semester === semester
    );

    if (classInSemIndex !== -1) {
      const selectedBranchIndex = data.semesters[
        classInSemIndex
      ]?.branchSubs?.findIndex((e) => e.branch === branch);

      if (selectedBranchIndex !== -1) {
        const subjects = data.semesters[classInSemIndex].branchSubs[
          selectedBranchIndex
        ]?.subjects?.filter((e) => !selectedIds.includes(e.id));

        data.semesters[classInSemIndex].branchSubs[
          selectedBranchIndex
        ].subjects = subjects;
      }
    }

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

export const DeleteButtonDialouge = ({
  record,
  handleDelete,
}) => {
  const [flag,setFlag] = useState(false);
  const handleClose = () => setFlag(false);
  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        size="medium"
        onClick={() => setFlag(true)}
        sx={{ verticalAlign: "text-top" }}
      >
        <DeleteIcon sx={{ verticalAlign: "text-top" }} />
         Delete
      </Button>

      <Dialog
        open={flag}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          { record ? `Delete Subject ${record.code?.toUpperCase()}` : `Delete The Whole Table`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The data selected will Be Permanently removed. It could affect the
            previous attendances which have these subject. Are you sure you want
            to continue
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button
            onClick={() => {
              record ? handleDelete(record) : handleDelete() ;
              handleClose();
              notify(`Deleted`, { type: 'warning' });
              refresh();
              !record && redirect('list', MAPPING.SUBJECT);
              
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const CustomAdd = ({ name }) => <B variant="contained">{name}</B>;

// todo : color error fix
export const CustomDelete = () => (
  <IconButton aria-label="delete" size="large" color="error">
    <DeleteIcon fontSize="inherit" />
  </IconButton>
);
