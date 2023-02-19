import {
  TextField,
  Datagrid,
  ListContextProvider,
  SimpleForm,
  SaveButton,
  useRecordContext,
  useDataProvider,
  useList,
  useRefresh,
  useNotify,
  WrapperField,
  AutocompleteArrayInput,
  SelectInput,
} from "react-admin";
import MyTeacher from "./CustomTeacherField";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState } from "react";
import { Dialog } from "@mui/material";
import { MAPPING } from "../../../provider/mapping";
import { CustomSubjectBulkDeleteButton } from "../components/CustomButton";
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
    dataProvider
      .getOne(MAPPING.SUBJECT, { id: data.batch.schemeId })
      .then((e) => {
        //current sem from the classroom
        const sem = data.isDerived ? data.semester : data.batch.semester;
        //semester data from the subjects
        const semIndex = e.data.semesters.findIndex((g) => g.semester === sem);
        if (semIndex !== -1) {
          //current branch from classroom
          const branch = data.branch;
          if (e.data.semesters[semIndex] !== undefined) {
            //branch data from subject
            const branchIndex = e.data.semesters[semIndex].branchSubs.findIndex(
              (f) => f.branch === branch
            );
            const totalSemesters = e.data.semesters.length;
            const semesters = [];
            for (let i = 0; i < totalSemesters; i++)
              semesters.push(e.data.semesters[i]);
            setsemesterChoices(semesters); //list of semester data of each classroon
            setSemester(e.data.semesters[semIndex].semester); //current semester
            setBranchData(e.data.semesters[semIndex].branchSubs[branchIndex]); //branch data
          }
        }
      });
  }

  //subjects of the current semester..changes acc to semesters
  function subjectFind(value) {
    return value.semester === semester;
  }
  //teachers data
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
    open: false, //opening/closing the dialogue
    record: {}, //record regarding the current inputted data
  });

  //closes dialogue
  const handleClose = () => {
    setAddSubject({ ...addSubject, open: false });
  };

  const handleSubmit = async (newRecord) => {
    const oldData = data;
    const currentData = data.subjects === undefined ? [] : data.subjects;
    const newData_subjects = currentData; //adds the newRecord

    //subject in the newRecord
    const selected_subj = newRecord.Subject;
    //if the now added subject is already present in the classroom
    const foundIndata_subj =
      branchData.subjects === undefined
        ? []
        : branchData.subjects.filter((e) => selected_subj.includes(e.id));
    //foundInSubj has the index of the subject in the classroom
    const foundInSubj = [];
    for (let i = 0; i < selected_subj.length; i++) {
      foundInSubj.push(
        currentData.findIndex((e) => selected_subj[i].includes(e.subject.id))
      );
    }

    //teacher in the newRecord
    const selected_teacher = newRecord.Teachers.map((e) => e.id);
    //if the now added teacher is already present in the classroom
    const foundInTchr = teachers.filter((e) => selected_teacher.includes(e.id));

    for (let i = 0; i < newRecord.Subject.map((e) => e.id).length; i++) {
      //if a new subject is being added
      if (foundInSubj[i] !== -1) {
        const subject_index = currentData.indexOf(
          newData_subjects[foundInSubj[i]]
        );
        //to avoid tchr duplication
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
        //modify currentData with the new teachers array
        currentData[subject_index].teachers =
          newData_subjects[foundInSubj[i]].teachers;
      } else {
        newData_subjects.push({
          id: foundIndata_subj[i].id + "-" + foundInTchr[0].id + "-" + semester,
          subject: foundIndata_subj[i],
          teachers: foundInTchr,
          semester: semester,
        });
        //check if current data doesnt have any of the subjects in newdatasubjects
        for (let subject of newData_subjects) {
          if (!currentData.includes(subject)) currentData.push(subject);
        }
      }
    }
    data.subjects = currentData;
    await dataProvider.update(MAPPING.CLASSROOMS, {
      id: data.id,
      data: data,
      previousData: oldData,
    });
    refresh();
    notify("Classroom Subject Updated");
    handleClose();
  };
  //tableData for the listProvider
  const tableData = useList({
    data: data.subjects === undefined ? [] : data.subjects?.filter(subjectFind),
  });
  //for disabling of addsubject button where there is no data
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
            setAddSubject({ open: true, record: {} });
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
            <SaveButton label="Add" />
          </Stack>
        </SimpleForm>
      </Dialog>
    </Stack>
  );
};

export default ClassroomSubject;
