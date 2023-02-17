import { EmailField, Show, SimpleShowLayout, TextField, BooleanField } from "react-admin";


const AuthorizedTeacherShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <EmailField source="email" />
      <TextField source="userName" />
      <BooleanField source="created" looseValue/>
      <TextField source="branch" />
    </SimpleShowLayout>
  </Show>
);

export default AuthorizedTeacherShow
