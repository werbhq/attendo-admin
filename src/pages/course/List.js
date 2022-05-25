import {
  Datagrid,
  BooleanField,
  TextField,
  List,
  FunctionField,
  ReferenceField,
  SingleFieldList,
  SearchInput,
  ChipField,
  TextInput,
  useRecordContext,
  ArrayField,
} from "react-admin";
import QuickFilter from "../../components/ui/QuickFilter";
import { MAPPING } from "../../provider/mapping";
import { Schemes } from "../../Utils/Schemes";

// import SemestersProvider from "../../provider/custom/semesters";
import CustomProviders from "../../provider/customProviders";
import { SemestersProvider } from "../../provider/custom/semesters";

const filters = [
  <SearchInput source="id" alwaysOn resettable />,
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
// const Course_id = courses.batches.id?.find(
//   ({ courseid }) => courseid === id
// );

const CoursesList = () => {
  const data = useRecordContext();
  console.log(data);

  return (
    <List exporter={false} filters={filters}>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="totalSemesters" />
        {/* <FunctionField label="year" render={(record) => record.batches[0]?.id}> */}
        <ArrayField  source="batches" >
          <SingleFieldList >
            <ChipField source= "sem" displayName="sera"/>
          </SingleFieldList>
        </ArrayField>
        {/* console.log(record); */}
        {/* </FunctionField> */}
      </Datagrid>
    </List>
  );
};

export default CoursesList;
