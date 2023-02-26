import { Button, Stack } from '@mui/material';
import { Show, Tab, TabbedShowLayout, TextField, BooleanField, ReferenceField } from 'react-admin';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import EditSummary from './components/EditSummary';
import { MAPPING } from '../../provider/mapping';

const BatchesShow = () => {
    const [summaryDialog, setSummaryDialog] = useState({ enable: false });

    return (
        <Show>
            <TabbedShowLayout>
                <Tab label="summary">
                    <TextField source="id" />
                    <ReferenceField source="course" reference={MAPPING.COURSES} link="show" />
                    <TextField source="name" label="Batch Name" />
                    <ReferenceField source="schemeId" reference={MAPPING.SUBJECT} link="show" />
                    <BooleanField source="running" />
                    <TextField source="semester" label="Semester" />
                    <TextField source="yearOfJoining" label="Year Of Joining" />
                    <div style={{ margin: '20px 0px' }}>
                        <Stack direction="row" spacing={2}>
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={async () => {
                                    setSummaryDialog({ ...summaryDialog, enable: true });
                                }}
                            >
                                Edit
                            </Button>
                        </Stack>
                    </div>
                </Tab>
                {summaryDialog.enable && (
                    <EditSummary dialog={summaryDialog} setDialog={setSummaryDialog} />
                )}
            </TabbedShowLayout>
        </Show>
    );
};
export default BatchesShow;
