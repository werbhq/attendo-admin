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
    useNotify,
    useRecordSelection,
    useUnselectAll,
    TextField,
} from 'react-admin';
import { Classroom } from '../../../types/models/classroom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CancelIcon from '@mui/icons-material/Cancel';
import CSVReader from 'react-csv-reader';
import jsonExport from 'jsonexport/dist';
import { useState } from 'react';
import { Student } from '../../../types/models/student';
import { MAPPING } from '../../../provider/mapping';
import EditStudent from '../components/student/Edit';
import {
    CustomStudentBulkDeleteButton,
    CustomStudentEditButton,
    CustomVirtualStudentDeleteButton,
    CustomVirtualStudentSaveButton,
} from '../components/student/Buttons';

const resource = MAPPING.STUDENTS;

type studentDialog = {
    enable: boolean;
    add: boolean;
    record: Student | undefined;
};

const StudentTab = ({
    record,
    label,
    path,
    ...props
}: {
    record: Classroom;
    label: string;
    path: string;
    props?: any;
}) => {
    const csvExportHeaders = ['id', 'email', 'regNo', 'rollNo', 'name', 'userName'];
    const notify = useNotify();
    const [, { select }] = useRecordSelection(resource);
    const unselectAll = useUnselectAll(resource);
    const dataProvider = useDataProvider();

    const [studentVirtualDialogOpen, setStudentVirtualDialogOpen] = useState(false);
    const [studentDialog, setStudentDialog] = useState<studentDialog>({
        enable: false,
        add: false,
        record: undefined,
    });

    const [listData, setListData] = useState<Classroom['students']>(record.students);
    const listContext = useList({
        data: listData,
        resource,
        sort: { field: 'classId', order: 'ASC' },
    });

    const disableEdit = () => {
        unselectAll();
        setStudentVirtualDialogOpen(false);
        setListData([]);
    };

    const virtualClassEditHandler = async (e: any) => {
        const students = (e as Student[]) ?? record?.students;

        if (!studentVirtualDialogOpen) {
            const { data: classes } = await dataProvider.getMany<Classroom>(MAPPING.CLASSROOMS, {
                ids: Object.keys(record?.parentClasses ?? {}),
            });
            const fullStudents: Student[] = [];

            classes?.forEach((e) => {
                const students = e.students.map((_e) => ({
                    ..._e,
                    classId: e.id,
                }));
                fullStudents.push(...students);
            });

            setListData(fullStudents);
            select(record?.students.map((e) => e.id) ?? []);
            setStudentVirtualDialogOpen(true);
        } else {
            unselectAll();
            setStudentVirtualDialogOpen(false);
            setListData(students);
        }
    };

    if (record.isDerived) {
        listContext.onUnselectItems = () => {
            virtualClassEditHandler(undefined).then(() => {});
        };
    }

    const CSVStudentReader = () => (
        <CSVReader
            parserOptions={{
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
            }}
            label="Import"
            inputStyle={{ display: 'none' }}
            onFileLoaded={async (data) => {
                const invalidHeader = data.some(
                    (e) => Object.keys(e).sort() === csvExportHeaders.sort()
                );
                if (invalidHeader) {
                    const message = `Headers are invalid. Proper headers are ${csvExportHeaders.join(
                        ','
                    )}`;
                    return notify(message, { type: 'error' });
                }

                await dataProvider.update(MAPPING.CLASSROOMS, {
                    id: record.id,
                    data: {
                        ...record,
                        students: data,
                    },
                    previousData: {},
                });

                notify(`Updated ${data.length} Students of ${record.id}`, {
                    type: 'success',
                });
                setListData(data);
            }}
            onError={() => {
                notify(`Error Importing CSV`, { type: 'error' });
            }}
        />
    );

    return (
        <Tab label={label} path={path} {...props}>
            <Stack spacing={'10px'} sx={{ margin: '20px 0px' }} direction="row">
                {!!record?.isDerived ? (
                    <Button
                        size="medium"
                        variant="contained"
                        startIcon={<EditIcon />}
                        disabled={studentVirtualDialogOpen}
                        onClick={virtualClassEditHandler}
                    >
                        Edit Students
                    </Button>
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

                {!record.isDerived && (
                    <Stack spacing={'10px'} direction="row">
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
                        <Button size="medium" variant="outlined" startIcon={<UploadIcon />}>
                            <CSVStudentReader />
                        </Button>
                    </Stack>
                )}
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
                    <NumberField source="rollNo" />
                    {record.isDerived && (
                        <ReferenceField source="classId" reference={MAPPING.CLASSROOMS} link="show">
                            <TextField source="id" />
                        </ReferenceField>
                    )}
                    <TextField source="regNo" />
                    <TextField source="name" />
                    <EmailField source="email" />
                    <TextField source="userName" />
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
