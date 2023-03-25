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
    downloadCSV,
    TopToolbar,
    ExportButton,
} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { Chip, Stack } from '@mui/material';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import { ImportButton } from './components/Button';
import jsonExport from 'jsonexport/dist';
import { MAPPING } from 'provider/mapping';
import { AuthorizedTeacher } from 'types/models/teacher';
import SK from 'pages/source-keys';
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

    const teachersExporter = (data: AuthorizedTeacher[]) => {
        const dataForExport = data;

        jsonExport(dataForExport, { headers: csvExportHeaders }, (err, csv) => {
            downloadCSV(csv, `Teachers`);
        });
    };

    const TopToolBar = () => {
        return (
            <TopToolbar>
                <Stack direction="row" spacing={2}>
                    <ExportButton variant="outlined" />
                    <ImportButton csvExportHeaders={csvExportHeaders} />
                </Stack>
            </TopToolbar>
        );
    };

    return (
        <List
            resource={MAPPING.AUTH_TEACHERS}
            exporter={teachersExporter}
            filters={filters}
            actions={<TopToolBar />}
        >
            <Datagrid rowClick="show" bulkActionButtons={<PostBulkActionButtons />}>
                <EmailField source={SK.AUTH_TEACHERS("email")} />
                <TextField source={SK.AUTH_TEACHERS("userName")} label="Name" />
                <BooleanField source={SK.AUTH_TEACHERS("created")} looseValue sortable={false} />
                <TextField source={SK.AUTH_TEACHERS("branch")} />
            </Datagrid>
        </List>
    );
};

export default AuthorizedTeacherList;
