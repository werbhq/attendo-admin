import { AttendanceMini, SubjectAttendance } from 'types/models/attendance';

export interface AttendanceFrontEnd {
    id: AttendanceMini['id'];
    attendance: AttendanceMini;
    classroom: SubjectAttendance['classroom'];
    semester: SubjectAttendance['semester'];
    subject: SubjectAttendance['subject'];
    strength: number;
}
