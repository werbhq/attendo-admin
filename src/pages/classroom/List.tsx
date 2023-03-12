import {
    Datagrid,
    BooleanField,
    TextField,
    List,
    FunctionField,
    ReferenceField,
    SearchInput,
    TextInput,
    useRecordContext,
    useListContext,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { Schemes } from 'Utils/Schemes';
import { Classroom } from 'types/models/classroom';
import QuickFilter from 'components/ui/QuickFilter';

const filters = [
    <SearchInput source="id" placeholder="Enter Id" alwaysOn resettable />,
    <QuickFilter source="batch.running" label="Running" defaultValue={true} resettable />,
    <TextInput source="batch.name" resettable />,
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
                <BooleanField source="batch.running" label="Running" />
                <TextField source="batch.yearOfJoining" label="Year" emptyText="-" />
                <FunctionField
                    label="Semester"
                    render={(record: Classroom) =>
                        record.isDerived ? record.semester : record.batch.semester
                    }
                ></FunctionField>
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
                    render={(record: Classroom) => Object.values(record.students)?.length}
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
