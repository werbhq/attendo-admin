import {
  TextField,
  Datagrid,
  useRecordContext,
  ListContextProvider,
  useList,
  SimpleForm,
  TextInput,
  Button,
  FunctionField,
  useDataProvider,
  useRefresh,
  useNotify,
  SaveButton,
  useListContext,
  useUnselectAll,
} from "react-admin";

import InputLabel from "@mui/material/InputLabel";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { MAPPING } from "../../../provider/mapping";

const resource = MAPPING.SUBJECT;

const CustomSubjectBulkDeleteButton = ({ semester, branch }) => {
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

const SubjectTable = () => {
  const data = useRecordContext();
  const url = MAPPING.SUBJECT;
  const refresh = useRefresh();
  const notify = useNotify();
  const [subjectAdd, setAddSubject] = useState({
    open: false,
    add: false,
    record: {},
  });
  const [semesterData, setsemesterData] = useState(data.semesters[0]);
  const dataProvider = useDataProvider();
  const [branch, setBranch] = useState(semesterData.branchSubs[0]?.branch);
  const [warn, setWarn] = useState(false);

  const tableData = useList({
    data:
      semesterData.branchSubs.find((e) => e.branch === branch)?.subjects || [],
  });

  const DeleteButtonDialouge = (record) => {
    return (
      <>
        <Button
          variant="outlined"
          color="error"
          size="medium"
          onClick={() => setWarn(true)}
          sx={{ verticalAlign: "text-top" }}
        >
          <DeleteIcon sx={{ verticalAlign: "text-top" }} />
          Delete
        </Button>

        <Dialog
          open={warn}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete Subject {record.record.code?.toUpperCase()}?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The data selected will Be Permanently removed. It could affect the
              previous attendances which have these subject. Are you sure you
              want to continue
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                handleDelete(record);
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

  const handleClose = () => {
    setAddSubject({ ...subjectAdd, open: false });
    setWarn(false);
  };

  const handleDelete = async ({ record }) => {
    const removeIndex = semesterData.branchSubs
      .find((e) => e.branch === branch)
      .subjects.findIndex((e) => e.id === record.id);

    const updatedData = data;
    updatedData.semesters
      .find((e) => e.semester === semesterData.semester)
      .branchSubs.find((e) => e.branch === branch)
      .subjects.splice(removeIndex, 1);

    await dataProvider.update(url, {
      id: data.id,
      data: updatedData,
      previousData: data,
    });

    refresh();
    notify("Classroom Inputed");
    handleClose();
  };

  const handleSubmit = async (newRecord) => {
    const currentData = semesterData.branchSubs.find(
      (e) => e.branch === branch
    ).subjects;
    const newData = currentData;
    const found = currentData.findIndex((e) => e.id === newRecord.id);
    if (found === -1) {
      newData.push({ ...newRecord, id: newRecord.code.toLowerCase() });
    } else newData[found] = { ...newRecord, id: newRecord.code.toLowerCase() };
    const updatedData = data;
    updatedData.semesters
      .find((e) => e.semester === semesterData.semester)
      .branchSubs.find((e) => e.branch === branch).subjects = newData;

    await dataProvider.update(url, {
      id: data.id,
      data: updatedData,
      previousData: data,
    });

    refresh();
    notify("Classroom Inputed");
    handleClose();
  };

  return (
    <Stack spacing={5}>
      <Stack direction="row" spacing={2}>
        <Stack>
          <InputLabel id="semester-label">Semester</InputLabel>
          <Select
            labelId="semester-label"
            value={semesterData.semester}
            defaultValue={semesterData.semester}
            label="Semester"
            variant="standard"
            onChange={(value) => {
              const semester = data.semesters.find(
                (e) => e.semester === value.target.value
              );
              setsemesterData(semester);
              setBranch(semester.branchSubs[0]?.branch || "No Data");
            }}
          >
            {data.semesters.map((e) => (
              <MenuItem value={e.semester}>{e.semester}</MenuItem>
            ))}
          </Select>
        </Stack>

        <Stack>
          <InputLabel id="branch-label">Branch</InputLabel>
          <Select
            labelId="branch-label"
            value={branch}
            defaultValue={branch}
            label="Branch"
            variant="standard"
            onChange={(e) => setBranch(e.target.value)}
          >
            {semesterData.branchSubs.length !== 0 ? (
              semesterData.branchSubs.map((e) => (
                <MenuItem value={e.branch}>{e.branch.toUpperCase()}</MenuItem>
              ))
            ) : (
              <MenuItem value={"No Data"}>No Data</MenuItem>
            )}
          </Select>
        </Stack>
      </Stack>

      <Stack direction="row">
        <Button
          variant="contained"
          size="medium"
          onClick={() => {
            setAddSubject({ ...subjectAdd, open: true, add: true, record: {} });
          }}
        >
          ADD SUBJECT
        </Button>
      </Stack>

      <ListContextProvider value={tableData} emptyWhileLoading>
        <Datagrid
          bulkActionButtons={
            <CustomSubjectBulkDeleteButton
              branch={branch}
              semester={semesterData.semester}
            />
          }
        >
          <TextField source="code" />
          <TextField source="name" />
          <FunctionField
            render={(record) => (
              <Button
                label="Edit"
                startIcon={<EditIcon />}
                onClick={() => {
                  setAddSubject({
                    ...subjectAdd,
                    open: true,
                    record: record,
                    add: false,
                  });
                }}
              />
            )}
          ></FunctionField>
        </Datagrid>
      </ListContextProvider>

      <Dialog open={subjectAdd.open} onClose={handleClose} fullWidth={true}>
        <SimpleForm
          record={subjectAdd.record}
          onSubmit={handleSubmit}
          toolbar={false}
        >
          <TextInput
            source="code"
            label="Code"
            fullWidth={true}
            format={(props) => props.toUpperCase()}
            required
          />
          <TextInput source="name" label="Name" fullWidth={true} required />
          <Stack direction="row" spacing={3}>
            <SaveButton label={subjectAdd.add ? "Add" : "Save"} />
            {!subjectAdd.add && (
              <DeleteButtonDialouge record={subjectAdd.record}>
                Delete
              </DeleteButtonDialouge>
            )}
          </Stack>
        </SimpleForm>
      </Dialog>
    </Stack>
  );
};

export default SubjectTable;
