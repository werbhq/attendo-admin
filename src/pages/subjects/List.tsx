import {
    Datagrid,
    TextField,
    List,
    EditButton,
    FunctionField,
    SearchInput,
    TextInput,
    ReferenceField,
} from 'react-admin';
import { CustomSemesterField } from './components/CustomFields';
import { SubjectDoc } from 'types/models/subject';
import { MAPPING } from 'provider/mapping';
import { datagridStyle, listStyle } from 'components/ui/CustomTableStyling';

const filters = [
    <SearchInput source="id" alwaysOn resettable />,
    <TextInput source="organization" resettable />,
    <TextInput source="course" resettable />,
    <TextInput source="year" resettable />,
];

const SubjectList = () => (
    <List exporter={false} filters={filters} sx={listStyle}>
        <Datagrid rowClick="show" sx={datagridStyle}>
            <TextField source="id" />
            <TextField source="organization" />
            <ReferenceField source="course" reference={MAPPING.COURSES} link="show" />
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
