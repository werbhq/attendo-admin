import {
  Datagrid,
  TextField,
  List,
  SearchInput,
  TextInput,
  EmailField,
} from "react-admin";

const filters = [
  <SearchInput source="id" alwaysOn resettable />,
  <TextInput source="branch" resettable />,
];

const AuthorizedTeacherList = () => (
  <List exporter={false} filters={filters}>
    <Datagrid rowClick="show">
      <EmailField source="email" />
      <TextField source="userName" />
      <TextField source="branch" />
    </Datagrid>
  </List>
);

export default AuthorizedTeacherList;
