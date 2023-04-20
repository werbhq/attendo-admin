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

    const newSubjectRecord = {
        id: '',
        code: '',
        name: '',
    };
    const newSemesterRecord = { semester: 0, branchSubs: [{ branch: '', subjects: [] }] };

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
        data.semesters.length !== 0 ? data.semesters[0] : newSemesterRecord
    );
    const [showConfirm, setShowConfirm] = useState(false);
    const [addSemester, setAddSemester] = useState<{
        open: boolean;
        semEnable: boolean;
        record: SubjectSemester | undefined;
    }>({
        open: false,
        semEnable: false,
        record: newSemesterRecord,
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
        const semesterIndex = data.semesters.findIndex((e) => e.semester === record.semester); //0
        const currentSemIndex = semesterIndex - 1 >= 0 ? semesterIndex - 1 : 0; //0
        if (semesterIndex !== -1) {
            const updatedData = {
                ...data,
                semesters: data.semesters.filter((e) => e.semester !== record.semester),
            };
            let semester = newSemesterRecord as SubjectSemester;
            if (updatedData.semesters.length > 0) {
                semester = updatedData.semesters[currentSemIndex] as SubjectSemester; //8
                setSemesterData(semester);
                setBranchData(semester.branchSubs[0].branch);
            } else {
                setSemesterData(semester);
                setBranchData('');
            }
            await dataProvider.update(url, { id: data.id, data: updatedData, previousData: data });
            notify(`Sem ${record.semester} and its contents are deleted permanently`);
            refresh();
            handleSemClose();
        }
    };
    const handleSemClose = () => {
        setAddSemester({ ...addSemester, open: false });
    };
    const handleSemSubmit = async (e: any) => {
        let semesterIndex = data.semesters.findIndex(
            (semester) => semester.semester === e.semester
        );
        let branchIndex = -1;
        if (semesterIndex === -1) {
            data.semesters.push({
                semester: e.semester,
                branchSubs: [{ branch: e.branch, subjects: [] }],
            });
            semesterIndex = data.semesters.length - 1;
            branchIndex = 0;
            notify('Sem Updated');
        } else {
            branchIndex = data.semesters[semesterIndex].branchSubs.findIndex(
                (branch) => branch.branch === e.branch
            );
            if (branchIndex !== -1) {
                notify(`Branch ${e.branch} is already present`);
            } else {
                notify(`Sem ${e.semester} is already present`);
                data.semesters[semesterIndex].branchSubs.push({ branch: e.branch, subjects: [] });
                branchIndex = data.semesters[semesterIndex].branchSubs.length - 1;
                notify(`Branch ${e.branch} will be added to S${e.semester}`);
            }
        }

        await dataProvider.update(url, { id: data.id, data, previousData: data });
        const semester = data.semesters[semesterIndex] as SubjectSemester;
        setSemesterData(semester);
        setBranchData(semester.branchSubs[branchIndex].branch);
        refresh();
        handleSemClose();
    };

    const handleConfirmCancel = () => {
        setShowConfirm(false);
    };
    const handleConfirm = () => {
        const record = {} as SubjectSemester;
        if (semesterData !== undefined) {
            record.semester = semesterData.semester;
            record.branchSubs = semesterData.branchSubs;
            addSemester.semEnable = true;
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
                                        setAddSemester({
                                            ...addSemester,
                                            open: true,
                                            semEnable: true,
                                            record: semesterData,
                                        });
                                    }}
                                >
                                    <AddIcon
                                        style={{
                                            color: '#2196f3',
                                            width: 15,
                                            height: 15,
                                            borderRadius: '50%',
                                            border: '2px solid #2196f3',
                                            borderColor: '#2196f3',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    />
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
                                        setAddSemester({
                                            ...addSemester,
                                            open: true,
                                            semEnable: false,
                                            record: semesterData,
                                        });
                                    }}
                                >
                                    <AddIcon
                                        style={{
                                            color: '#2196f3',
                                            width: 15,
                                            height: 15,
                                            borderRadius: '50%',
                                            border: '2px solid #2196f3',
                                            borderColor: '#2196f3',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    />
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
                    <TextField source={SK.SUBJECT("code")} />
                    <TextField source={SK.SUBJECT("name")} />
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
                        source={SK.SUBJECT("code")}
                        label="Code"
                        fullWidth={true}
                        format={(props) => props?.toUpperCase() ?? ''}
                        validate={[required(), noSpaceValidation]}
                    />
                    <TextInput
                        source={SK.SUBJECT("name")}
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
            <Dialog open={addSemester.open} onClose={handleSemClose} fullWidth={true}>
                <SimpleForm
                    record={addSemester.record}
                    onSubmit={handleSemSubmit}
                    toolbar={false}
                    defaultValues={{}}
                >
                    <NumberInput
                        source="semester"
                        label="Semester Number"
                        disabled={!addSemester.semEnable}
                        min={1}
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
