import { ClassroomProvider } from "./custom/classroom";
import { StudentsProvider } from "./custom/students";
import { SubjectsProvider } from "./custom/subjects";
import { SemestersProvider } from "./custom/semesters";
import { AuthTeachersProvider } from "./custom/authorizedTeachers";

// ADD YOUR PROVIDERS HERE
const CustomProviders = [
  ClassroomProvider,
  SemestersProvider,
  StudentsProvider,
  SubjectsProvider,
  AuthTeachersProvider,
];

export default CustomProviders;
