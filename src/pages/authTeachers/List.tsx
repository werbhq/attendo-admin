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
    Button,
} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { Chip } from '@mui/material';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import { ImportButton } from './components/Button';

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
    const csvExportHeaders = ['id', 'email', 'branch', 'userName'];
    const PostBulkActionButtons = (data: BulkActionProps) => {
        return (
            <>
                <Button
                    label="Create Account"
                    startIcon={<AddIcon />}
                    onClick={() =>
                        AuthTeachersProviderExtended.createEmails(
                            data.selectedIds as string[]
                        ).then((e) => {
                            notify(e.message, { type: e.success ? 'success' : 'error' });
                            refresh();
                        })
                    }
                />
                <BulkUpdateButton></BulkUpdateButton>
                <BulkDeleteButton />
            </>
        );
    };
    const ListActions = () => <ImportButton csvExportHeaders={csvExportHeaders} />;

    return (
        <List exporter={false} filters={filters} actions={<ListActions />}>
            <Datagrid rowClick="show" bulkActionButtons={<PostBulkActionButtons />}>
                <EmailField source="email" />
                <TextField source="userName" label="Name" />
                <BooleanField source="created" looseValue sortable={false} />
                <TextField source="branch" />
            </Datagrid>
        </List>
    );
};

export default AuthorizedTeacherList;
