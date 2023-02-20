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
import { MAPPING } from "../../provider/mapping";
import { noSpaceValidation } from "../../Utils/validations";
import { Schemes } from "../../Utils/Schemes";
const url = MAPPING.BATCHES;
const BatchesCreate = () => {
  const dataProvider = useDataProvider();
  const [schemeData, setSchemeData] = useState([]);
  if (schemeData.length === 0) {
    dataProvider.getList(MAPPING.SUBJECT).then((e) => {
      setSchemeData(e.data);
    });
  }
  const { getSchemes, getSemesters } = new Schemes(schemeData);
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
  // eslint-disable-next-line
  const schemeChoices = useMemo(() => getSchemes(data.course), [data.course]);
  const validateBatches = (values) => {
    const errors = {};
    const id = (e) => e.id;

    const customValidator = (data, fieldName) => {
      if (!data.map(id).includes(values[fieldName])) {
        errors[fieldName] = "ra.validation.required";
      }
    };
    customValidator(choices, "course");
    customValidator(schemeChoices, "schemeId");
    customValidator(getSemesters(data.scheme), "semester");
    return errors;
  };
  return (
    <Create>
      <SimpleForm onSubmit={onSubmit} validate={validateBatches}>
        <TextInput source="name" label="Batch Name" validate={[required()]} />
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
          disabled={schemeChoices.length === 0 ? true : false}
          filter={{ course: data.course }}
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
          choices={getSemesters(data.scheme)}
          onChange={(e) => setData({ ...data, semester: e.target.value })}
          disabled={getSemesters(data.scheme).length === 0 ? true : false}
          required
        />

        <BooleanInput source="running" validate={[required()]} />
      </SimpleForm>
    </Create>
  );
};
export default BatchesCreate;
