import {
    List,
    Datagrid,
    EmailField,
    TextField,
    BooleanField,
    useRecordContext,
    useList,
    useListContext,
} from 'react-admin';
import { SubjectAttendance } from 'types/models/attendance';

const AttendanceList = () => {
    return (
        <List exporter={false}>
            <Datagrid rowClick="show">
                <>
                    <TextField source="id" />
                </>
            </Datagrid>
        </List>
    );
};
export default AttendanceList;
