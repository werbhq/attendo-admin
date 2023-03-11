import { MAPPING } from '../mapping';
import { httpsCallable } from 'firebase/functions';
import { cloudFunctions, dataProvider, dataProviderLegacy, db, defaultParams } from '../firebase';
import { DataProviderCustom } from 'types/DataProvider';
import {
    AttendanceReportResponse,
    AttendanceReportResponseFrontEnd,
} from 'types/models/attendance';
import { Classroom } from 'types/models/classroom';
import { SubjectBranchSubs, SubjectDoc } from 'types/models/subject';

/**
 * Don't call this directly
 * Use dataProvider
 */
const ReportsProvider: DataProviderCustom<AttendanceReportResponseFrontEnd> = {
    resource: MAPPING.REPORTS,

    getList: async (resource, params) => {
        const { filter } = params;
        const { semester, classroomId } = filter;
        const attendanceReportApi = httpsCallable(cloudFunctions, 'attendanceReports');
        const response = (await attendanceReportApi({ semester, classroomId })).data as
            | AttendanceReportResponse
            | undefined;

        const { data } = await dataProvider.getList<Classroom>(MAPPING.CLASSROOMS, defaultParams);
        const classroomData = data.filter((e) => e.id === classroomId)[0];
        const schemeId = classroomData.batch.schemeId;
        const subjData = await dataProvider.getList<SubjectDoc>(MAPPING.SUBJECT, defaultParams);
        const subject = subjData.data.filter((e) => e.id == schemeId)[0];
        console.log(classroomData);
        console.log(subject);

        console.log(response);
        const attendance=db.collection(MAPPING.ATTENDANCES);
        
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
