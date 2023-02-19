import { useState } from "react";
import {
  Create,
  SimpleForm,
  SelectInput,
  useDataProvider,
  ReferenceArrayInput,
  AutocompleteArrayInput,
} from "react-admin";
import { MAPPING } from "../../provider/mapping";

import { getClassroomId } from "../../Utils/helpers";
import { Schemes } from "../../Utils/Schemes";
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

const CreateClassroom = ({ schemes: schemeData }) => {
  const { getBranches, getSemesters, getSubjects, isDerived } = new Schemes(
    schemeData
  );
  const [data, setData] = useState({
    course: null,
    scheme: null,
    branch: null,
    name: null,
    semester: null,
    batch: null,
  });
  const [batch, setBatch] = useState([]);
  const [batchData, setBatchData] = useState([]);
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
      setBatchData(e.data);
      setBatch(batches);
    });
  }
  function changeBatch(a) {
    setData({ ...data, batch: a });
    if (isDerived(data.name)) {
      setData({
        ...data,
        scheme: batchData.find((e) => e.name === a).schemeId,
      });
    } else {
      setData({
        ...data,
        scheme: batchData.find((e) => e.name === a).schemeId,
        semester: batchData.find((e) => e.name === a).semester,
      });
    }
  }

  const validateClassroom = (values) => {
    const errors = {};
    const id = (e) => e.id;
    const customValidator = (data, fieldName) => {
      if (!data.map(id).includes(values[fieldName])) {
        errors[fieldName] = "ra.validation.required";
      }
    };
    customValidator(getBranches(data.scheme), "branch");
    customValidator(Schemes.classNames, "name");
    if (isDerived(values.name)) {
      customValidator(
        getSubjects(data.scheme, data.branch, data.semester),
        "subjectId"
      );
      customValidator(getSemesters(data.scheme), "semester");
    }
    return errors;
  };

  return (
    <SimpleForm style={{ alignItems: "stretch" }} validate={validateClassroom}>
      <SelectInput
        source="batch.name"
        choices={batch}
        onChange={(e) => changeBatch(e.target.value)}
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
            disabled={
              getSubjects(data.scheme, data.branch, data.semester).length === 0
                ? true
                : false
            }
            required
          />
          
          <ReferenceArrayInput
            source="parentClasses"
            reference={MAPPING.CLASSROOMS}
            filter={{ isDerived: false, branch:data.branch}}
          >
            <AutocompleteArrayInput
              optionText="id"
              source="id"
              filterToQuery={(searchText) => ({ id: searchText })}
              isRequired
            />
          </ReferenceArrayInput>
          <ReferenceArrayInput
            source="teachers"
            reference={MAPPING.AUTH_TEACHERS}
            filter={{ isDerived: false }}
          >
            <AutocompleteArrayInput
              parse={(value) => value && value.map((v) => ({ id: v }))}
              format={(value) => value && value.map((v) => v.id)}
              optionText={(choice) => `${titleCase(choice.userName)}`}
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
  const [batchData, setBatchData] = useState([]);
  const dataProvider2 = useDataProvider();
  dataProvider2.getList(MAPPING.BATCHES).then((e) => {
    setBatchData(e.data);
  });
  const transformSubmit = (data) => {
    data.batch = batchData.find((e) => e.name === data.batch.name);
    if (!new Schemes(null).isDerived(data.name)) {
      delete data.subjectId;
      delete data.parentClasses;
      delete data.semester;
      data.isDerived = false;
    } else {
      const scheme = schemeData.find((e) => e.id === data.batch.schemeId);
      const sem = scheme.semesters.find((e) => e.semester === data.semester);
      const brnch = sem.branchSubs.find((e) => e.branch === data.branch);
      const sub = brnch.subjects.find((e) => e.id === data.subjectId);

      const selected_teacher = data.teachers.map((e) => e.id);
      const foundInTchr = teachers.filter((e) =>
        selected_teacher.includes(e.id)
      );
      const new_teachers = [];
      for (let teacher of data.teachers) {
        for (let tchr of foundInTchr) {
          if (tchr.id === teacher.id) {
            new_teachers.push(tchr);
          }
        }
      }

      data.teachers = new_teachers;
      data.subject = {};
      data.subject = sub;
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
