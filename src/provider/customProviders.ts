import ClassroomProvider from './custom/classroom';
import StudentsProvider from './custom/students';
import SubjectsProvider from './custom/subjects';
import CoursesProvider from './custom/courses';
import AuthTeachersProvider from './custom/authorizedTeachers';
import ReportsProvider from './custom/reports';
import BatchesProvider from './custom/batches';
import { DataProviderCustom } from '../types/DataProvider';
import AttendanceProvider from './custom/attendance';

// ADD YOUR PROVIDERS HERE
const CustomProviders: DataProviderCustom<any>[] = [
    ClassroomProvider,
    CoursesProvider,
    StudentsProvider,
    SubjectsProvider,
    AuthTeachersProvider,
    ReportsProvider,
    BatchesProvider,
    AttendanceProvider
];

export default CustomProviders;
