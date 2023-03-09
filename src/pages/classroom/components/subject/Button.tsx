import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    useRecordContext,
    Button,
    useDataProvider,
    useRefresh,
    useNotify,
    useListContext,
    useUnselectAll,
} from 'react-admin';
import { useState } from 'react';
import { MAPPING } from 'provider/mapping';
import { Classroom } from 'types/models/classroom';

const resource = MAPPING.CLASSROOMS;

export const CustomSubjectBulkDeleteButton = () => {
    const dataProvider = useDataProvider();
    const record = useRecordContext() as Classroom;
    const notify = useNotify();
    const refresh = useRefresh();
    const { selectedIds } = useListContext();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const unselectAll = useUnselectAll(resource);
    const count = selectedIds.length;

    const handleClose = () => setShowDeleteDialog(!showDeleteDialog);

    const handleDelete = async () => {
        const data = record;

        const subjects_new = Object.values(data.subjects!).filter(
            (e) => !selectedIds.includes(e.id)
        );

        await dataProvider.update<Classroom>(resource, {
            id: record.id,
            data: { subjects: subjects_new, id: record.id },
            previousData: record,
        });

        unselectAll();
        refresh();
        notify(`Deleted ${count} Subjects`, { type: 'success' });
    };

    return (
        <div>
            <Button
                variant="text"
                label="Delete"
                startIcon={<DeleteIcon />}
                onClick={handleClose}
            />
            <Dialog open={showDeleteDialog} keepMounted onClose={handleClose}>
                <DialogTitle>{'Are you sure you want to delete?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {count} Subjects
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button label="No" onClick={handleClose} />
                    <Button
                        label="Yes"
                        onClick={async () => {
                            handleDelete();
                            handleClose();
                        }}
                    />
                </DialogActions>
            </Dialog>
        </div>
    );
};
