import { DataProviderCustom } from 'types/DataProvider';
import { Attendance, AttendanceMini, SubjectAttendance } from 'types/models/attendance';
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
        // const colRef = db.collection(MAPPING.ATTENDANCES);
        // console.log(colRef);
        // const doc = (await colRef.doc().get());
        // console.log(doc);

        const { data } = await dataProviderLegacy.getList<SubjectAttendance>(
            resource,
            defaultParams
        );
        const values = data.map((e) => e.attendances);
        const attendanceValues = Array.from(values.values());
        const attendanceData: AttendanceMini[] = [];
        for (let val of attendanceValues) {
            const a = Object.entries(val);
            a.map((e) => attendanceData.push(e[1]));
        }
        console.log(attendanceData);
        return { data: paginateSingleDoc(params, attendanceData), total: attendanceData.length };
    },

    // getOne: async (resource, params) => {
    //     const { id } = params;
    //     const { data } = await dataProviderLegacy.getOne(resource, {
    //         id: id,
    //     });
    //     return { data: data.attendance[params.id], status: 200 };
    // },
};

export default AttendanceProvider;
