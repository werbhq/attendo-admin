import * as React from "react";
import Dialog from "@mui/material/Dialog";

import {
  SimpleForm,
  useDataProvider,
  useRecordContext,
  useRefresh,
  useNotify,
  SaveButton,
  SelectInput,
  DeleteWithConfirmButton,
  useRedirect,
  AutocompleteArrayInput,
  ReferenceArrayInput,
} from "react-admin";
import { MAPPING } from "../../../provider/mapping";
import { Stack } from "@mui/material";
import { Schemes } from "../../../Utils/Schemes";
import { useState } from "react";

const resource = MAPPING.CLASSROOMS;
function titleCase(str) {
  var title_name =
    str !== undefined
      ? str
          .split(".")
          .map((word) =>
            word.length > 2
              ? word.charAt(0).toUpperCase() + word.slice(1)
              : word.charAt(0).toUpperCase() +
                word.charAt(1).toUpperCase() +
                word.slice(2)
          )
          .toString()
          .replace(",", " ")
      : " ";
  return title_name;
}

export default function EditClassroom({ state }) {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();
  const record = useRecordContext();
  const { setdialouge, dialouge } = state;
  const {
    getBranches,
    getCourses,
    getSchemes,
    getSemesters,
    getSubjects,
    isDerived,
  } = new Schemes(dialouge.schemes.data);

  const [data, setData] = React.useState({
    course: record.batch.course,
    scheme: record.batch.schemeId,
    branch: record.branch,
    name: record.name,

    semester: isDerived(record.name) ? record.semester : record.batch.semester,
    batch: record.batch.name,
  });
  const [teachers, setTeachers] = useState([]);
  const dataProvider1 = useDataProvider();

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
  const [batch, setBatch] = useState([]);
  const dataProvider2 = useDataProvider();
  if (batch.length === 0) {
    dataProvider2.getList(MAPPING.BATCHES).then((e) => {
      const batches = [];
      for (let i = 0; i < e.data.length; i++) {
        let batch_obj = {
          id: e.data[i].name,
          name: e.data[i].name,
        };
        batches.push(batch_obj);
      }
      setBatch(batches);
    });
  }
  const handleSave = async (newRecord) => {
    if (!isDerived(newRecord.name)) {
      delete newRecord.subject.name;
      delete newRecord.parentClasses;
      delete newRecord.semester;
      delete newRecord.teachers;
      newRecord.isDerived = false;
    } else {
      delete newRecord.subjectName;
      newRecord.isDerived = true;
      const selected_teacher = newRecord.teachers.map((e) => e.id);
      const foundInTchr = teachers.filter((e) =>
        selected_teacher.includes(e.id)
      );
      const new_teachers = [];
      for (let teacher of newRecord.teachers) {
        for (let tchr of foundInTchr) {
          if (tchr.id === teacher.id) {
            new_teachers.push(tchr);
          }
        }
      }
      newRecord.teachers = new_teachers;
      const data_subjects = getSubjects(
        data.scheme,
        data.branch,
        data.semester
      );

      const subj =
        data_subjects === undefined
          ? null
          : data_subjects.find((e) => e.id === newRecord.subject.id);
      newRecord.subject = {};
      newRecord.subject.id = subj.id;
      newRecord.subject.code = subj.id.toUpperCase();
      newRecord.subject.name = subj.name;
    }
    delete newRecord.students;

    await dataProvider.update(resource, {
      id: newRecord.id,
      data: newRecord,
    });
    refresh();
    notify(`Edited ${newRecord.id}`, {
      type: "success",
    });
    setdialouge(false);
  };

  const validateClassroom = (values) => {
    const errors = {};
    const id = (e) => e.id;

    const customValidator = (data, fieldName) => {
      if (!data.map(id).includes(values[fieldName])) {
        errors[fieldName] = "ra.validation.required";
      }
    };

    //  customValidator(getSchemes(data.course), "batch.schemeId");
    customValidator(getBranches(data.scheme), "branch");
    customValidator(Schemes.classNames, "name");
    if (isDerived(values.name)) {
      customValidator(getSemesters(data.scheme), "semester");
      // customValidator(
      //   getSubjects(data.scheme, data.branch, data.semester),
      //   "subject.name"
      // );
    }
    return errors;
  };

  return (
    <Dialog
      open={dialouge.enable}
      onClose={() => setdialouge({ ...dialouge, enable: false })}
      fullWidth={true}
    >
      <SimpleForm
        defaultValues={record}
        toolbar={false}
        style={{ alignItems: "stretch" }}
        resource={resource}
        onSubmit={handleSave}
        validate={validateClassroom}
        disabled={true}
      >
        <SelectInput
          label="Course"
          source="batch.course"
          choices={getCourses()}
          onChange={(e) => setData({ ...data, course: e.target.value })}
          required
          disabled={true}
        />
        <SelectInput
          label="Scheme Id"
          source="batch.schemeId"
          choices={getSchemes(data.course)}
          onChange={(e) => setData({ ...data, scheme: e.target.value })}
          required
          disabled={true}
        />

        <SelectInput
          source="batch.name"
          label="Batch Name"
          choices={batch}
          onChange={(e) => setData({ ...data, batch: e.target.value })}
          required
          disabled={true}
        />

        <SelectInput
          source="branch"
          choices={getBranches(data.scheme)}
          onChange={(e) => setData({ ...data, branch: e.target.value })}
          required
          disabled={true}
        />
        <SelectInput
          source="name"
          choices={data.branch ? Schemes.classNames : []}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          disabled={true}
          required
        />
        {isDerived(data.name) && (
          <>
            <SelectInput
              source="semester"
              choices={getSemesters(data.scheme)}
              onChange={(e) => setData({ ...data, semester: e.target.value })}
              required
              disabled={true}
            />
            <SelectInput
              source="subject.id"
              label="Subject"
              choices={
                data.semester
                  ? getSubjects(data.scheme, data.branch, data.semester)
                  : []
              }
              // disabled={
              //   getSubjects(data.scheme, data.branch, data.semester).length ===
              //   0
              //     ? true
              //     : false
              // }
              disabled={true}
              required
            />
            <ReferenceArrayInput
              source="parentClasses"
              reference={MAPPING.CLASSROOMS}
              filter={{ isDerived: false }}
              isRequired
            >
              <AutocompleteArrayInput
                optionText="id"
                source="id"
                filterToQuery={(searchText) => ({ id: searchText })}
                isRequired
                disabled={true}
              />
            </ReferenceArrayInput>
            <AutocompleteArrayInput
              source="teachers"
              parse={(value) => value && value.map((v) => ({ id: v }))}
              format={(value) => value && value.map((v) => v.id)}
              choices={teachers}
              optionText={(choice) => `${titleCase(choice.name)}`}
              filterToQuery={(searchText) => ({ id: searchText })}
              emptyText="No Option"
              sx={{ minWidth: 300 }}
              isRequired
            />
          </>
        )}
        <Stack direction="row" spacing={2}>
          <SaveButton label="Save" />
          <DeleteWithConfirmButton
            variant="outlined"
            size="medium"
            color="inherit"
            confirmTitle=""
            confirmContent="You will not be able to recover this classroom. Are you sure?"
            mutationOptions={{
              onSuccess: () => {
                notify("Classroom Deleted");
                redirect("list", MAPPING.CLASSROOMS);
              },
            }}
          />
        </Stack>
      </SimpleForm>
    </Dialog>
  );
}
