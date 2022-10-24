import { useState } from "react";
import {
  Create,
  SimpleForm,
  SelectInput,
  TextInput,
  required,
  number,
  useRefresh,
  useNotify,
  useRedirect,
  useDataProvider,
  NumberInput,
} from "react-admin";
import { MAPPING } from "../../provider/mapping";
import { convertSingleValueListToSelectList } from "../../Utils/helpers";
import { noSpaceValidation } from "../../Utils/validations";
const url = MAPPING.SUBJECT;

const SubjectCreate = () => {
  const dataProvider = useDataProvider();
  const [courses, setCourses] = useState([]);
  if (courses.length === 0) {
    dataProvider.getList(MAPPING.SEMESTERS).then((e) => {
      setCourses(e.data.map(({ id }) => id));
    });
  }

  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();

  const onSubmit = async (data) => {
    const id = `${data.course}-${data.organization}-${data.year}`;
    data = { id, ...data, semesters: [] };
    await dataProvider.create(url, { data, id: data.id });
    notify(`Added ${id}`, {
      type: "success",
    });
    refresh();
    redirect("list", url);
  };

  return (
    <Create>
      <SimpleForm onSubmit={onSubmit}>
        <TextInput
          source="organization"
          format={(props) => props.toUpperCase()}
          validate={[required(), noSpaceValidation]}
        />
        <NumberInput
          source="year"
          onWheel={(e) => e.preventDefault()}
          validate={[required(), number("Number Required")]}
          label="Year"
        />
        <SelectInput
          source="course"
          choices={courses.map(convertSingleValueListToSelectList)}
          validate={[required(), noSpaceValidation]}
          label="Course"
        />
      </SimpleForm>
    </Create>
  );
};

export default SubjectCreate;
