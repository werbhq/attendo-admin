// import { https } from 'firebase-functions';
// import type { SemAttendance, SemSubject } from '../types/models/semAttendance';
// import { getClassroom, getSemAttendance } from '../firebase';
import {
    Attendance,
    AttendanceReportResponse,
    SubjectAttendance,
    _CustomSubject,
} from 'types/models/attendance';
import classroom from 'provider/custom/classroom';
import { dataProvider, defaultParams } from 'provider/firebase';
import { MAPPING } from 'provider/mapping';
import { Classroom } from 'types/models/classroom';

interface AttendanceReportRequest {
    semester: number;
    classroomId: string;
}

const attendanceReportsHandler = async (
    semester: number,
    classroomId: string,
    schemeId: number
) => {
    const { data } = await dataProvider.getList<Classroom>(MAPPING.CLASSROOMS, defaultParams);

    const classroomData = data.filter((e) => e.id === classroomId);
    if (classroomData === undefined) return {};
    const attendance = dataProvider.getList<SubjectAttendance>(MAPPING.ATTENDANCES, defaultParams);
    console.log(attendance);

    // const semAttendanceId = `${classroomId}-S${semester}`;

    // const { orginalClass: semAttendance, virtualClasses } = await subjec(
    //     semAttendanceId,
    //     classroomId,
    //     semester
    // );
    // if (semAttendance === undefined && virtualClasses?.length === 0) return {};

    const classes = new Map<string, SubjectAttendance>();
    const classSubjects: _CustomSubject[] = [];

    // if (true) {
    //     classes.set(semAttendance.id, semAttendance);
    //     classSubjects.push(
    //         ...Object.values(semAttendance.totalAttendance).map((sub) => ({
    //             ...sub,
    //             classId: semAttendance.id,
    //         }))
    //     );
    // }
    // virtualClasses.forEach((e) => {
    //     classes.set(e.id, e);
    //     classSubjects.push(
    //         ...Object.values(e.totalAttendance).map((sub) => ({ ...sub, classId: e.id }))
    //     );
    // });

    // if (classSubjects.length === 0) return {};

    // const report: AttendanceReportResponse = {
    //     semester,
    //     classroomId,
    //     subjects,
    //     attendances: [],
    // };

    // for (const student of Object.values(classroom.students)) {
    //     const attendances = [];

    //     for (const { subjectId, classId } of classSubjects) {
    //         const semClass = classes.get(classId);
    //         const classMember = semClass?.students[student.id];
    //         const total = semClass?.totalAttendance[subjectId]?.total ?? 0;
    //         let percentage = 100;

    //         if (classMember) {
    //             const absent = classMember.attendances[subjectId]?.absent ?? 0;
    //             if (total !== 0) percentage = ((total - absent) / total) * 100;
    //         } else {
    //             percentage = -1;
    //         }
    //         attendances.push({ subjectId, percentage });
    //     }

    //     const attendance = {
    //         id: student.id,
    //         email: student.email,
    //         regNo: student.regNo,
    //         userName: student.userName,
    //         name: student.name,
    //         rollNo: student.rollNo,
    //         attendance: attendances,
    //     };
    //     report.attendances.push(attendance);
    // }
};

export default attendanceReportsHandler;
