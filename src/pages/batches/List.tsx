import {
    Datagrid,
    List,
    TextField,
    BooleanField,
    SearchInput,
    TextInput,
    ReferenceField,
} from 'react-admin';
import QuickFilter from '../../components/ui/QuickFilter';
import { MAPPING } from '../../provider/mapping';

const filters = [
    <SearchInput source="name" placeholder="Enter Batch Name" alwaysOn resettable />,
    <TextInput source="course" resettable />,
    <TextInput source="schemeId" resettable />,
    <TextInput source="yearOfJoining" resettable />,
    <QuickFilter source="running" label="Running" defaultValue={true} />,
    <TextInput source="semester" resettable />,
];
const BatchesList = () => {
    return (
        <List exporter={false} filters={filters}>
            <Datagrid rowClick="show">
                <TextField source="name" label="Batch Name" />
                <ReferenceField source="course" reference={MAPPING.COURSES} />
                <TextField source="schemeId" />
                <TextField source="yearOfJoining" />
                <BooleanField source="running" label="Running" />
                <TextField source="semester" emptyText="-" sortable={false} />
            </Datagrid>
        </List>
    );
};
export default BatchesList;
