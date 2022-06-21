import {
  Datagrid,
  TextField,
  List,
  EditButton,
  FunctionField,
} from "react-admin";
import CustomSemesterField from "./components/CustomSemesterField";

const SubjectList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="organization" />
      <TextField source="course" />
      <TextField source="year" />
      <FunctionField
        label="Semester"
        render={(record) => (
          <CustomSemesterField {...record} array="semesters" chip="semester" />
        )}
      />
      <EditButton />
    </Datagrid>
  </List>
);

export default SubjectList;
