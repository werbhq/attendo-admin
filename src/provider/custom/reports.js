import { MAPPING } from "../mapping";
import { httpsCallable } from "firebase/functions";
import { cloudFunctions } from "../firebase";

/**
 * Don't call this directly
 * Use dataProvider
 */
export const ReportsProvider = {
  resource: MAPPING.REPORTS,

  /**
   * @param {string} resource
   * @param {import("react-admin").ListParams} params
   * @returns {Promise<import("react-admin").GetListResult>}
   * */
  getList: async (resource, params) => {
    const { filter } = params;
    const { semester, classroomId } = filter;

    const attendanceReportApi = httpsCallable(
      cloudFunctions,
      "attendanceReports"
    );

    const response = await (
      await attendanceReportApi({ semester, classroomId })
    ).data;

    const subjects = {};
    response?.subjects?.forEach((e) => {
      subjects[e.subjectId.toLowerCase()] = e.name;
    });

    const attendances = response?.attendances?.map((e) => ({
      ...e,
      attendance: e?.attendance?.map((sub) => ({
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
