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
import { Dialog } from "@mui/material";
import { MAPPING } from "../../../provider/mapping";
import {
  CustomSubjectBulkDeleteButton,
  DeleteButtonDialouge,
} from "./CustomButton";

const SubjectTable = () => {
  const data = useRecordContext();
  const url = MAPPING.SUBJECT;
  const refresh = useRefresh();
  const notify = useNotify();
  const [addSubject, setAddSubject] = useState({
    open: false,
    add: false,
    record: {},
  });
  const [semesterData, setsemesterData] = useState(data.semesters[0] || 0);
  const dataProvider = useDataProvider();
  const [branchData, setBranchData] = useState(
    semesterData.branchSubs[0]?.branch || `NODATA`
  );

  const tableData = useList({
    data:
      semesterData.branchSubs.find((e) => e.branch === branchData)?.subjects ||
      [],
  });

  const handleClose = () => {
    setAddSubject({ ...addSubject, open: false });
  };

  const handleDelete = async (record) => {
    const removeIndex = semesterData.branchSubs
      .find((e) => e.branch === branchData)
      .subjects.findIndex((e) => e.id === record.id);

    const updatedData = data;
    updatedData.semesters
      .find((e) => e.semester === semesterData.semester)
      .branchSubs.find((e) => e.branch === branchData)
      .subjects.splice(removeIndex, 1);

    await dataProvider.update(url, {
      id: data.id,
      data: updatedData,
      previousData: data,
    });
    handleClose();
    refresh();
    notify("Classroom Inputed");
  };

  const handleSubmit = async (newRecord) => {
    const currentData = semesterData.branchSubs.find(
      (e) => e.branch === branchData
    ).subjects;
    const newData = currentData;
    const found = currentData.findIndex((e) => e.id === newRecord.id);
    if (found === -1) {
      newData.push({ ...newRecord, id: newRecord.code.toLowerCase() });
    } else newData[found] = { ...newRecord, id: newRecord.code.toLowerCase() };
    const updatedData = data;
    updatedData.semesters
      .find((e) => e.semester === semesterData.semester)
      .branchSubs.find((e) => e.branch === branchData).subjects = newData;

    await dataProvider.update(url, {
      id: data.id,
      data: updatedData,
      previousData: data,
    });

    refresh();
    notify("Classroom Subject Updated");
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
              setBranchData(semester.branchSubs[0]?.branch || "No Data");
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
            value={branchData}
            defaultValue={branchData}
            label="Branch"
            variant="standard"
            onChange={(e) => setBranchData(e.target.value)}
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
            setAddSubject({ ...addSubject, open: true, add: true, record: {} });
          }}
        >
          ADD SUBJECT
        </Button>
      </Stack>

      <ListContextProvider value={tableData} emptyWhileLoading>
        <Datagrid
          bulkActionButtons={
            <CustomSubjectBulkDeleteButton
              branch={branchData}
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
                    ...addSubject,
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

      <Dialog open={addSubject.open} onClose={handleClose} fullWidth={true}>
        <SimpleForm
          record={addSubject.record}
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
            <SaveButton label={addSubject.add ? "Add" : "Save"} />
            {!addSubject.add && (
              <DeleteButtonDialouge
                record={addSubject.record}
                handleDelete={handleDelete}
              >
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
