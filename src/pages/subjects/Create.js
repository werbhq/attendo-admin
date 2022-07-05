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
} from "react-admin";
import { MAPPING } from "../../provider/mapping";
import { convertSingleValueListToSelectList } from "../../Utils/helpers";
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

  const upperCaseValidation = (value) => {
    if (value.toUpperCase() !== value) return "UPPER CASE ONLY!";
    else return undefined;
  };

  return (
    <Create>
      <SimpleForm onSubmit={onSubmit}>
        <TextInput
          source="organization"
          validate={[required(), upperCaseValidation]}
        />
        <TextInput
          source="year"
          validate={[required(), number("not a number")]}
          label="year"
        />
        <SelectInput
          source="course"
          choices={courses.map(convertSingleValueListToSelectList)}
          validate={[required(), upperCaseValidation]}
          label="course"
        />
      </SimpleForm>
    </Create>
  );
};

export default SubjectCreate;
