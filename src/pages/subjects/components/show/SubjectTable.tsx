import {
    TextField,
    Datagrid,
    ListContextProvider,
    SimpleForm,
    TextInput,
    FunctionField,
    SaveButton,
    useRecordContext,
    useDataProvider,
    useList,
    useRefresh,
    useNotify,
    required,
} from 'react-admin';
import InputLabel from '@mui/material/InputLabel';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { Dialog } from '@mui/material';
import { MAPPING } from '../../../../provider/mapping';
import { CustomSubjectBulkDeleteButton } from '../CustomButtons';
import { noSpaceValidation } from '../../../../Utils/validations';
import Button from '@mui/material/Button';
import { titleCase } from '../../../../Utils/helpers';
import { Subject, SubjectDoc, SubjectSemester } from '../../../../types/models/subject';
import { DeleteButtonDialog } from '../SubjectButtons';

const url = MAPPING.SUBJECT;

const SubjectTable = () => {
    const data = useRecordContext() as SubjectDoc;
    const refresh = useRefresh();
    const notify = useNotify();
    const dataProvider = useDataProvider();

    const newSubjectRecord = {
        id: '',
        code: '',
        name: '',
    };

    const [addSubject, setAddSubject] = useState<{
        open: boolean;
        add: boolean;
        record: Subject;
    }>({
        open: false,
        add: false,
        record: newSubjectRecord,
    });

    const [semesterData, setSemesterData] = useState<SubjectSemester | undefined>(
        data.semesters.length !== 0 ? data.semesters[0] : undefined
    );
    const [branchData, setBranchData] = useState(semesterData?.branchSubs[0]?.branch || undefined);

    const subjectsTableData = useList({
        data: semesterData?.branchSubs.find((e) => e.branch === branchData)?.subjects || [],
    });

    const handleClose = () => {
        setAddSubject({ ...addSubject, open: false });
    };

    const handleDelete = async (record: Subject) => {
        const removeIndex = semesterData?.branchSubs
            .find((e) => e.branch === branchData)
            ?.subjects.findIndex((e) => e.id === record.id);

        const updatedData = data;
        updatedData.semesters
            .find((e) => e.semester === semesterData?.semester)
            ?.branchSubs.find((e) => e.branch === branchData)
            ?.subjects.splice(removeIndex as number, 1);

        await dataProvider.update(url, {
            id: data.id,
            data: updatedData,
            previousData: data,
        });

        handleClose();
        refresh();
    };

    const handleSubmit = async (e: any) => {
        const newRecord = e as Subject;
        newRecord.name = titleCase(newRecord.name);

        const currentData = semesterData?.branchSubs.find((e) => e.branch === branchData)
            ?.subjects as Subject[];
        const newData = currentData;

        const found = currentData?.findIndex((e) => e.id === newRecord.id);

        if (found === -1) {
            newData.push({ ...newRecord, id: newRecord.code.toLowerCase() });
        } else {
            newData[found] = { ...newRecord, id: newRecord.code.toLowerCase() };
        }

        const updatedData = data;

        const branchDataOld = updatedData.semesters
            .find((e) => e.semester === semesterData?.semester)
            ?.branchSubs.find((e) => e.branch === branchData);

        if (branchDataOld) branchDataOld.subjects = newData;

        await dataProvider.update(url, {
            id: data.id,
            data: updatedData,
            previousData: data,
        });

        refresh();
        notify('Classroom Subject Updated');
        handleClose();
    };

    return (
        <Stack spacing={5}>
            <Stack direction="row" spacing={2}>
                <Stack>
                    <InputLabel id="semester-label">Semester</InputLabel>
                    <Select
                        labelId="semester-label"
                        value={semesterData?.semester}
                        defaultValue={semesterData?.semester}
                        label="Semester"
                        variant="standard"
                        onChange={(value) => {
                            const semester = data.semesters.find(
                                (e) => e.semester === value.target.value
                            ) as SubjectSemester;
                            setSemesterData(semester);
                            setBranchData(semester?.branchSubs[0]?.branch);
                        }}
                    >
                        {data.semesters.length !== 0 ? (
                            data.semesters.map((e, index) => (
                                <MenuItem key={index} value={e.semester}>
                                    {e.semester}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value={undefined}>No Data</MenuItem>
                        )}
                    </Select>
                </Stack>

                <Stack>
                    <InputLabel id="branch-label">Branch</InputLabel>
                    <Select
                        labelId="branch-label"
                        value={branchData}
                        defaultValue={branchData}
                        label="Branch"
                        variant="standard"
                        onChange={(e) => setBranchData(e.target.value)}
                    >
                        {semesterData === undefined || semesterData?.branchSubs.length === 0 ? (
                            <MenuItem key={undefined} value={undefined}>
                                No Data
                            </MenuItem>
                        ) : (
                            semesterData?.branchSubs.map((e, index) => (
                                <MenuItem key={index} value={e.branch}>
                                    {e.branch.toUpperCase()}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </Stack>
            </Stack>

            <Stack direction="row">
                <Button
                    disabled={branchData === undefined || semesterData === undefined}
                    variant="contained"
                    size="medium"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setAddSubject({
                            ...addSubject,
                            open: true,
                            add: true,
                            record: newSubjectRecord,
                        });
                    }}
                >
                    ADD SUBJECT
                </Button>
            </Stack>

            <ListContextProvider value={subjectsTableData}>
                <Datagrid
                    bulkActionButtons={
                        <CustomSubjectBulkDeleteButton
                            branch={branchData}
                            semester={semesterData?.semester}
                        />
                    }
                >
                    <TextField source="code" />
                    <TextField source="name" />
                    <FunctionField
                        render={(record: Subject) => (
                            <Button
                                startIcon={<EditIcon />}
                                onClick={() => {
                                    setAddSubject({
                                        ...addSubject,
                                        open: true,
                                        record: record,
                                        add: false,
                                    });
                                }}
                            >
                                Edit
                            </Button>
                        )}
                    ></FunctionField>
                </Datagrid>
            </ListContextProvider>

            <Dialog open={addSubject.open} onClose={handleClose} fullWidth={true}>
                <SimpleForm record={addSubject.record} onSubmit={handleSubmit} toolbar={false}>
                    <TextInput
                        source="code"
                        label="Code"
                        fullWidth={true}
                        format={(props) => props?.toUpperCase() ?? ''}
                        validate={[required(), noSpaceValidation]}
                    />
                    <TextInput
                        source="name"
                        label="Name"
                        format={(props) => props && titleCase(props)}
                        fullWidth={true}
                        validate={[required()]}
                    />
                    <Stack direction="row" spacing={3}>
                        <SaveButton label={addSubject.add ? 'Add' : 'Save'} />
                        {!addSubject.add && (
                            <DeleteButtonDialog
                                record={addSubject.record}
                                handleDelete={handleDelete}
                            />
                        )}
                    </Stack>
                </SimpleForm>
            </Dialog>
        </Stack>
    );
};

export default SubjectTable;
