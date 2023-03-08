import {
    TextField,
    Datagrid,
    ListContextProvider,
    TextInput,
    SimpleForm,
    ArrayInput,
    SimpleFormIterator,
    FunctionField,
    useRecordContext,
    useList,
    useRefresh,
    useNotify,
    useRedirect,
    required,
} from 'react-admin';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Dialog } from '@mui/material';
import { CustomAdd, CustomDelete } from '../CustomButtons';
import { dataProvider } from 'provider/firebase';
import { MAPPING } from 'provider/mapping';
import { CustomBranchField } from '../CustomFields';
import { noSpaceValidation } from 'Utils/validations';
import { SubjectSemester, SubjectDoc } from 'types/models/subject';

const url = MAPPING.SUBJECT;

const SemesterTable = () => {
    const data = useRecordContext() as SubjectDoc;
    const [semData, setSemData] = useState<SubjectSemester>(data.semesters[0]);
    const tableData = useList({
        data: data.semesters.map((e, index) => ({ ...e, id: index })),
    });

    const refresh = useRefresh();
    const notify = useNotify();
    const redirect = useRedirect();
    const [showDialog, setShowDialog] = useState(false);

    const editButtonHandle = (record: SubjectSemester) => {
        setSemData(record);
        setShowDialog(true);
    };
    const handleClose = () => setShowDialog(false);

    const updateBranch = async (e: any) => {
        const newData = e as SubjectSemester;
        newData.branchSubs = newData.branchSubs.map(({ branch, subjects }) => ({
            branch: branch.toLowerCase(),
            subjects: subjects || [],
        }));

        const updatedData = data;
        const updateIndex = updatedData.semesters.findIndex(
            ({ semester }) => semester === semData.semester
        );
        updatedData.semesters[updateIndex] = newData;

        await dataProvider.update(url, {
            id: data.id,
            data: updatedData,
            previousData: data,
        });

        handleClose();
        notify(`Semester ${newData.semester} Modified Successfully`);
        refresh();
    };

    return (
        <div>
            {tableData.data.length === 0 && (
                <Button
                    variant="contained"
                    onClick={() => {
                        redirect('edit', url, data.id);
                    }}
                >
                    Add Semester
                </Button>
            )}
            <ListContextProvider value={tableData}>
                <Datagrid bulkActionButtons={false}>
                    <TextField source="semester" />
                    <FunctionField
                        label="Branches"
                        render={(record: SubjectSemester) => <CustomBranchField record={record} />}
                    />
                    <FunctionField
                        render={(record: SubjectSemester) => (
                            <Button
                                startIcon={<EditIcon />}
                                onClick={() => editButtonHandle(record)}
                            >
                                Edit
                            </Button>
                        )}
                    />
                </Datagrid>
            </ListContextProvider>

            <Dialog open={showDialog} onClose={handleClose}>
                <SimpleForm onSubmit={updateBranch} record={semData}>
                    <ArrayInput source="branchSubs" label="Branches" fullWidth={false}>
                        <SimpleFormIterator
                            addButton={CustomAdd({ name: 'ADD BRANCH' })}
                            removeButton={CustomDelete()}
                            getItemLabel={() => ''} // To remove index numbers
                            disableReordering
                        >
                            <TextInput
                                source="branch"
                                label="branch"
                                format={(e) => e.toLowerCase()}
                                validate={[required(), noSpaceValidation]}
                            />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </Dialog>
        </div>
    );
};

export default SemesterTable;
