import {
    Datagrid,
    TextField,
    List,
    SearchInput,
    TextInput,
    EmailField,
    BooleanField,
    BulkUpdateButton,
    useNotify,
    BulkActionProps,
    useRefresh,
    Button,
    downloadCSV,
    TopToolbar,
    ExportButton,
    FilterButton,
    CreateButton,
    BulkDeleteWithConfirmButton,
} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import QuickFilter from 'components/ui/QuickFilter';
import { AuthTeachersProviderExtended } from 'provider/custom/authorizedTeachers';
import { ImportButton } from './components/Button';
import jsonExport from 'jsonexport/dist';
import { MAPPING } from 'provider/mapping';
import { AuthorizedTeacher } from 'types/models/teacher';

const filters = [
    <SearchInput source="id" alwaysOn resettable />,
    <TextInput source="branch" resettable />,
    <QuickFilter source="created" label="Account created" defaultValue={true} />,
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
                <BulkUpdateButton />
                <BulkDeleteWithConfirmButton mutationMode='optimistic'/>
            </>
        );
    };

    const teachersExporter = (data: AuthorizedTeacher[]) => {
        const dataForExport = data;
        const dataForExportWithoutCreated = dataForExport.map(({ created, ...rest }) => rest); // created parameter wont be presented
        jsonExport(dataForExportWithoutCreated, { headers: csvExportHeaders }, (err, csv) => {
            downloadCSV(csv, `Teachers`);
        });
    };

    const TopToolBar = () => {
        return (
            <TopToolbar>
                <CreateButton />
                <FilterButton />
                <ExportButton />
                <ImportButton csvExportHeaders={csvExportHeaders} />
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
                <EmailField source="email" />
                <TextField source="userName" label="Name" />
                <BooleanField source="created" looseValue sortable={false} />
                <TextField source="branch" />
            </Datagrid>
        </List>
    );
};

export default AuthorizedTeacherList;
