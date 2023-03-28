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
import { MAPPING } from 'provider/mapping';
import { Schemes } from 'Utils/Schemes';
import { Classroom } from 'types/models/classroom';
import QuickFilter from 'components/ui/QuickFilter';
import SK from 'pages/source-keys';

const filters = [
    <SearchInput
        source={SK.CLASSROOM('id')}
        placeholder="Enter Id"
        alwaysOn
        resettable
    />,
    <QuickFilter
        source={SK.CLASSROOM('batch.running')}
        label="Running"
        defaultValue={true}
        resettable
    />,
    <TextInput source={SK.CLASSROOM('batch.name')} resettable />,
    <TextInput source={SK.CLASSROOM('branch')} resettable />,
    <TextInput source={SK.CLASSROOM('name')} resettable />,
    <TextInput label='Year Of Joining' source={SK.CLASSROOM('batch.yearOfJoining')} resettable />,
    <TextInput label='Subject' source={SK.CLASSROOM('subject.name')} resettable />,
    <QuickFilter source={SK.CLASSROOM('isDerived')} label="Virtual" defaultValue={true} />,
];

const ClassroomsList = () => {
    return (
        <List exporter={false} filters={filters} emptyWhileLoading>
            <Datagrid rowClick="show">
                <TextField source={SK.CLASSROOM('id')} />
                <ReferenceField
                    source={SK.CLASSROOM('batch.id')}
                    reference={MAPPING.BATCHES}
                    link="show"
                >
                    <TextField source={SK.CLASSROOM('name')} />
                </ReferenceField>{' '}
                <TextField
                    source={SK.CLASSROOM('subject.name')}
                    label="Subject"
                    emptyText="-"
                    sortable={false}
                />
                <BooleanField source={SK.CLASSROOM('batch.running')} label="Running" />
                <TextField
                    source={SK.CLASSROOM('batch.yearOfJoining')}
                    label="Year"
                    emptyText="-"
                />
                <FunctionField
                    label="Semester"
                    render={(record: Classroom) =>
                        record.isDerived ? record.semester : record.batch.semester
                    }
                />
                <FunctionField
                    label="Branch"
                    render={(record: Classroom) => record.branch.toUpperCase()}
                />
                <FunctionField
                    label="Name"
                    render={(record: Classroom) =>
                        Schemes.classNames.find(({ id }) => record.name === id)?.name
                    }
                />
                <TextField source={SK.CLASSROOM('group')} emptyText="-" />
                <FunctionField
                    label="Students"
                    render={(record: Classroom) => Object.values(record.students)?.length}
                />
                <ReferenceField
                    source={SK.CLASSROOM('batch.schemeId')}
                    reference={MAPPING.SUBJECT}
                    link="show"
                >
                    <TextField source={SK.CLASSROOM('id')} />
                </ReferenceField>
                <BooleanField source={SK.CLASSROOM('isDerived')} label="Virtual Class" />
            </Datagrid>
        </List>
    );
};

export default ClassroomsList;
