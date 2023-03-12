import { Chip } from '@mui/material';
import { MAPPING } from 'provider/mapping';
import {
    ArrayField,
    ChipField,
    ReferenceArrayField,
    ReferenceField,
    Show,
    SingleFieldList,
    Tab,
    TabbedShowLayout,
    TextField,
    useRecordContext,
    useShowContext,
    useShowController,
} from 'react-admin';

const AttendanceShow = () => {
    const { record } = useShowController();
    const absentees=record.attendance.absentees;
    return (
        <Show emptyWhileLoading>
            {record !== undefined && (
                <TabbedShowLayout>
                    <Tab label="summary">
                        <TextField source="id" />
                        <TextField source="attendance.date" label="Date" />

                        <ReferenceField
                            source="attendance.teacherId"
                            label="Teacher"
                            reference={MAPPING.AUTH_TEACHERS}
                            link="show"
                        />
                        <ReferenceField
                            source="classroom.id"
                            label="Classroom Id"
                            reference={MAPPING.CLASSROOMS}
                            link="show"
                        >
                            {' '}
                            <TextField source="id" />
                        </ReferenceField>
                        <TextField source="subject.name" />
                        {absentees && (
                            <div>
                                {absentees.map((absentee: any) => (
                                    <Chip label={absentee} />
                                ))}{' '}
                            </div>
                        )}
                    </Tab>
                </TabbedShowLayout>
            )}
        </Show>
    );
};
export default AttendanceShow;
