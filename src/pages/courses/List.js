import {
  Datagrid,
  TextField,
  List,
  FunctionField,
  SingleFieldList,
  SearchInput,
  ChipField,
  TextInput,
  ArrayField,
} from "react-admin";

const filters = [
  <SearchInput source="id" alwaysOn resettable />,
  <TextInput source="totalSemesters" label="Total Semesters" resettable />,
];

const CoursesList = () => {
  return (
    <List exporter={false} filters={filters}>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="totalSemesters" />
        <ArrayField source="batches">
          <SingleFieldList>
            <FunctionField
              render={(record) => (
                <ChipField record={{ sem: "S" + record.sem }} source="sem" />
              )}
            />
          </SingleFieldList>
        </ArrayField>
      </Datagrid>
    </List>
  );
};

export default CoursesList;
