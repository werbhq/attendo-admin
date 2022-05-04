import {
  Datagrid,
  ArrayField,
  TextField,
  List,
  SingleFieldList,
  ChipField,
  EditButton,
} from "react-admin";

const SubjectList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="organization" />
      <TextField source="course" />
      <TextField source="year" />
      <ArrayField source="semesters">
        <SingleFieldList linkType={false}>
          <ChipField source="semester" />
        </SingleFieldList>
      </ArrayField>
      <EditButton/>
    </Datagrid>
  </List>
);

export default SubjectList;
