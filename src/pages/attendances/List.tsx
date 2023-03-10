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
    const record = useRecordContext();
    console.log(record);
    // const sem_record =record === undefined
    //         ? ([] as SubjectAttendance[])
    //         : (record as SubjectAttendance[]);
    // const tableData = useList({
    //     data: sem_record,
    // });
    // console.log(sem_record);
    // console.log(tableData);
    if (!record || !record.attendances) {
        return <div>No attendance records found.</div>;
    }
    const attendanceKeys = Object.keys(record.attendances);
    console.log(attendanceKeys);
    return (
        <List exporter={false}>
            <Datagrid
                rowClick="show"
                // bulkActionButtons={<PostBulkActionButtons />}
            >
                <>
                    <TextField source="e.id" />
                </>
            </Datagrid>
        </List>
    );
};
export default AttendanceList;
