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
} from "react-admin";
import { autoCapitalize } from "../../Utils/helpers";
import { dataProvider } from "../../provider/firebase";
import { MAPPING } from "../../provider/mapping";
const url = MAPPING.SEMESTERS;

const CourseCreate = () => {
  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();

  const onSubmit = async (data) => {
    const id = data.id.toUpperCase();
    data = { ...data, id, batches: [] };

    await dataProvider.create(url, { data, id });
    notify(`Added ${id}`, {
      type: "success",
    });
    refresh();
    redirect("list", url);
  };

  const evenOnlyValidation = (value) => {
    if (value % 2 !== 0) return "Even Numbers Only!";
    else return undefined;
  };

  return (
    <Create>
      <SimpleForm onSubmit={onSubmit}>
        <TextInput
          source="id"
          validate={[required()]}
          format={autoCapitalize}
        />
        <NumberInput
          source="totalSemesters"
          validate={[required(), number("Not a number"), evenOnlyValidation]}
        />
      </SimpleForm>
    </Create>
  );
};

export default CourseCreate;
