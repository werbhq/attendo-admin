import { DataProviderCustom } from 'types/DataProvider';
import { Attendance, SubjectAttendance } from 'types/models/attendance';
import { dataProvider, dataProviderLegacy, db, FieldValue, FieldPath } from '../firebase';
import { paginateSingleDoc } from '../helpers/pagination';
import { MAPPING } from '../mapping';

/**
 * Don't call this directly
 * Use dataProvider
 */
const AttendanceProvider: DataProviderCustom<Attendance> = {
    resource: MAPPING.ATTENDANCES,

    getList: async (resource, params) => {
        const { id } = params;
        const { data } = await dataProviderLegacy.getOne(resource, {
            id: id
        });
        
        const values = Object.values(data.attendances) as SubjectAttendance[];
        return { data: paginateSingleDoc(params, values), total: values.length };
    },

    getOne: async (resource, params) => {
        const { id } = params;
        const { data } = await dataProviderLegacy.getOne(resource, {
            id: id
        });
        return { data: data.attendance[params.id], status: 200 };
    },
};

export default AttendanceProvider;
