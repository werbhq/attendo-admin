import { Button, Stack, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {
    BooleanField,
    TextField,
    Show,
    FunctionField,
    SimpleShowLayout,
    Tab,
    TabbedShowLayout,
    useDataProvider,
    useShowController,
    GetListResult,
    ReferenceArrayField,
    ChipField,
    SingleFieldList,
} from 'react-admin';
import { useMemo, useState } from 'react';

import { Schemes } from 'Utils/Schemes';
import { MAPPING } from 'provider/mapping';
import EditClassroom from './components/classroom/Edit';

import SubjectTab from './tab/SubjectTab';

import { SubjectDoc } from 'types/models/subject';
import { defaultParams } from 'provider/firebase';
import { Classroom } from 'types/models/classroom';

import ReportTab from './tab/ReportTab';
import StudentTab from './tab/StudentTab';

type ClassroomDialog = {
    enable: boolean;
    schemes: GetListResult<SubjectDoc>;
};

export const ClassroomShow = () => {
    const dataProvider = useDataProvider();
    const { record } = useShowController<Classroom>();
    const [classroomDialog, setClassroomDialog] = useState<ClassroomDialog>({
        enable: false,
        schemes: { data: [] },
    });

    const convertedRecord = useMemo(() => {
        return record !== undefined
            ? {
                  ...record,
                  parentClasses: Object.keys(record?.parentClasses ?? {}),
                  teachers: record?.teachers?.map((e) => e.id) ?? [],
              }
            : { id: '' };
    }, [record]);

    return (
        <Show emptyWhileLoading>
            {record !== undefined && (
                <TabbedShowLayout record={convertedRecord}>
                    {/* Summary */}
                    <Tab label="summary">
                        <SimpleShowLayout>
                            <TextField source="id" />
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
                            {!!record.isDerived && (
                                <TextField source="subject.name" label="Subject"></TextField>
                            )}

                            <BooleanField source="isDerived" label="Virtual Class" />
                            {!!record.isDerived && (
                                <ReferenceArrayField
                                    label="Parent Classes"
                                    source="parentClasses"
                                    reference={MAPPING.CLASSROOMS}
                                    resource={MAPPING.CLASSROOMS}
                                    sx={{ margin: '10px 0px' }}
                                >
                                    <SingleFieldList linkType="show">
                                        <ChipField source="id" />
                                    </SingleFieldList>
                                </ReferenceArrayField>
                            )}

                            {!!record.isDerived && (
                                <ReferenceArrayField
                                    label="Teachers"
                                    source="teachers"
                                    reference={MAPPING.AUTH_TEACHERS}
                                    resource={MAPPING.AUTH_TEACHERS}
                                    sx={{ margin: '10px 0px' }}
                                >
                                    <SingleFieldList linkType="show">
                                        <ChipField source="userName" />
                                    </SingleFieldList>
                                </ReferenceArrayField>
                            )}

                            <FunctionField
                                label="Students Count"
                                render={(record: Classroom) => Object.values(record?.students).length}
                            ></FunctionField>
                            <Typography sx={{ fontSize: '0.75em', color: 'rgba(0, 0, 0, 0.6)' }}>
                                Batch
                            </Typography>
                        </SimpleShowLayout>

                        <SimpleShowLayout sx={{ ml: 2, mt: -2 }}>
                            <TextField source="batch.name" label="Batch Name" />
                            <TextField source="batch.semester" label="Semester" emptyText="-" />
                            <BooleanField source="batch.running" label="Running" />
                            <TextField source="batch.schemeId" label="Scheme Id" />
                            <TextField source="batch.course" label="Course" />
                            <TextField source="batch.yearOfJoining" label="Year Of Joining" />
                        </SimpleShowLayout>

                        <div style={{ margin: '20px 0px' }}>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={async () => {
                                        const schemes = await dataProvider.getList<SubjectDoc>(
                                            MAPPING.SUBJECT,
                                            defaultParams
                                        );
                                        setClassroomDialog({
                                            ...classroomDialog,
                                            enable: true,
                                            schemes: schemes,
                                        });
                                    }}
                                >
                                    Edit
                                </Button>
                            </Stack>
                        </div>
                    </Tab>

                    {/* Students */}
                    <StudentTab record={record} label="students" path="students" />

                    {/* Reports */}
                    {!record.isDerived && (
                        <ReportTab record={record} label="reports" path="reports" />
                    )}

                    {/* Subjects */}
                    {!record.isDerived && (
                        <SubjectTab record={record} label="subject" path="subject" />
                    )}

                    {/* Popup */}
                    {classroomDialog.enable && (
                        <EditClassroom
                            state={{
                                dialog: classroomDialog,
                                setDialog: setClassroomDialog,
                            }}
                        />
                    )}
                </TabbedShowLayout>
            )}
        </Show>
    );
};

export default ClassroomShow;
