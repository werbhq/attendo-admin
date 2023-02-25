import {
    Datagrid,
    TextField,
    List,
    EditButton,
    FunctionField,
    SearchInput,
    TextInput,
} from 'react-admin';
import { CustomSemesterField } from './components/CustomFields';
import { SubjectDoc } from '../../types/models/subject';

const filters = [
    <SearchInput source="id" alwaysOn resettable />,
    <TextInput source="organization" resettable />,
    <TextInput source="course" resettable />,
    <TextInput source="year" resettable />,
];

const SubjectList = () => (
    <List exporter={false} filters={filters}>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <TextField source="organization" />
            <TextField source="course" />
            <TextField source="year" />
            <FunctionField
                label="Semester"
                render={(record: SubjectDoc) => <CustomSemesterField record={record} />}
            />
            <EditButton />
        </Datagrid>
    </List>
);

export default SubjectList;
