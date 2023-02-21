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
import { noSpaceValidation } from "../../Utils/validations";
const url = MAPPING.SUBJECT;

const SubjectCreate = () => {
  const dataProvider = useDataProvider();
  const possibleValues = ["BTECH", "MTECH"];
  const choices = possibleValues.map((value) => ({
    id: value,
    name: value,
  }));

  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();

  const onSubmit = async (data) => {
    const id = `${data.course}-${data.organization}-${data.year}`;
    data = { id, ...data, semesters: [] };
    try {
      await dataProvider.create(url, { data, id: data.id });
      notify(`Added ${id}`, {
        type: "success",
      });
      refresh();
      redirect("list", url);
    } catch (error) {
      notify(error.message, {
        type: "error",
      });
    }
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
          choices={choices}
          validate={[required(), noSpaceValidation]}
          label="Course"
        />
      </SimpleForm>
    </Create>
  );
};

export default SubjectCreate;
