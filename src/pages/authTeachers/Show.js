import { EmailField, Show, SimpleShowLayout, TextField } from "react-admin";

const AuthorizedTeacherShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <EmailField source="email" />
      <TextField source="userName" />
      <TextField source="branch" />
    </SimpleShowLayout>
  </Show>
);

export default AuthorizedTeacherShow
