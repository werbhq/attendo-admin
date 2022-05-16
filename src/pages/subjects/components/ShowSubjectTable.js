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

const SubjectTable = () => {
  const [subjectAdd, setSubject] = useState({
    open: false,
    add: false,
    record: {},
  });
  const data = useRecordContext();
  const url = MAPPING.SUBJECT;
  const refresh = useRefresh();
  const notify = useNotify();
  const [semesterData, setsemesterData] = useState(data.semesters[0]);
  const dataProvider = useDataProvider();

  const [branch, setBranch] = useState(semesterData.branchSubs[0].branch);
  const [warn, setWarn] = useState(false);

  const tableData = useList({
    data: semesterData.branchSubs.find((e) => e.branch === branch).subjects,
  });

  const handleClick = (record) => {
    setSubject({ ...subjectAdd, open: true, record: record });
  };

  const handleClickOpen = () => {
    setWarn(true);
  };

  const CDeleteButton = (record) => {
   

    return (
      <>
        <Button
          variant="outlined"
          color="error"
          size="medium"
          onClick={handleClickOpen}
          sx={{verticalAlign: 'text-top'}}
        >
          <DeleteIcon sx={{verticalAlign: 'text-top'}}/>
          Delete
        </Button>

        <Dialog
          open={warn}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Permanent Removal!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The data selected will Be <em>Permanently</em> removed are you
              sure you want to continue
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
    setSubject({ ...subjectAdd, open: false });
    setWarn(false);
  };

  const handleDelete = async ({ record }) => {
    const removeIndex = semesterData.branchSubs
      .find((e) => e.branch === branch)
      .subjects.findIndex((e) => e.id === record.id);
    console.log(removeIndex);
    const updatedData = data;
    updatedData.semesters
      .find((e) => e.semester === semesterData.semester)
      .branchSubs.find((e) => e.branch === branch)
      .subjects.splice(removeIndex, 1);
    console.log(updatedData);

    await dataProvider
    .update(url,{id:data.id ,data: updatedData, previousData: data
    })
    .then(response => {
        console.log(response); // { id: 123, title: "hello, world" }
    });
    refresh();
    notify('Classroom Inputed');
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

    await dataProvider
      .update(url, { id: data.id, data: updatedData, previousData: data })
      .then((response) => {
        console.log(response); // { id: 123, title: "hello, world" }
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
            onChange={(value) =>
              setsemesterData(
                data.semesters.find((e) => e.semester === value.target.value)
              )
            }
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
            {semesterData.branchSubs.map((e) => (
              <MenuItem value={e.branch}>{e.branch.toUpperCase()}</MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>
      <Stack direction="row">
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            setSubject({ ...subjectAdd, open: true, add: true, record: {} });
          }}
        >
          ADD SUBJECT
        </Button>
      </Stack>
      <ListContextProvider value={tableData} emptyWhileLoading>
        <Datagrid>
          <TextField source="code" />
          <TextField source="name" />
          <FunctionField
            render={(record) => (
              <Button
                label="Edit"
                startIcon={<EditIcon />}
                onClick={() => {
                  handleClick(record);
                }}
              />
            )}
          ></FunctionField>
          <Dialog open={subjectAdd.open} onClose={handleClose} fullWidth={true}>
            <SimpleForm
              record={subjectAdd.record}
              onSubmit={handleSubmit}
              toolbar={false}
            >
              <TextInput source="id" label="Id" disabled />
              <TextInput source="code" label="Code" fullWidth={true}/>
              <TextInput source="name" label="Name" fullWidth={true}/>
              <Stack direction="row" spacing={3}>
                <SaveButton />
                <CDeleteButton record={subjectAdd.record} >Delete</CDeleteButton>
              </Stack>
            </SimpleForm>
          </Dialog>
        </Datagrid>
      </ListContextProvider>
    </Stack>
  );
};

export default SubjectTable;
