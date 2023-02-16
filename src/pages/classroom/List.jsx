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
  <SearchInput source="id" placeholder="Enter Id" alwaysOn resettable />,
  <TextInput source="course" resettable />,
  <TextInput source="branch" resettable />,
  <TextInput source="name" resettable />,
  <QuickFilter source="isDerived" label="Virtual" defaultValue={true} />,
];

const ClassroomsList = () => {
  return (
    <List exporter={false} filters={filters}>
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="batch.course" label="Course" />

        <TextField
          source="subjectName"
          label="Subject"
          emptyText="-"
          sortable={false}
        />
        <TextField source="batch.yearOfJoining" label="Year Of Joining" />
        <TextField source="semester" emptyText="-" sortable={false} />
        <FunctionField
          label="Branch"
          render={(record) => record.branch.toUpperCase()}
        ></FunctionField>
        <FunctionField
          label="Name"
          render={(record) =>
            Schemes.classNames.find(({ id }) => record.name === id).name
          }
        ></FunctionField>

        <FunctionField
          label="Students"
          render={(record) => record.students.length}
        ></FunctionField>
        <TextField source="batch.schemeId" label="Scheme Id" />

        <BooleanField source="isDerived" label="Virtual Class" />
      </Datagrid>
    </List>
  );
};

export default ClassroomsList;
