import {
  TextField,
  Datagrid,
  ListContextProvider,
  SimpleForm,
  TextInput,
  FunctionField,
  SaveButton,
  useRecordContext,
  useShowController,
  useDataProvider,
  useList,
  useRefresh,
  useNotify,
  required,
  WrapperField,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  SelectInput,
  ChipField,
} from "react-admin";
import MyTeacher from "./CustomTeacherField";
import InputLabel from "@mui/material/InputLabel";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState, useEffect, Chip } from "react";
import { Dialog } from "@mui/material";
import { MAPPING } from "../../../provider/mapping";
import { CustomSubjectBulkDeleteButton } from "../components/CustomButton";
import { noSpaceValidation } from "../../../Utils/validations";
import Button from "@mui/material/Button";

function titleCase(str) {
  var title_name = str
    .split(".")
    .map((word) =>
      word.length > 2
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.charAt(0).toUpperCase() +
          word.charAt(1).toUpperCase() +
          word.slice(2)
    )
    .toString()
    .replace(",", " ");
  return title_name;
}

const ClassroomSubject = () => {
  const data = useRecordContext();
  const refresh = useRefresh();
  const notify = useNotify();

  const [semester, setSemester] = useState(1);
  const [semesterChoices, setsemesterChoices] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const dataProvider = useDataProvider();
  const dataProvider1 = useDataProvider();

  if (semesterChoices.length === 0) {
    dataProvider.getOne(MAPPING.SUBJECT, { id: data.schemeId }).then((e) => {
      const sem = data.semester;
      const semIndex = e.data.semesters.findIndex((g) => g.semester === sem);
      if (semIndex !== -1) {
        const branch = data.branch;
        if (e.data.semesters[semIndex] !== undefined) {
          const branchIndex = e.data.semesters[semIndex].branchSubs.findIndex(
            (f) => f.branch === branch
          );
          const totalSemesters = e.data.semesters.length;
          const semesters = [];
          for (let i = 0; i < totalSemesters; i++)
            semesters.push(e.data.semesters[i]);
          setsemesterChoices(semesters);
          setSemester(e.data.semesters[semIndex].semester);
          setBranchData(e.data.semesters[semIndex].branchSubs[branchIndex]);
        }
      }
    });
  }
  function subjectFind(value) {
    return value.semester === semester;
  }

  const [teachers, setTeachers] = useState([]);

  if (teachers.length === 0) {
    dataProvider1.getList(MAPPING.AUTH_TEACHERS).then((e) => {
      const tchrs = [];
      for (let i = 0; i < e.data.length; i++) {
        let tchr_obj = {
          id: e.data[i].id,
          emailId: e.data[i].email,
          name: titleCase(e.data[i].userName),
        };
        tchrs.push(tchr_obj);
      }
      setTeachers(tchrs);
    });
  }
  const [addSubject, setAddSubject] = useState({
    open: false,
    add: false,
    record: {},
  });
  const handleClose = () => {
    setAddSubject({ ...addSubject, open: false });
  };

  const handleSubmit = async (newRecord) => {
    const oldData = data;
    const currentData = data.subjects === undefined ? [] : data.subjects;
    const newData_subjects = currentData;

    const selected_subj = newRecord.Subject;
    const foundIndata_subj =
      branchData.subjects === undefined
        ? []
        : branchData.subjects.filter((e) => selected_subj.includes(e.id));

    const foundInSubj = [];
    for (let i = 0; i < selected_subj.length; i++) {
      foundInSubj.push(
        currentData.findIndex((e) => selected_subj[i].includes(e.subject.id))
      );
    }
    const selected_teacher = newRecord.Teachers.map((e) => e.id);
    const foundInTchr = teachers.filter((e) => selected_teacher.includes(e.id));
    for (let i = 0; i < newRecord.Subject.map((e) => e.id).length; i++) {
      if (foundInSubj[i] !== -1) {
        let subject_index;
        for (let k = 0; k < currentData.length; k++) {
          if (currentData[k] === newData_subjects[foundInSubj[i]]) {
            subject_index = k;
          }
        }
        for (let j = 0; j < foundInTchr.length; j++) {
          const a = foundInTchr[j];
          if (
            currentData[foundInSubj[i]].teachers.filter((e) => e.id === a.id)
              .length === 0
          )
            newData_subjects[foundInSubj[i]].teachers.push(foundInTchr[j]);
          else {
            refresh();
            notify(` ${a.name} is already present`);
            handleClose();
          }
        }
        currentData[subject_index].teachers =
          newData_subjects[foundInSubj[i]].teachers;
      } else {
        newData_subjects.push({
          id: foundIndata_subj[i].id + "-" + foundInTchr[0].id + "-" + semester,
          subject: foundIndata_subj[i],
          teachers: foundInTchr,
          semester: semester,
        });
        for (let subject of newData_subjects) {
          if (!currentData.includes(subject)) currentData.push(subject);
        }
      }
    }

    await dataProvider.update(MAPPING.CLASSROOMS, {
      id: data.id,
      data: data,
      previousData: oldData,
    });
    refresh();
    notify("Classroom Subject Updated");
    handleClose();
  };

  const tableData = useList({
    data: data.subjects === undefined ? [] : data.subjects?.filter(subjectFind),
  });
  function check_subject() {
    let a = false;
    if (semesterChoices.length === 0) {
      a = true;
    } else if (branchData !== undefined) {
      branchData.subjects !== undefined
        ? branchData.subjects.length !== 0
          ? (a = false)
          : (a = true)
        : (a = false);
    } else if (branchData === undefined) {
      a = true;
    }

    return a;
  }

  return (
    <Stack spacing={5}>
      <Stack direction="row" spacing={2}>
        <Select
          value={semester}
          label="Semester"
          onChange={(value) => {
            const semDetails = semesterChoices?.find(
              (e) => e.semester === value.target.value
            );
            if (semDetails !== undefined) {
              const branchIndex = semDetails.branchSubs.findIndex(
                (f) => f.branch === data.branch
              );
              setSemester(semDetails.semester);
              setBranchData(semDetails.branchSubs[branchIndex]);
            }
            //   setBranchData(semesterChoices.branchSubs[0]?.branch);
          }}
          sx={{ width: "60px" }}
        >
          {semesterChoices.map((e) => (
            <MenuItem value={e.semester} key={e.semester}>
              {e.semester}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <Stack direction="row">
        <Button
          disabled={check_subject()}
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
          onClick={() => {
            setAddSubject({ open: true, add: true, record: {} });
          }}
        >
          ADD SUBJECT
        </Button>
      </Stack>

      <ListContextProvider value={tableData}>
        <Datagrid
          bulkActionButtons={
            <CustomSubjectBulkDeleteButton
              semester={semester}
              branch={branchData}
              teacher={teachers}
              subject={data.subjects}
            />
          }
        >
          <WrapperField label="Subject">
            <TextField source="subject.code" label="Code" /> -{" "}
            <TextField source="subject.name" label="Name" />
          </WrapperField>
          <WrapperField label="Teacher">
            <MyTeacher></MyTeacher>
          </WrapperField>
        </Datagrid>
      </ListContextProvider>
      <Dialog open={addSubject.open} onClose={handleClose} fullWidth={true}>
        <SimpleForm
          record={addSubject.record}
          onSubmit={handleSubmit}
          toolbar={false}
        >
          <SelectInput
            source="Subject"
            parse={(value) => [value]}
            choices={branchData?.subjects}
            optionText={(choice) => `${choice.code} - ${choice.name}`}
            filterToQuery={(searchText) => ({ id: searchText })}
            emptyText="No Option"
            isRequired
          />
          <AutocompleteArrayInput
            source="Teachers"
            parse={(value) => value && value.map((v) => ({ id: v }))}
            format={(value) => value && value.map((v) => v.id)}
            choices={teachers}
            optionText={(choice) => `${titleCase(choice.name)}`}
            filterToQuery={(searchText) => ({ id: searchText })}
            emptyText="No Option"
            sx={{ minWidth: 300 }}
            isRequired
          />
          <Stack direction="row" spacing={3}>
            <SaveButton label={addSubject.add ? "Add" : "Save"} />
          </Stack>
        </SimpleForm>
      </Dialog>
    </Stack>
  );
};

export default ClassroomSubject;
