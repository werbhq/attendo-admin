import { Button, Stack } from '@mui/material';
import {
    Datagrid,
    EmailField,
    ListContextProvider,
    NumberField,
    ReferenceField,
    Tab,
    downloadCSV,
    useDataProvider,
    useList,
    useRecordSelection,
    useUnselectAll,
    TextField,
    useRecordContext,
} from 'react-admin';
import { Classroom } from 'types/models/classroom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import jsonExport from 'jsonexport/dist';
import { useState } from 'react';
import { StudentShort as Student } from 'types/models/student';
import { MAPPING } from 'provider/mapping';
import EditStudent from '../components/student/Edit';
import {
    CustomStudentBulkDeleteButton,
    CustomStudentEditButton,
    CustomVirtualStudentDeleteButton,
    CustomVirtualStudentSaveButton,
    ImportButton,
} from '../components/student/Buttons';
import { LoadingButton } from '@mui/lab';
import { sortByRoll } from 'Utils/helpers';
import SK from 'pages/source-keys';

const resource = MAPPING.STUDENTS;

type studentDialog = {
    enable: boolean;
    add: boolean;
    record: Student | undefined;
};

const StudentTab = ({ label, path, ...props }: { label: string; path: string; props?: any }) => {
    const dataProvider = useDataProvider();
    const record: Classroom = useRecordContext();

    const csvExportHeaders = record.isDerived
        ? ['classId', 'id', 'email', 'regNo', 'rollNo', 'name', 'userName']
        : ['id', 'email', 'regNo', 'rollNo', 'name', 'userName'];

    const [, { select }] = useRecordSelection(resource);
    const unselectAll = useUnselectAll(resource);

    const [isLoading, setIsLoading] = useState(false);
    const classroomStudents = Object.values(record.students).sort(sortByRoll);

    const [studentVirtualDialogOpen, setStudentVirtualDialogOpen] = useState(false);
    const [studentDialog, setStudentDialog] = useState<studentDialog>({
        enable: false,
        add: false,
        record: undefined,
    });

    const [listData, setListData] = useState<Student[]>(classroomStudents.sort(sortByRoll));
    const sort = record.isDerived ? { field: 'classId', order: 'ASC' } : { field: '', order: '' };
    const listContext = useList({
        data: listData,
        resource,
        sort: sort,
    });

    const disableEdit = () => {
        unselectAll();
        setStudentVirtualDialogOpen(false);
        setListData(classroomStudents);
    };

    const virtualClassEditHandler = async (e: any) => {
        const students = (e as Student[]) ?? classroomStudents;

        if (!studentVirtualDialogOpen) {
            setIsLoading(true);

            const { data: classes } = await dataProvider.getMany<Classroom>(MAPPING.CLASSROOMS, {
                ids: Object.keys(record?.parentClasses ?? {}),
            });
            const fullStudents: Student[] = [];

            classes?.forEach((e) => {
                const studentsTemp = Object.values(e.students).map((_e) => ({
                    ..._e,
                    classId: e.id,
                }));
                fullStudents.push(...studentsTemp);
            });

            setListData(fullStudents.sort(sortByRoll));
            select(classroomStudents.map((e) => e.id) ?? []);
            setStudentVirtualDialogOpen(true);
            setIsLoading(false);
        } else {
            unselectAll();
            setStudentVirtualDialogOpen(false);
            setListData(students);
        }
    };

    if (record.isDerived) {
        listContext.onUnselectItems = () => virtualClassEditHandler(null);
    }

    return (
        <Tab label={label} path={path} {...props}>
            <Stack
                spacing={'10px'}
                sx={{ margin: '20px 0px' }}
                justifyContent="space-between"
                direction="row"
            >
                <Stack spacing="10px" direction="row">
                    {!!record?.isDerived ? (
                        <LoadingButton
                            size="medium"
                            variant="contained"
                            startIcon={<EditIcon />}
                            disabled={studentVirtualDialogOpen}
                            loading={isLoading}
                            onClick={virtualClassEditHandler}
                        >
                            Edit Students
                        </LoadingButton>
                    ) : (
                        <Button
                            size="medium"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setStudentDialog({
                                    ...studentDialog,
                                    add: true,
                                    enable: true,
                                    record: undefined,
                                });
                            }}
                        >
                            Add Student
                        </Button>
                    )}

                    {studentVirtualDialogOpen && (
                        <Button
                            size="medium"
                            variant="contained"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={disableEdit}
                        >
                            Cancel
                        </Button>
                    )}
                </Stack>

                <Stack spacing="10px" direction="row">
                    <Button
                        size="medium"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => {
                            jsonExport(listData, { headers: csvExportHeaders }, (err, csv) => {
                                downloadCSV(csv, `${record.id}`);
                            });
                        }}
                    >
                        Export
                    </Button>
                    <ImportButton setListData={setListData} csvExportHeaders={csvExportHeaders} />
                </Stack>
            </Stack>

            <ListContextProvider value={listContext}>
                <Datagrid
                    sx={{ paddingTop: '30px' }}
                    bulkActionButtons={
                        record.isDerived ? (
                            studentVirtualDialogOpen && (
                                <>
                                    <CustomVirtualStudentDeleteButton
                                        deleteHandler={virtualClassEditHandler}
                                    />
                                    <CustomVirtualStudentSaveButton
                                        list={listData}
                                        saveHandler={virtualClassEditHandler}
                                    />
                                </>
                            )
                        ) : (
                            <CustomStudentBulkDeleteButton setList={setListData} />
                        )
                    }
                >
                    <NumberField source={SK.STUDENT('rollNo')} />
                    {record.isDerived && (
                        <ReferenceField
                            source={SK.STUDENT('classId')}
                            reference={MAPPING.CLASSROOMS}
                            link="show"
                        >
                            <TextField source={SK.STUDENT('id')} />
                        </ReferenceField>
                    )}
                    <TextField source={SK.STUDENT('regNo')} />
                    <TextField source={SK.STUDENT('name')} />
                    <EmailField source={SK.STUDENT('email')} />
                    <TextField source={SK.STUDENT('userName')} />
                    {!record.isDerived && (
                        <CustomStudentEditButton
                            state={{
                                dialog: studentDialog,
                                setDialog: setStudentDialog,
                            }}
                        />
                    )}
                </Datagrid>
            </ListContextProvider>

            {/* Popup */}
            {studentDialog.enable && (
                <EditStudent
                    state={{
                        dialog: studentDialog,
                        setDialog: setStudentDialog,
                    }}
                />
            )}
        </Tab>
    );
};

export default StudentTab;
