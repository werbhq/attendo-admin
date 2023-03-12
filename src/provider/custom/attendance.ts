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
        const { data: classroomRecord } = await dataProvider.getMany<Classroom>(
            MAPPING.CLASSROOMS,
            { ids: data.map((e) => e.classroom.id) }
        );
        const attendanceData = data.flatMap(
            ({ attendances, classroom: classroomShort, semester, subject }) =>
                Object.values(attendances).map((attendance) => {
                    const classroomStrength = Object.keys(
                        classroomRecord.find((e) => e.id == classroomShort.id)?.students ?? {}
                    ).length;
                    const absenttes = attendance.absentees.length;
                    const strength = classroomStrength - absenttes;
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
        return { data: paginateSingleDoc(params, attendanceData), total: attendanceData.length };
    },

    // getOne: async (resource, params) => {
    //     const { id } = params;
    //     const attendance = await db
    //         .collection(MAPPING.ATTENDANCES)
    //         .where(`attendances.id`, '==', id)
    //         .get();
    //     console.log(attendance);
    //     const { data } = await dataProviderLegacy.getOne(resource, {
    //         id: id,
    //     });
    //     return { data: data.attendance[params.id], status: 200 };
    // },
};

export default AttendanceProvider;
