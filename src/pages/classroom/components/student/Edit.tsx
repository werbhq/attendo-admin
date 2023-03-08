import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    NumberInput,
    SimpleForm,
    TextInput,
    useDataProvider,
    useRecordContext,
    useRefresh,
    useNotify,
    SaveButton,
} from 'react-admin';
import { MAPPING } from 'provider/mapping';
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from '@mui/material';
import { autoCapitalize, sortByRoll } from 'Utils/helpers';
import { useState } from 'react';
import { Student } from 'types/models/student';
import { Classroom } from 'types/models/classroom';

const CustomDeleteButton = ({
    handleDelete,
}: {
    handleDelete: (newRecord: Student) => Promise<void>;
}) => {
    const record = useRecordContext<Student>();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const handleClose = () => setShowDeleteDialog(!showDeleteDialog);

    return (
        <div>
            <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleClose}
            >
                Delete
            </Button>
            <Dialog open={showDeleteDialog} keepMounted onClose={handleClose}>
                <DialogTitle>{`Are you sure you want to delete?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {record.email}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button
                        onClick={async () => {
                            handleDelete(record);
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

export default function EditStudent({
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
}) {
    const url = MAPPING.STUDENTS;
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();
    const { id, students } = useRecordContext<Classroom>();

    const { setDialog, dialog } = state;
    const { record } = dialog;
    const student: any = record ?? {
        id: null,
        name: null,
        rollNo: null,
        regNo: null,
        email: null,
        userName: null,
    };

    const newStudents = students;
    const style = { width: 1 };

    const handleSave = async (e: any) => {
        const newRecord = e as Student;
        const index = students.findIndex((e) => e.id === newRecord.id);
        if (index !== -1) newStudents[index] = newRecord;
        else newStudents.push({ ...newRecord, id: newRecord.email });

        await dataProvider.update(url, {
            id,
            data: newStudents.sort(sortByRoll),
            previousData: students.sort(sortByRoll),
            meta: { record: newRecord },
        });
        refresh();
        notify(`${index === -1 ? 'Added' : 'Edited'} Student ${newRecord.email}`, {
            type: 'success',
        });
        setDialog({ ...dialog, enable: false });
    };

    const handleDelete = async (newRecord: Student) => {
        newStudents.splice(
            students.findIndex((e) => e.id === newRecord.id),
            1
        );

        await dataProvider.update(url, {
            id,
            data: newStudents.sort(sortByRoll),
            previousData: students.sort(sortByRoll),
            meta: {
                record: newRecord,
            },
        });

        notify(`Deleted Student ${newRecord.email}`, { type: 'success' });
        refresh();
        setDialog({ ...dialog, enable: false });
    };

    return (
        <Dialog
            open={dialog.enable}
            onClose={() => setDialog({ ...dialog, enable: false })}
            fullWidth={true}
        >
            <SimpleForm record={student} onSubmit={handleSave} toolbar={false}>
                {!dialog.add && <TextInput source="id" label="Id" disabled={true} sx={style} />}
                <NumberInput
                    source="rollNo"
                    label="Roll"
                    sx={style}
                    onWheel={(e) => e.target instanceof HTMLElement && e.target.blur()}
                    required
                />
                <TextInput
                    source="regNo"
                    label="Registration Number"
                    sx={style}
                    required
                    format={(props) => props && autoCapitalize(props)}
                />
                <TextInput source="name" label="Name" sx={style} required />
                <TextInput source="email" label="Email" sx={style} required />
                <TextInput source="userName" label="User Name" sx={style} />
                <Stack direction="row" spacing={3}>
                    <SaveButton label={dialog.add ? 'Add' : 'Save'} />
                    {!dialog.add && <CustomDeleteButton handleDelete={handleDelete} />}
                </Stack>
            </SimpleForm>
        </Dialog>
    );
}
