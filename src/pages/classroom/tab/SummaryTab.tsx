import {
    BooleanField,
    TextField,
    FunctionField,
    SimpleShowLayout,
    Tab,
    ReferenceArrayField,
    ChipField,
    SingleFieldList,
    useRecordContext,
    ArrayField,
    Datagrid,
    SelectField,
    ReferenceField,
} from 'react-admin';
import { Button, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Schemes } from 'Utils/Schemes';
import { MAPPING } from 'provider/mapping';
import { Classroom } from 'types/models/classroom';
import SK from 'pages/source-keys';
import EmptySingleDisplay from 'components/ui/EmptySingleField';
import { useState } from 'react';
import EditClassroom from '../components/classroom/Edit';
import { ClassroomFrontend } from 'types/frontend/classroom';

const SummaryTab = ({ label, ...rest }: { label: string }) => {
    const record: ClassroomFrontend = useRecordContext();
    const [classroomDialog, setClassroomDialog] = useState<boolean>(false);
    const isVirtual = record.isDerived;
    const hasGroup = record.isDerived && record.group;

    return (
        <Tab {...rest} label={label}>
            <SimpleShowLayout>
                <TextField source={SK.CLASSROOM('id')} />
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

                {hasGroup && <TextField source={SK.CLASSROOM('group')} emptyText="-" />}
                {hasGroup && (
                    <ArrayField source={SK.CLASSROOM('groupLinks')} label="Other Groups">
                        <Datagrid
                            optimized
                            width="50%"
                            bulkActionButtons={false}
                            sx={{ marginLeft: 1, width: '30%' }}
                        >
                            <ReferenceField
                                source="id"
                                reference={MAPPING.CLASSROOMS}
                                resource={MAPPING.CLASSROOMS}
                                link="show"
                            />
                            <SelectField source="group" choices={Schemes.groupNames} />
                        </Datagrid>
                    </ArrayField>
                )}

                {isVirtual && <TextField source={SK.CLASSROOM('subject.name')} label="Subject" />}

                {isVirtual && <TextField source={SK.CLASSROOM('semester')} />}

                <BooleanField source={SK.CLASSROOM('isDerived')} label="Virtual Class" />

                {isVirtual && (
                    <ReferenceArrayField
                        label="Parent Classes"
                        source={SK.CLASSROOM('parentClasses')}
                        reference={MAPPING.CLASSROOMS}
                        resource={MAPPING.CLASSROOMS}
                        sx={{ margin: '10px 0px' }}
                    >
                        <SingleFieldList linkType="show">
                            <ChipField source={SK.CLASSROOM('id')} />
                        </SingleFieldList>
                        <EmptySingleDisplay fieldName={SK.CLASSROOM('parentClasses')} />
                    </ReferenceArrayField>
                )}

                {isVirtual && (
                    <ReferenceArrayField
                        label="Teachers"
                        source={SK.CLASSROOM('teachers')}
                        reference={MAPPING.AUTH_TEACHERS}
                        resource={MAPPING.AUTH_TEACHERS}
                        sx={{ margin: '10px 0px' }}
                    >
                        <SingleFieldList linkType="show">
                            <ChipField source={SK.AUTH_TEACHERS('userName')} />
                        </SingleFieldList>
                        <EmptySingleDisplay fieldName={SK.CLASSROOM('teachers')} />
                    </ReferenceArrayField>
                )}

                <FunctionField
                    label="Students Count"
                    render={(record: Classroom) => Object.values(record?.students).length}
                />
                <Typography sx={{ fontSize: '0.75em', color: 'rgba(0, 0, 0, 0.6)' }}>
                    Batch
                </Typography>
            </SimpleShowLayout>

            <SimpleShowLayout sx={{ ml: 2, mt: -2 }}>
                <TextField source={SK.CLASSROOM('batch.name')} label="Batch Name" />
                <TextField
                    source={SK.CLASSROOM('batch.semester')}
                    label="Batch Semester"
                    emptyText="-"
                />
                <BooleanField source={SK.CLASSROOM('batch.running')} label="Running" />
                <TextField source={SK.CLASSROOM('batch.schemeId')} label="Scheme Id" />
                <TextField source={SK.CLASSROOM('batch.course')} label="Course" />
                <TextField source={SK.CLASSROOM('batch.yearOfJoining')} label="Year Of Joining" />
            </SimpleShowLayout>

            <div style={{ margin: '20px 0px' }}>
                <Stack direction="row" spacing={2}>
                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setClassroomDialog((e) => !e)}
                    >
                        Edit
                    </Button>
                </Stack>
            </div>
            {/* Popup */}
            {classroomDialog && (
                <EditClassroom
                    state={{
                        dialog: classroomDialog,
                        setDialog: setClassroomDialog,
                    }}
                />
            )}
        </Tab>
    );
};

export default SummaryTab;
