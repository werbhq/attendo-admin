import {
  Datagrid,
  List,
  ChipField,
  SingleFieldList,
  TextField,
  BooleanField,
  ArrayField,
  useDataProvider,
  NumberField,
} from "react-admin";
import { dataProvider } from "../../provider/firebase";
import { MAPPING } from "../../provider/mapping";

const BatchesList = () => {
  return (
    <List exporter={false}>
      <Datagrid rowClick="show">
        <TextField source="name" label="Batch Name" />
        <TextField source="course" />
        <TextField source="schemeId" />
        <TextField source="yearOfJoining" />

        <BooleanField source="running" />

        <TextField source="semester" emptyText="-" sortable={false} />
      </Datagrid>
    </List>
  );
};
export default BatchesList;
