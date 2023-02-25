import {
    Datagrid,
    BooleanField,
    TextField,
    List,
    FunctionField,
    ReferenceField,
    SearchInput,
    TextInput,
} from 'react-admin';
import { MAPPING } from '../../provider/mapping';
import { Schemes } from '../../Utils/Schemes';
import { Classroom } from '../../types/models/classroom';
import QuickFilter from '../../components/ui/QuickFilter';

const filters = [
    <SearchInput source="id" placeholder="Enter Id" alwaysOn resettable />,
    <TextInput source="batch" resettable />,
    <TextInput source="branch" resettable />,
    <TextInput source="name" resettable />,
    <QuickFilter source="isDerived" label="Virtual" defaultValue={true} />,
];

const ClassroomsList = () => {
    return (
        <List exporter={false} filters={filters} emptyWhileLoading>
            <Datagrid rowClick="show">
                <TextField source="id" />
                <TextField source="batch.name" label="Batch" emptyText="-" />
                <TextField source="subject.name" label="Subject" emptyText="-" sortable={false} />
                <TextField source="batch.yearOfJoining" label="Year" emptyText="-" />
                <TextField source="batch.semester" label="Semester" emptyText="-" />
                <FunctionField
                    label="Branch"
                    render={(record: Classroom) => record.branch.toUpperCase()}
                ></FunctionField>
                <FunctionField
                    label="Name"
                    render={(record: Classroom) =>
                        Schemes.classNames.find(({ id }) => record.name === id)?.name
                    }
                ></FunctionField>
                <FunctionField
                    label="Students"
                    render={(record: Classroom) => record.students?.length}
                ></FunctionField>
                <ReferenceField source="batch.schemeId" reference={MAPPING.SUBJECT} link="show">
                    <TextField source="id" />
                </ReferenceField>
                <BooleanField source="isDerived" label="Virtual Class" />
            </Datagrid>
        </List>
    );
};

export default ClassroomsList;
