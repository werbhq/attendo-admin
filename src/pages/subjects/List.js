import {
  Datagrid,
  TextField,
  List,
  EditButton,
  FunctionField,
  ReferenceField,
} from "react-admin";
import { MAPPING } from "../../provider/mapping";
import CustomSemesterField from "./components/CustomSemesterField";

const SubjectList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="organization" />
      <ReferenceField source="course" reference={MAPPING.SEMESTERS} link="show">
        <TextField source="id" />
      </ReferenceField>
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
