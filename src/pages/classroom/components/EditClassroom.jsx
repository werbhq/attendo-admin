import * as React from "react";
import Dialog from "@mui/material/Dialog";

import {
  NumberInput,
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

const resource = MAPPING.CLASSROOMS;

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
    course: record.course,
    scheme: record.schemeId,
    branch: record.branch,
    name: record.name,
    semester: record?.semester,
  });

  const handleSave = async (newRecord) => {
    if (!isDerived(newRecord.name)) {
      delete newRecord.subjectId;
      delete newRecord.parentClasses;
      delete newRecord.semester;
      newRecord.isDerived = false;
    } else {
      delete newRecord.subjectName;
      newRecord.isDerived = true;
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

    customValidator(getSchemes(data.course), "schemeId");
    customValidator(getBranches(data.scheme), "branch");
    customValidator(Schemes.classNames, "name");
    if (isDerived(values.name)) {
      customValidator(getSemesters(data.scheme), "semester");
      customValidator(
        getSubjects(data.scheme, data.branch, data.semester),
        "subjectId"
      );
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
      >
        <SelectInput
          source="course"
          choices={getCourses()}
          onChange={(e) => setData({ ...data, course: e.target.value })}
          required
        />
        <SelectInput
          source="schemeId"
          choices={getSchemes(data.course)}
          onChange={(e) => setData({ ...data, scheme: e.target.value })}
          required
        />
        <NumberInput
          source="year"
          onWheel={(e) => e.preventDefault()}
          required
        />
        <SelectInput
          source="branch"
          choices={getBranches(data.scheme)}
          onChange={(e) => setData({ ...data, branch: e.target.value })}
          required
        />
        <SelectInput
          source="name"
          choices={data.branch ? Schemes.classNames : []}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
        {isDerived(data.name) && (
          <>
            <SelectInput
              source="semester"
              choices={getSemesters(data.scheme)}
              onChange={(e) => setData({ ...data, semester: e.target.value })}
              required
            />
            <SelectInput
              source="subjectId"
              choices={
                data.semester
                  ? getSubjects(data.scheme, data.branch, data.semester)
                  : []
              }
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
              />
            </ReferenceArrayInput>
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
