import {
  TextField,
  Datagrid,
  ListContextProvider,
  SimpleForm,
  TextInput,
  FunctionField,
  SaveButton,
  useRecordContext,
  useDataProvider,
  useList,
  useRefresh,
  useNotify,
  required,
} from "react-admin";
import InputLabel from "@mui/material/InputLabel";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState } from "react";
import { Dialog } from "@mui/material";
import { MAPPING } from "../../../provider/mapping";
import {
  CustomSubjectBulkDeleteButton,
  DeleteButtonDialouge,
} from "./CustomButtons";
import { noSpaceValidation } from "../../../Utils/validations";
import Button from "@mui/material/Button";

const url = MAPPING.SUBJECT;

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

const SubjectTable = () => {
  const data = useRecordContext();
  const refresh = useRefresh();
  const notify = useNotify();

  const [addSubject, setAddSubject] = useState({
    open: false,
    add: false,
    record: {},
  });
  const [semesterData, setsemesterData] = useState(
    data.semesters.length === 0 ? undefined : data.semesters[0]
  );
  const dataProvider = useDataProvider();
  const [branchData, setBranchData] = useState(
    semesterData?.branchSubs[0]?.branch || undefined
  );

  const tableData = useList({
    data:
      semesterData?.branchSubs.find((e) => e.branch === branchData)?.subjects ||
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
    newRecord.name = titleCase(newRecord.name);

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
            value={semesterData?.semester}
            defaultValue={semesterData?.semester}
            label="Semester"
            variant="standard"
            onChange={(value) => {
              const semester = data.semesters.find(
                (e) => e.semester === value.target.value
              );
              setsemesterData(semester);
              setBranchData(semester.branchSubs[0]?.branch);
            }}
          >
            {data.semesters.length !== 0 ? (
              data.semesters.map((e) => (
                <MenuItem key={e.semester} value={e.semester}>
                  {e.semester}
                </MenuItem>
              ))
            ) : (
              <MenuItem key={undefined} value={undefined}>
                No Data
              </MenuItem>
            )}
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
            {semesterData === undefined ||
            semesterData?.branchSubs.length === 0 ? (
              <MenuItem key={undefined} value={undefined}>
                No Data
              </MenuItem>
            ) : (
              semesterData?.branchSubs.map((e) => (
                <MenuItem key={e.branch} value={e.branch}>
                  {e.branch.toUpperCase()}
                </MenuItem>
              ))
            )}
          </Select>
        </Stack>
      </Stack>

      <Stack direction="row">
        <Button
          disabled={branchData === undefined || semesterData === undefined}
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
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
              semester={semesterData?.semester}
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
            validate={[required(), noSpaceValidation]}
          />
          <TextInput
            source="name"
            label="Name"
            format={(props) => titleCase(props)}
            fullWidth={true}
            validate={[required()]}
          />
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
