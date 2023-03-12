import { Chip } from '@mui/material';
import { MAPPING } from 'provider/mapping';
import {
    List,
    Datagrid,
    TextField,
    useRecordContext,
    FunctionField,
    ReferenceField,
    useListContext,
} from 'react-admin';
import { AttendanceMini, SubjectAttendance } from 'types/models/attendance';

const AttendanceList = () => {
    return (
        <List exporter={false}>
            <Datagrid rowClick="show">
                <ReferenceField
                    source="classroom.id"
                    label="Classroom Id"
                    reference={MAPPING.CLASSROOMS}
                    link="show"
                >
                    {' '}
                    <TextField source="id" />
                </ReferenceField>
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
                <TextField source="strength" />
            </Datagrid>
        </List>
    );
};
export default AttendanceList;
