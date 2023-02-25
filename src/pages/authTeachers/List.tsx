import {
    Datagrid,
    TextField,
    List,
    SearchInput,
    TextInput,
    EmailField,
    BooleanField,
    useTranslate,
    BulkDeleteButton,
    BulkUpdateButton,
    useNotify,
    BulkActionProps,
} from 'react-admin';

import { Chip } from '@mui/material';
import { AuthTeachersProviderExtended } from '../../provider/custom/authorizedTeachers';

const QuickFilter = ({ label, source }: { label: string; source: string }) => {
    const translate = useTranslate();
    return <Chip sx={{ marginBottom: 1 }} label={translate(label)} />;
};

const filters = [
    <SearchInput source="id" alwaysOn resettable />,
    <TextInput source="branch" resettable />,
    //<SelectInput source="created" label="new create" choices={[{id: true, name: "True"}, {id:false, name: "False"}]}/>,
    <QuickFilter source="created" label="Create" />,
];

const AuthorizedTeacherList = () => {
    const notify = useNotify();

    const PostBulkActionButtons = (data: BulkActionProps) => {
        return (
            <>
                <BulkUpdateButton
                    label="Update Status"
                    onClick={() =>
                        AuthTeachersProviderExtended.createEmails(
                            data.selectedIds as string[]
                        ).then((e) => {
                            notify(e.message, { type: e.success ? 'success' : 'error' });
                        })
                    }
                />
                <BulkDeleteButton />
            </>
        );
    };

    return (
        <List exporter={false} filters={filters}>
            <Datagrid rowClick="show" bulkActionButtons={<PostBulkActionButtons />}>
                <EmailField source="email" />
                <TextField source="userName" />
                <BooleanField source="created" looseValue sortable={false} />
                <TextField source="branch" />
            </Datagrid>
        </List>
    );
};

export default AuthorizedTeacherList;
