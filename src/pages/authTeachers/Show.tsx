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
    ReferenceArrayField,
} from 'react-admin';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState, useEffect } from 'react';
import { AuthorizedTeacher, Teacher, TeacherClassroom } from 'types/models/teacher';
import { dataProvider } from 'provider/firebase';
import { MAPPING } from 'provider/mapping';
import { Chip } from '@mui/material';
import SK from 'pages/source-keys';

const AuthorizedTeacherShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const record = useShowController().record as AuthorizedTeacher;
    const [loading, setLoading] = useState(false);
    const [classroomData, setClassroomData] = useState<TeacherClassroom[]>([]);

    const fetchData = () => {
        dataProvider.getOne<Teacher>(MAPPING.TEACHERS, { id: record.id }).then((e) => {
            setClassroomData(Object.values(e.data.classrooms));
        });
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
        setLoading(false);
        refresh();
    };

    return (
        <Show>
            {loading ? (
                <>Loading...</>
            ) : (
                <SimpleShowLayout>
                    <TextField source={SK.AUTH_TEACHERS("id")} />
                    <EmailField source={SK.AUTH_TEACHERS("email")} />
                    <TextField source={SK.AUTH_TEACHERS("userName")} label="Name" />
                    <BooleanField source={SK.AUTH_TEACHERS("created")} looseValue />
                    <TextField source={SK.AUTH_TEACHERS("branch" )}/>
                    
                        <FunctionField
                            label="Classroom"
                            emptyText="-"
                            render={() => (
                                <ul style={{ padding: 0, margin: 0 }}>
                                    {classroomData
                                        .filter(
                                            (classroom, index, self) =>
                                                index ===
                                                self.findIndex(
                                                    (c) => c.classroom.id === classroom.classroom.id
                                                )
                                        )
                                        .map((e) => (
                                            <Chip                                                                                     
                                                key={e.classroom.id}
                                                sx={{ ml: 0.5, mt: 1 }}
                                                label={e.classroom.id}
                                            />
                                        ))}
                                </ul>
                            )}
                        />
                    <FunctionField
                        label="Subject-Classroom"
                        emptyText='-'
                        render={() => (
                            <ul style={{ padding: 0, margin: 0 }}>
                                {classroomData
                                    .filter(
                                        (classroom, index, self) =>
                                            index ===
                                            self.findIndex(
                                                (c) => c.id === classroom.id
                                            )
                                    )
                                    .map((e) => (
                                        <Chip
                                            key={e.id}
                                            sx={{ ml: 0.5, mt: 1 }}
                                            label={e.id}
                                        />
                                    ))}
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
            )}
        </Show>
    );
};

export default AuthorizedTeacherShow;
