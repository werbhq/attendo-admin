import {
  Create,
  SimpleForm,
  TextInput,
  required,
  number,
  useRefresh,
  useNotify,
  useRedirect,
} from "react-admin";
import { dataProvider } from "../../provider/firebase";
import { MAPPING } from "../../provider/mapping";
const url = MAPPING.SUBJECT;

const PostCreate = () => {
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
          fullWidth
        />
        <TextInput
          source="year"
          validate={[required(), number("not a number")]}
          label="year"
          fullWidth
        />
        <TextInput
          source="course"
          validate={[required(), upperCaseValidation]}
          label="course"
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};

export default PostCreate;
