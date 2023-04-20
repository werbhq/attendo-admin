import {
    Datagrid,
    List,
    TextField,
    BooleanField,
    SearchInput,
    TextInput,
    ReferenceField,
} from 'react-admin';
import QuickFilter from 'components/ui/QuickFilter';
import { MAPPING } from 'provider/mapping';
import SK from 'pages/source-keys';

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
                <TextField source={SK.BATCHES("name")} label="Batch Name" />
                <ReferenceField source={SK.BATCHES("course")} reference={MAPPING.COURSES} link="show" />
                <ReferenceField source={SK.BATCHES("schemeId")} reference={MAPPING.SUBJECT} link="show" />
                <TextField source={SK.BATCHES("yearOfJoining")} />
                <BooleanField source={SK.BATCHES("running")} label="Running" />
                <TextField source={SK.BATCHES("semester")} emptyText="-" sortable={false} />
            </Datagrid>
        </List>
    );
};
export default BatchesList;
