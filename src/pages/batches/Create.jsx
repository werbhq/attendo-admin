import {
  required,
  number,
  Create,
  SimpleForm,
  NumberInput,
  TextInput,
  useRedirect,
  useRefresh,
  useNotify,
  SelectInput,
  BooleanInput,
  useDataProvider,
} from "react-admin";
import { useState, useMemo } from "react";
import { autoCapitalize } from "../../Utils/helpers";
import { dataProvider } from "../../provider/firebase";
import { MAPPING } from "../../provider/mapping";
import { convertSingleValueListToSelectList } from "../../Utils/helpers";
import { noSpaceValidation } from "../../Utils/validations";
import { Schemes } from "../../Utils/Schemes";
const url = MAPPING.BATCHES;
const BatchesCreate = () => {
  const dataProvider = useDataProvider();
  const [schemeData, setSchemeData] = useState([]);

  dataProvider.getList(MAPPING.SUBJECT).then((e) => {
    setSchemeData(e.data);
  });
  const {
    getBranches,
    getCourses,
    getSchemes,
    getSemesters,
    getSubjects,
    isDerived,
  } = new Schemes(schemeData);
  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();

  const onSubmit = async (data) => {
    const id = data.course.toLowerCase() + "-" + data.yearOfJoining;
    data.id = id;
    await dataProvider.create(url, { data, id });
    notify(`Added ${id}`, {
      type: "success",
    });
    refresh();
    redirect("list", url);
  };

  const [courses, setCourses] = useState([]);
  if (courses.length === 0) {
    dataProvider.getList(MAPPING.SEMESTERS).then((e) => {
      setCourses(e.data.map(({ id }) => id));
    });
  }

  const [data, setData] = useState({
    course: null,
    scheme: null,
    semester: null,
  });
  const possibleValues = ["BTECH", "MTECH"];
  const choices = possibleValues.map((value) => ({
    id: value,
    name: value,
  }));

  //to avoid glitching
  const schemeChoices = useMemo(() => getSchemes(data.course), [data.course]);

  return (
    <Create>
      <SimpleForm onSubmit={onSubmit} fullWidth={true}>
        <TextInput
          source="name"
          label="Batch Name"
          validate={[required()]}
          format={autoCapitalize}
        />
        <SelectInput
          source="course"
          choices={choices}
          validate={[required(), noSpaceValidation]}
          label="Course"
          onChange={(e) => setData({ ...data, course: e.target.value })}
        />
        <SelectInput
          source="schemeId"
          choices={schemeChoices}
          onChange={(e) => setData({ ...data, scheme: e.target.value })}
          required
        />
        <NumberInput
          source="yearOfJoining"
          onWheel={(e) => e.preventDefault()}
          validate={[required(), number("Number Required")]}
          label="Year Of Joining"
        />
        <SelectInput
          source="semester"
          onWheel={(e) => e.preventDefault()}
          validate={[required(), number("Number Required")]}
          choices={getSemesters(data.scheme)}
          onChange={(e) => setData({ ...data, semester: e.target.value })}
          label="Semester"
        />

        <BooleanInput source="running" validate={[required()]} />
      </SimpleForm>
    </Create>
  );
};
export default BatchesCreate;
