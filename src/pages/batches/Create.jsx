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
} from "react-admin";
import { useState } from "react";
import { autoCapitalize } from "../../Utils/helpers";
import { dataProvider } from "../../provider/firebase";
import { MAPPING } from "../../provider/mapping";
import { convertSingleValueListToSelectList } from "../../Utils/helpers";
import { noSpaceValidation } from "../../Utils/validations";
const url = MAPPING.BATCHES;
const BatchesCreate = () => {
  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();

  const onSubmit = async (data) => {
    console.log(data);
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

  return (
    <Create>
      <SimpleForm onSubmit={onSubmit} fullWidth={true}>
        <TextInput
          source="name"
          label="Batch Name"
          validate={[required()]}
          format={autoCapitalize}
        />
        <TextInput
          source="schemeId"
          label="Scheme Id"
          validate={[required()]}
          format={autoCapitalize}
        />
        <NumberInput
          source="yearOfJoining"
          onWheel={(e) => e.preventDefault()}
          validate={[required(), number("Number Required")]}
          label="Year Of Joining"
        />
        <NumberInput
          source="semester"
          onWheel={(e) => e.preventDefault()}
          validate={[required(), number("Number Required")]}
          label="Semester"

        />
        <SelectInput
          source="course"
          choices={courses.map(convertSingleValueListToSelectList)}
          validate={[required(), noSpaceValidation]}
          label="Course"
        />
        <BooleanInput source="running" validate={[required()]} />
      </SimpleForm>
    </Create>
  );
};
export default BatchesCreate;
