import {
    EmailField,
    Show,
    SimpleShowLayout,
    TextField,
    BooleanField,
    useNotify,
    useRefresh,
    WithRecord,
    useShowController,
    FunctionField,
    ReferenceField,
    ChipField,
    useDataProvider,
} from 'react-admin';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState, useEffect } from 'react';
import { AuthorizedTeacher, Teacher, TeacherClassroom } from 'types/models/teacher';
import { MAPPING } from 'provider/mapping';
import { Chip } from '@mui/material';
import SK from 'pages/source-keys';
import { Subject } from 'types/models/subject';

const AuthorizedTeacherShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const { record } = useShowController();
    const authorizedTeacher = record as AuthorizedTeacher;
    const [loading, setLoading] = useState(false);
    const [classroomData, setClassroomData] = useState<TeacherClassroom[]>([]);
    const [subjectData, setSubjectData] = useState<Subject[]>([]);
    const dataProvider = useDataProvider();

    const fetchData = () => {
        if (authorizedTeacher) {
            dataProvider
                .getOne<Teacher>(MAPPING.TEACHERS, { id: authorizedTeacher?.id })
                .then((e) => {
                    setClassroomData(Object.values(e.data.classrooms));
                    setSubjectData(Object.values(e.data.classrooms).map((f) => f.subject));
                });
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchData();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleCreation = async (record: AuthorizedTeacher) => {
        setLoading(true);
        try {
            const { message, success } = await AuthTeachersProviderExtended.createEmails([
                record.id,
            ]);
            notify(message, { type: success ? 'success' : 'error' });
        } catch (e: any) {
            notify(e.message, { type: 'error' });
        }
        setLoading(true);
        refresh();
    };

    return loading ? (
        <></>
    ) : (
        <Show>
            <>
                <SimpleShowLayout>
                    <TextField source={SK.AUTH_TEACHERS('id')} />
                    <EmailField source={SK.AUTH_TEACHERS('email')} />
                    <TextField source={SK.AUTH_TEACHERS('userName')} label="Name" />
                    <BooleanField source={SK.AUTH_TEACHERS('created')} looseValue />
                    <TextField source={SK.AUTH_TEACHERS('branch')} />

                    <FunctionField
                        label="Classroom"
                        emptyText="-"
                        render={() => (
                            <ul style={{ padding: 0, margin: 0 }}>
                                {classroomData.length !== 0 ? (
                                    classroomData
                                        .filter(
                                            (classroom, index, self) =>
                                                index ===
                                                self.findIndex(
                                                    (c) => c.classroom.id === classroom.classroom.id
                                                )
                                        )
                                        .map((e) => (
                                            <ReferenceField
                                                key={e.classroom.id}
                                                record={e.classroom}
                                                reference={MAPPING.CLASSROOMS}
                                                source="id"
                                                link="show"
                                                label={e.classroom.id}
                                            >
                                                <ChipField source="id" />
                                            </ReferenceField>
                                        ))
                                ) : (
                                    <> - </>
                                )}
                            </ul>
                        )}
                    />
                    <FunctionField
                        label="Subject Names"
                        emptyText="-"
                        render={() => (
                            <ul style={{ padding: 0, margin: 0 }}>
                                {subjectData.length !== 0 ? (
                                    subjectData
                                        .filter(
                                            (subject, index, self) =>
                                                index === self.findIndex((c) => c.id === subject.id)
                                        )
                                        .map((e) => (
                                            <Chip
                                                key={e.name}
                                                sx={{ ml: 0.5, mt: 1 }}
                                                label={e.name}
                                            />
                                        ))
                                ) : (
                                    <>- </>
                                )}
                            </ul>
                        )}
                    />
                    <WithRecord
                        render={(record: AuthorizedTeacher) =>
                            !record?.created ? (
                                <LoadingButton
                                    variant="contained"
                                    color="primary"
                                    loading={loading}
                                    onClick={() => handleCreation(record)}
                                >
                                    Create Account
                                </LoadingButton>
                            ) : (
                                <></>
                            )
                        }
                    />
                </SimpleShowLayout>
            </>
        </Show>
    );
};

export default AuthorizedTeacherShow;
