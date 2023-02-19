import { ClassroomProvider } from "./custom/classroom";
import { StudentsProvider } from "./custom/students";
import { SubjectsProvider } from "./custom/subjects";
import { SemestersProvider } from "./custom/semesters";
import { AuthTeachersProvider } from "./custom/authorizedTeachers";
import { ReportsProvider } from "./custom/reports";
import { TeachersProvider } from "./custom/teachers";

// ADD YOUR PROVIDERS HERE
const CustomProviders = [
  ClassroomProvider,
  SemestersProvider,
  StudentsProvider,
  SubjectsProvider,
  TeachersProvider,
  AuthTeachersProvider,
  ReportsProvider,
];

export default CustomProviders;
