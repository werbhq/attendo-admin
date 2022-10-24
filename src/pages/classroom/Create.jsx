import { useState } from "react";
import {
  Create,
  SimpleForm,
  SelectInput,
  NumberInput,
  useDataProvider,
  ReferenceArrayInput,
  AutocompleteArrayInput,
} from "react-admin";
import { MAPPING } from "../../provider/mapping";

import { getClassroomId } from "../../Utils/helpers";
import { Schemes } from "../../Utils/Schemes";

const CreateClassroom = ({ schemes: schemeData }) => {
  const {
    getBranches,
    getCourses,
    getSchemes,
    getSemesters,
    getSubjects,
    isDerived,
  } = new Schemes(schemeData);

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

  const [data, setData] = useState({
    course: null,
    scheme: null,
    branch: null,
    name: null,
    semester: null,
  });

  return (
    <SimpleForm style={{ alignItems: "stretch" }} validate={validateClassroom}>
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
      <NumberInput source="year" onWheel={(e) => e.preventDefault()} required />
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
    </SimpleForm>
  );
};

const ClassroomsCreate = () => {
  const dataProvider = useDataProvider();
  const [schemeData, setData] = useState([]);
  if (schemeData.length === 0) {
    dataProvider.getList(MAPPING.SUBJECT).then((e) => setData(e.data));
  }

  const transformSubmit = (data) => {
    if (!new Schemes(null).isDerived(data.name)) {
      delete data.subjectId;
      delete data.parentClasses;
      delete data.semester;
      data.isDerived = false;
    } else {
      data.isDerived = true;
    }
    return {
      ...data,
      id: getClassroomId(data),
      students: [],
    };
  };

  return (
    schemeData.length !== 0 && (
      <Create transform={transformSubmit}>
        <CreateClassroom schemes={schemeData} />
      </Create>
    )
  );
};

export default ClassroomsCreate;
