import {
    EmailField,
    Show,
    SimpleShowLayout,
    TextField,
    BooleanField,
    useNotify,
    useRefresh,
    WithRecord,
} from 'react-admin';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';
import { AuthorizedTeacher } from 'types/models/teacher';

const AuthorizedTeacherShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const [loading, setLoading] = useState(false);

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
            <SimpleShowLayout>
                <TextField source="id" />
                <EmailField source="email" />
                <TextField source="userName" label="Name" />
                <BooleanField source="created" looseValue />
                <TextField source="branch" />
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
        </Show>
    );
};

export default AuthorizedTeacherShow;
