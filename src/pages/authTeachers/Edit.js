import { Edit, required, SimpleForm, TextInput } from "react-admin";

const AuthorizedTeacherEdit = () => (
  <Edit>
    <SimpleForm style={{ alignItems: "stretch" }}>
      <TextInput disabled source="id" />
      <TextInput source="email" validate={required()} />
      <TextInput source="userName" validate={required()} />
      <TextInput source="branch" validate={required()} />
    </SimpleForm>
  </Edit>
);

export default AuthorizedTeacherEdit


