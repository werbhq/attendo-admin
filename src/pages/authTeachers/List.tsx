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
    useRefresh,
} from 'react-admin';

import { Chip } from '@mui/material';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import { datagridStyle, listStyle } from 'components/ui/CustomTableStyling';

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
    const refresh = useRefresh();

    const PostBulkActionButtons = (data: BulkActionProps) => {
        return (
            <>
                <BulkUpdateButton
                    label="Create Account"
                    onClick={() =>
                        AuthTeachersProviderExtended.createEmails(
                            data.selectedIds as string[]
                        ).then((e) => {
                            notify(e.message, { type: e.success ? 'success' : 'error' });
                            refresh();
                        })
                    }
                />
                <BulkDeleteButton />
            </>
        );
    };

    return (
        <List exporter={false} filters={filters} sx={listStyle}>
            <Datagrid
                rowClick="show"
                bulkActionButtons={<PostBulkActionButtons />}
                sx={datagridStyle}
            >
                <EmailField source="email" />
                <TextField source="userName" label="Name" />
                <BooleanField source="created" looseValue sortable={false} />
                <TextField source="branch" />
            </Datagrid>
        </List>
    );
};

export default AuthorizedTeacherList;
