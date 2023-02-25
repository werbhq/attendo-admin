import { ClassroomProvider } from './custom/classroom';
import { StudentsProvider } from './custom/students';
import { SubjectsProvider } from './custom/subjects';
import { SemestersProvider } from './custom/semesters';
import { AuthTeachersProvider } from './custom/authorizedTeachers';
import { ReportsProvider } from './custom/reports';
import { BatchesProvider } from './custom/batches';
import { DataProviderCustom } from '../types/DataProvider';

// ADD YOUR PROVIDERS HERE
const CustomProviders: DataProviderCustom<any>[] = [
    ClassroomProvider,
    SemestersProvider,
    StudentsProvider,
    SubjectsProvider,
    AuthTeachersProvider,
    ReportsProvider,
    BatchesProvider,
];

export default CustomProviders;
