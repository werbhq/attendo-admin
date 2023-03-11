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

        const { id } = params;
        const { data } = await dataProviderLegacy.getList<SubjectAttendance>(
            resource,
            defaultParams
        );
        let attendanceMap = {};
        const attendanceData = [];
        const attendanceValues = data.flatMap(({ attendances }) => Object.values(attendances));

        for (let val of attendanceValues){
            attendanceMap={attendance:val,id:val.id}
            for (let v in data) {
                attendanceMap = {
                    ...attendanceMap,
                    classroom: data[v].classroom,
                    semester:data[v].semester,
                    subject:data[v].subject
                };
            }
            attendanceData.push(attendanceMap);
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
