import { ClassroomProvider } from "./custom/classroom";
import { StudentsProvider } from "./custom/students";
import { SubjectsProvider } from "./custom/subjects";
import { SemestersProvider } from "./custom/courses";

// ADD YOUR PROVIDERS HERE
const CustomProviders = [
  ClassroomProvider,
  SemestersProvider,
  StudentsProvider,
  SubjectsProvider,
];

export default CustomProviders;
