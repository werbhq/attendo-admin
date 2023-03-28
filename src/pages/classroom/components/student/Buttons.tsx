import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';

import {
    useRecordContext,
    useListContext,
    useNotify,
    useRefresh,
    useDataProvider,
    useUnselectAll,
    FunctionField,
} from 'react-admin';
import { useState, useRef } from 'react';
import { MAPPING } from 'provider/mapping';
import { sortByRoll } from 'Utils/helpers';
import { StudentShort as Student } from 'types/models/student';
import { Classroom } from 'types/models/classroom';
import CSVReader from 'react-csv-reader';

const resource = MAPPING.STUDENTS;

export const CustomStudentEditButton = ({
    state,
}: {
    state: {
        dialog: {
            enable: boolean;
            add: boolean;
            record: Student | undefined;
        };
        setDialog: React.Dispatch<
            React.SetStateAction<{
                enable: boolean;
                add: boolean;
                record: Student | undefined;
            }>
        >;
    };
}) => {
    const { setDialog, dialog } = state;
    return (
        <FunctionField
            label="Edit"
            render={(record: Student) => {
                return (
                    <Button
                        startIcon={<EditIcon />}
                        onClick={() => {
                            setDialog({
                                ...dialog,
                                enable: true,
                                add: false,
                                record,
                            });
                        }}
                    />
                );
            }}
        />
    );
};

export const CustomStudentBulkDeleteButton = ({
    setList,
}: {
    setList: React.Dispatch<React.SetStateAction<Student[]>>;
}) => {
    const dataProvider = useDataProvider();
    const record = useRecordContext() as Classroom;
    const notify = useNotify();
    const refresh = useRefresh();
    const unselectAll = useUnselectAll(resource);
    const { selectedIds } = useListContext();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const students = Object.values(record.students).filter((e) => !selectedIds.includes(e.id));
    const count = selectedIds.length;

    const handleClose = () => setShowDeleteDialog(!showDeleteDialog);

    const handleDelete = async () => {
        const studentData = students.sort(sortByRoll);
        await dataProvider.updateMany<Student>(resource, {
            ids: [],
            data: studentData,
            meta: { classId: record.id },
        });
        unselectAll();
        setList(studentData);
        refresh();
        notify(`Deleted ${count} Student`, { type: 'success' });
    };

    return (
        <div>
            <Button variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleClose}>
                Delete
            </Button>
            <Dialog open={showDeleteDialog} keepMounted onClose={handleClose}>
                <DialogTitle>{'Are you sure you want to delete?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {count} Students
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button
                        onClick={async () => {
                            handleDelete();
                            handleClose();
                        }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export const CustomVirtualStudentSaveButton = ({
    list,
    saveHandler,
}: {
    list: Student[];
    saveHandler: (students?: Student[] | undefined) => Promise<void>;
}) => {
    const dataProvider = useDataProvider();
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();

    const { selectedIds } = useListContext();

    const students = list.filter((e) => selectedIds.includes(e.id));
    const count = selectedIds.length;

    const handleClose = async () => {
        await dataProvider.updateMany(resource, {
            ids: [],
            data: students.sort(sortByRoll),
            meta: {
                classId: record.id,
            },
        });
        refresh();
        notify(`Added ${count} Student`, { type: 'success' });
        await saveHandler(students.sort(sortByRoll));
    };

    return (
        <Button variant="text" color="primary" startIcon={<SaveIcon />} onClick={handleClose}>
            Save
        </Button>
    );
};

export const ImportButton = ({
    csvExportHeaders,
    setListData,
}: {
    csvExportHeaders: string[];
    setListData: React.Dispatch<React.SetStateAction<Student[]>>;
}) => {
    type ClassroomCustom = Omit<Classroom, 'parentClasses'> & { parentClasses: string[] };
    type StudentCustom = Student & { classId: string };

    const importRef = useRef<HTMLInputElement>(null);
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const record: ClassroomCustom = useRecordContext();

    const fileLoadHandler = async (data: StudentCustom[]) => {
        const invalidHeader = data.some((e) => {
            const keys = Object.keys(e).sort();
            const containsAllHeaders = csvExportHeaders.every((header) => keys.includes(header));
            return !containsAllHeaders;
        });

        if (invalidHeader) {
            const message = `Headers are invalid. Proper headers are ${csvExportHeaders.join(',')}`;
            return notify(message, { type: 'error' });
        }

        if (record.isDerived) {
            const parentClasses = record.parentClasses;
            const invalidClassId = data.some((e) => !parentClasses.includes(e.classId));

            if (invalidClassId) {
                const message = `ClassIds don't match the Parent Classes Proper classIds are ${parentClasses.join(
                    ','
                )}`;
                return notify(message, { type: 'error' });
            }

            data = data.filter((e) => parentClasses.includes(e.classId));
        } else {
            const classId = record.id;
            let containedClassId;
            if (data.some((e) => e.hasOwnProperty('classId'))) {
                containedClassId = data.filter((e) => e.classId === classId);
            } else {
                containedClassId = data;
            }
            data = containedClassId;
        }

        await dataProvider.update<Student>(MAPPING.STUDENTS, {
            id: record.id,
            data,
            previousData: Object.values(record.students),
            meta: { record },
        });

        notify(`Updated ${data.length} Students of ${record.id}`, {
            type: 'success',
        });
        setListData(data);
    };

    return (
        <Button
            size="medium"
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => {
                if (importRef.current) {
                    importRef.current.value = '';
                    importRef.current.click();
                }
            }}
        >
            <CSVReader
                parserOptions={{
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                }}
                inputRef={importRef}
                inputStyle={{ display: 'none' }}
                onFileLoaded={fileLoadHandler}
                onError={() => notify(`Error Importing CSV`, { type: 'error' })}
            />
            Import
        </Button>
    );
};
