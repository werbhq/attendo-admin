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

import {
    useRecordContext,
    useListContext,
    useNotify,
    useRefresh,
    useDataProvider,
    useUnselectAll,
    FunctionField,
} from 'react-admin';
import { useState } from 'react';
import { MAPPING } from 'provider/mapping';
import { sortByRoll } from 'Utils/helpers';
import { Student } from 'types/models/student';
import { Classroom } from 'types/models/classroom';

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

    const students = record.students.filter((e) => !selectedIds.includes(e.id));
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

export const CustomVirtualStudentDeleteButton = ({
    deleteHandler,
}: {
    deleteHandler: (students?: Student[] | undefined) => Promise<void>;
}) => {
    const dataProvider = useDataProvider();
    const record = useRecordContext();
    const notify = useNotify();
    const refresh = useRefresh();

    const students: Student[] = [];

    const handleClose = async () => {
        await dataProvider.updateMany(resource, {
            ids: [],
            data: students,
            meta: {
                classId: record.id,
            },
        });
        refresh();
        notify(`Deleted all students`, { type: 'success' });
        await deleteHandler(students);
    };

    return (
        <Button variant="text" color="error" startIcon={<DeleteIcon />} onClick={handleClose}>
            Delete All
        </Button>
    );
};
