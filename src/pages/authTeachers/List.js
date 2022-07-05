import { Datagrid, EmailField, List, TextField } from "react-admin";

const AuthorizedTeacherList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <EmailField source="email" />
      <TextField source="userName" />
      <TextField source="branch" />
    </Datagrid>
  </List>
);

export default AuthorizedTeacherList
