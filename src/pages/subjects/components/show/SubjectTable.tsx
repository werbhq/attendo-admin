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
    NumberInput,
    Confirm,
} from 'react-admin';
import InputLabel from '@mui/material/InputLabel';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState } from 'react';
import { Dialog, Tooltip } from '@mui/material';
import { MAPPING } from 'provider/mapping';
import { CustomSubjectBulkDeleteButton } from '../CustomButtons';
import { noSpaceValidation } from 'Utils/validations';
import Button from '@mui/material/Button';
import { titleCase, validateName } from 'Utils/helpers';
import { Subject, SubjectDoc, SubjectSemester } from 'types/models/subject';
import { DeleteButtonDialog } from '../SubjectButtons';
import SK from 'pages/source-keys';

const url = MAPPING.SUBJECT;

const SubjectTable = () => {
    const data = useRecordContext() as SubjectDoc;
    const refresh = useRefresh();
    const notify = useNotify();
    const dataProvider = useDataProvider();

    type SubjectSemesterCustom = Omit<SubjectSemester, 'semester'> & {
        semester: number | undefined;
    };

    const defaultSubjectRecord = {
        id: '',
        code: '',
        name: '',
    };
    const defaultSemesterRecord = {
        semester: undefined,
        branchSubs: [{ branch: '', subjects: [] }],
    };

    const [addSubject, setAddSubject] = useState<{
        open: boolean;
        add: boolean;
        record: Subject;
    }>({
        open: false,
        add: false,
        record: defaultSubjectRecord,
    });

    const [semesterData, setSemesterData] = useState<SubjectSemesterCustom>(
        data.semesters.length !== 0 ? data.semesters[0] : defaultSemesterRecord
    );

    const [showConfirm, setShowConfirm] = useState(false);
    const [branchSemesterDialogData, setBranchSemesterDialog] = useState<{
        open: boolean;
        semEnable: boolean;
        record: SubjectSemesterCustom;
    }>({
        open: false,
        semEnable: false,
        record: defaultSemesterRecord,
    });
    const [branchData, setBranchData] = useState(semesterData?.branchSubs[0]?.branch || '');

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

    const handleSemDelete = async (record: SubjectSemester) => {
        const currentData=data;
        const semesterIndex = currentData.semesters.findIndex((e) => e.semester === record.semester);
        const currentSemIndex = semesterIndex - 1 >= 0 ? semesterIndex - 1 : 0;
        if (semesterIndex !== -1) {
            const updatedData = {
                ...currentData,
                semesters: currentData.semesters.filter((e) => e.semester !== record.semester),
            };
            let semester = defaultSemesterRecord as SubjectSemesterCustom;
            if (updatedData.semesters.length > 0) {
                semester = updatedData.semesters[currentSemIndex] as SubjectSemester;
                setSemesterData(semester);
                setBranchData(semester.branchSubs[0].branch);
            } else {
                setSemesterData(semester);
                setBranchData('');
            }
            await dataProvider.update(url, { id: currentData.id, data: updatedData, previousData: data });
            notify(`Semester ${record.semester} and its contents are deleted permanently`);
            refresh();
            handleSemClose();
        }
    };

    const handleSemClose = () => {
        setBranchSemesterDialog({ ...branchSemesterDialogData, open: false });
    };

    const handleSemSubmit = async (e: any) => {
        const currentData=data;
        let semesterIndex = currentData.semesters.findIndex(
            (semester) => semester.semester === e.semester
        );
        let branchIndex = -1;
        if (semesterIndex === -1) {
            currentData.semesters.push({
                semester: e.semester,
                branchSubs: [{ branch: e.branch, subjects: [] }],
            });
            semesterIndex = currentData.semesters.length - 1;
            branchIndex = 0;
            notify(`Semester ${e.semester} Updated`);
        } else {
            branchIndex = currentData.semesters[semesterIndex].branchSubs.findIndex(
                (branch) => branch.branch === e.branch
            );
            if (branchIndex !== -1) {
                notify(`Branch ${e.branch} is already present`);
            } else {
                notify(`Semester ${e.semester} is already present`);
                currentData.semesters[semesterIndex].branchSubs.push({ branch: e.branch, subjects: [] });
                branchIndex = currentData.semesters[semesterIndex].branchSubs.length - 1;
                notify(`Branch ${e.branch} will be added to S${e.semester}`);
            }
        }

        await dataProvider.update(url, { id: currentData.id, data:currentData, previousData: data });
        const semester = currentData.semesters[semesterIndex] as SubjectSemester;
        refresh();
        setSemesterData(semester);
        setBranchData(semester.branchSubs[branchIndex].branch);
        handleSemClose();
    };

    const handleConfirmCancel = () => {
        setShowConfirm(false);
    };

    const handleConfirm = () => {
        const record = {} as SubjectSemester;
        if (semesterData !== undefined) {
            record.semester = semesterData.semester ?? 0;
            record.branchSubs = semesterData.branchSubs;
            branchSemesterDialogData.semEnable = true;
            handleSemDelete(record);
        }
        setShowConfirm(false);
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
                        {
                            <Tooltip title="Add Semester">
                                <MenuItem
                                    onClick={() => {
                                        setBranchSemesterDialog({
                                            ...branchSemesterDialogData,
                                            open: true,
                                            semEnable: true,
                                            record: defaultSemesterRecord,
                                        });
                                    }}
                                >
                                    <AddCircleOutlineIcon style={{ color: '#2196f3' }} />
                                </MenuItem>
                            </Tooltip>
                        }
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
                        {
                            <Tooltip title="Add Branch">
                                <MenuItem
                                    onClick={() => {
                                        setBranchSemesterDialog({
                                            ...branchSemesterDialogData,
                                            open: true,
                                            semEnable: false,
                                            record: semesterData,
                                        });
                                    }}
                                >
                                    <AddCircleOutlineIcon style={{ color: '#2196f3' }} />
                                </MenuItem>
                            </Tooltip>
                        }
                    </Select>
                </Stack>
                <Stack>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => {
                            setShowConfirm(true);
                        }}
                        disabled={semesterData?.semester === 0}
                        style={{ marginTop: '20px' }}
                    >
                        Delete
                    </Button>
                    <Confirm
                        title={`Delete Semester ${semesterData?.semester}?`}
                        content="The data selected will Be Permanently removed. It could affect the all the data related to this semester. Are you sure you want to continue"
                        confirm="Yes"
                        confirmColor="primary"
                        cancel="No"
                        isOpen={showConfirm}
                        onConfirm={handleConfirm}
                        onClose={handleConfirmCancel}
                    />
                </Stack>
            </Stack>

            <Stack direction="row">
                <Button
                    disabled={
                        branchData === undefined ||
                        semesterData === undefined ||
                        branchData.length === 0
                    }
                    variant="contained"
                    size="medium"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setAddSubject({
                            ...addSubject,
                            open: true,
                            add: true,
                            record: defaultSubjectRecord,
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
                    <TextField source={SK.SUBJECT('code')} />
                    <TextField source={SK.SUBJECT('name')} />
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
                        source={SK.SUBJECT('code')}
                        label="Code"
                        fullWidth={true}
                        format={(props) => props?.toUpperCase() ?? ''}
                        validate={[required(), noSpaceValidation]}
                    />
                    <TextInput
                        source={SK.SUBJECT('name')}
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
            <Dialog open={branchSemesterDialogData.open} onClose={handleSemClose} fullWidth={true}>
                <SimpleForm
                    record={branchSemesterDialogData.record}
                    onSubmit={handleSemSubmit}
                    toolbar={false}
                >
                    <NumberInput
                        source="semester"
                        label="Semester Number"
                        disabled={!branchSemesterDialogData.semEnable}
                        validate={[required()]}
                    />
                    <TextInput
                        source="branch"
                        label="branch"
                        defaultValue=""
                        validate={[required(), noSpaceValidation, validateName]}
                    />
                    <Stack direction="row" spacing={3}>
                        <SaveButton label={'Add'} />
                    </Stack>
                </SimpleForm>
            </Dialog>
        </Stack>
    );
};

export default SubjectTable;
