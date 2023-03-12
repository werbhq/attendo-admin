import { DataProviderCustom } from 'types/DataProvider';
import { Attendance, AttendanceMini, SubjectAttendance } from 'types/models/attendance';
import { Classroom } from 'types/models/classroom';
import {
    dataProvider,
    dataProviderLegacy,
    db,
    FieldValue,
    FieldPath,
    defaultParams,
} from '../firebase';
import { paginateSingleDoc } from '../helpers/pagination';
import { MAPPING } from '../mapping';

/**
 * Don't call this directly
 * Use dataProvider
 */
const AttendanceProvider: DataProviderCustom<SubjectAttendance> = {
    resource: MAPPING.ATTENDANCES,

    getList: async (resource, params) => {
        const { id } = params;
        const { data } = await dataProviderLegacy.getList<SubjectAttendance>(
            resource,
            defaultParams
        );
        const classroomRecord = await dataProvider
            .getList<Classroom>(MAPPING.CLASSROOMS, defaultParams)
            .then((e) => e.data);
        const attendanceData = data.flatMap(
            ({ attendances, classroom: classroomShort, semester, subject }) =>
                Object.values(attendances).map((attendance) => {
                    let strength = 0;
                    for (let classroom of classroomRecord) {
                        if (classroom.id === classroomShort.id)
                            strength =
                                Object.keys(classroom.students).length -
                                attendance.absentees.length;
                    }
                    return {
                        attendance,
                        id: attendance.id,
                        classroom: classroomShort,
                        semester,
                        subject,
                        strength,
                    };
                })
        );
        console.log(attendanceData);
        return { data: paginateSingleDoc(params, attendanceData), total: attendanceData.length };
    },

    // getOne: async (resource, params) => {
    //     const { id } = params;
    //     const { data } = await dataProviderLegacy.getOne(resource, { id: id });
    //     return { data: data.attendance.id, status: 200 };
    // },
};

export default AttendanceProvider;
