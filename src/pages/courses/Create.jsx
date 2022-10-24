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
  BooleanInput,
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
    const batches = [];
    let currentYear = new Date().getFullYear();
    for (let i = data.evenSemester ? 2 : 1; i <= data.totalSemesters; i += 2) {
      batches.push({ id: currentYear--, sem: i });
    }

    data = { ...data, id, batches: batches.sort((a, b) => a.sem - b.sem) };

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

  const nonZeroValidation = (value) => {
    if (value <= 0) return "Positive Numbers Only!";
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
          onWheel={(e) => e.preventDefault()}
          validate={[
            required(),
            number("Not a number"),
            nonZeroValidation,
            evenOnlyValidation,
          ]}
        />
        <BooleanInput source="evenSemester" validate={[required()]} />
      </SimpleForm>
    </Create>
  );
};

export default CourseCreate;
