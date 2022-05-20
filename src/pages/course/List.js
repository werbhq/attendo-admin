import {
    Datagrid,
    BooleanField,
    TextField,
    List,
    FunctionField,
    ReferenceField,
    SearchInput,
    TextInput,
  } from "react-admin";
  import QuickFilter from "../../components/ui/QuickFilter";
  import { MAPPING } from "../../provider/mapping";
  import { Schemes } from "../../Utils/Schemes";
  
  const filters = [
    <SearchInput source="course_id" alwaysOn resettable />,
    <TextInput source="course" resettable />,
    <TextInput source="branch" resettable />,
    <TextInput source="sem" resettable />,
    <TextInput source="year" resettable />,
  ];
  
  // course - id;
  // course;
  // year;
  // running;
  // SEM;
  // BRANCH;
  
  const CoursesList = () => {
    return (
      <List exporter={false} filters={filters}>
        <Datagrid rowClick="show">
          <TextField source="id" />
          <TextField source="id" />
          <TextField source="year" />
          <TextField source="semester" emptyText="-" sortable={false} />
          <FunctionField
            label="Branch"
            render={(record) => record.branch}
          ></FunctionField>
        </Datagrid>
      </List>
    );
  };
  
  export default CoursesList;
  
  