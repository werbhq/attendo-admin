import { MAPPING } from '../mapping';
import { httpsCallable } from 'firebase/functions';
import { cloudFunctions } from '../firebase';
import { DataProviderCustom } from 'types/DataProvider';
import { AttendanceReportResponse } from 'types/models/report';
import { Report } from 'types/frontend/report';

/**
 * Don't call this directly
 * Use dataProvider
 */
const ReportsProvider: DataProviderCustom<Report> = {
    resource: MAPPING.REPORTS,

    getList: async (resource, params) => {
        const { filter } = params;
        const { semester, classroomId } = filter;

        const attendanceReportApi = httpsCallable(cloudFunctions, 'attendanceReports');
        const response = (await attendanceReportApi({ semester, classroomId })).data as
            | AttendanceReportResponse
            | undefined;

        const subjects: {
            [id: string]: string;
        } = {};

        response?.subjects?.forEach((e) => {
            subjects[e.subjectId.toLowerCase()] = e.name;
        });

        const attendances = response?.attendances?.map((e) => ({
            ...e,
            attendance: e.attendance.map((sub) => ({
                ...sub,
                name: subjects[sub.subjectId],
            })),
        }));

        return {
            data: attendances ?? [],
            total: attendances?.length ?? 0,
            status: 200,
        };
    },
};

export default ReportsProvider;
