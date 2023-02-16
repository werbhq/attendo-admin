import { EmailField, Show, SimpleShowLayout, TextField, BooleanField } from "react-admin";


const AuthorizedTeacherShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <EmailField source="email" />
      <TextField source="userName" />
      <BooleanField source="created" defaultChecked={false}/>
      <TextField source="branch" />
    </SimpleShowLayout>
  </Show>
);

export default AuthorizedTeacherShow
