import {
  Datagrid,
  TextField,
  List,
  SearchInput,
  TextInput,
  EmailField,
  BooleanField,
  useTranslate,
  BulkDeleteButton,
  BulkUpdateButton,
  useNotify,
} from "react-admin";

import { Chip } from "@mui/material";
import { AuthTeachersProvider } from "../../provider/custom/authorizedTeachers";

const QuickFilter = ({ label, source, value }) => {
  const translate = useTranslate();
  return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};

const filters = [
  <SearchInput source="id" alwaysOn resettable />,
  <TextInput source="branch" resettable />,
  //<SelectInput source="created" label="new create" choices={[{id: true, name: "True"}, {id:false, name: "False"}]}/>,
  <QuickFilter source="created" label="Create" />,
];

const AuthorizedTeacherList = () => {
  const notify = useNotify();

  const PostBulkActionButtons = (data) => {
    return (
      <>
        <BulkUpdateButton
          label="Update Status"
          onClick={() =>
            AuthTeachersProvider.createEmails(data.selectedIds).then((e) => {
              notify(e.message, { type: "success" });
            })
          }
        />
        <BulkDeleteButton />
      </>
    );
  };

  return (
    <List exporter={false} filters={filters}>
      <Datagrid rowClick="show" bulkActionButtons={<PostBulkActionButtons />}>
        <EmailField source="email" />
        <TextField source="userName" />
        <BooleanField source="created" looseValue sortable={false} />
        <TextField source="branch" />
      </Datagrid>
    </List>
  );
};

export default AuthorizedTeacherList;
