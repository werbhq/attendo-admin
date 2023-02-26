import {
    EmailField,
    Show,
    SimpleShowLayout,
    TextField,
    BooleanField,
    useShowController,
    useNotify,
} from 'react-admin';
import { AuthTeachersProviderExtended } from '../../provider/custom/authorizedTeachers';
import LoadingButton from '@mui/lab/LoadingButton';
import { useState } from 'react';

const AuthorizedTeacherShow = () => {
    const { record } = useShowController();
    const notify = useNotify();
    const [loading, setLoading] = useState(false);

    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="id" />
                <EmailField source="email" />
                <TextField source="userName" />
                <BooleanField source="created" looseValue />
                <TextField source="branch" />

                {!record.created && (
                    <LoadingButton
                        variant="contained"
                        color="primary"
                        loading={loading}
                        onClick={() => {
                            setLoading(true);
                            AuthTeachersProviderExtended.createEmails([record.id]).then((e) => {
                                setLoading(false);
                                notify(e.message, { type: e.success ? 'success' : 'error' });
                            });
                        }}
                    >
                        Create Account
                    </LoadingButton>
                )}
            </SimpleShowLayout>
        </Show>
    );
};

export default AuthorizedTeacherShow;
