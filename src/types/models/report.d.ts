import { SemSubject } from './semAttendance';

export interface AttendanceReportRequest {
    semester: number;
    classroomId: string;
}

export interface AttendanceReportResponse {
    semester: number;
    classroomId: string;
    subjects: (SemSubject & { classId: string })[];
    attendances: {
        id: string;
        email: string;
        regNo: string;
        userName: string;
        name: string;
        rollNo: number;
        attendance: {
            subjectId: string;
            percentage: number;
        }[];
    }[];
}
