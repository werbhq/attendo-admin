import { Chip } from '@mui/material';
import { MAPPING } from 'provider/mapping';
import {
    List,
    Datagrid,
    TextField,
    useRecordContext,
    FunctionField,
    ReferenceField,
} from 'react-admin';
import { AttendanceMini, SubjectAttendance } from 'types/models/attendance';

const AttendanceList = () => {
    const record = useRecordContext();
    return (
        <List exporter={false}>
            <Datagrid rowClick="show">
                <TextField source="classroom.id" label="Classroom Id" />
                <TextField source="attendance.date" label="Date" />
                <TextField source="semester" />
                <TextField source="attendance.hour" label="Hour" />
                <ReferenceField
                    source="attendance.teacherId"
                    label="Teacher"
                    reference={MAPPING.AUTH_TEACHERS}
                    link="show"
                />
                <FunctionField
                    label="Absentees Count"
                    source="attendance.absentees"
                    render={(record: { attendance: { absentees: string[] | any[] } }) =>
                    record.attendance.absentees.length
                }
                />
            </Datagrid>
        </List>
    );
};
export default AttendanceList;
