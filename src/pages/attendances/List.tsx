import { Chip } from '@mui/material';
import { MAPPING } from 'provider/mapping';
import {
    List,
    Datagrid,
    EmailField,
    TextField,
    BooleanField,
    useRecordContext,
    useList,
    useListContext,
    FunctionField,
    ReferenceField,
} from 'react-admin';
import { Attendance, AttendanceMini, SubjectAttendance } from 'types/models/attendance';

const AttendanceList = () => {
    const record = useRecordContext();
    return (
        <List exporter={false}>
            <Datagrid rowClick="show">
                <TextField source="id" />
                <TextField source="date" />
                <TextField source="hour" />
                <ReferenceField source="teacherId" reference={MAPPING.AUTH_TEACHERS} link="show" />
            </Datagrid>
        </List>
    );
};
export default AttendanceList;
