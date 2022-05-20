import CoursesList from "./List";
import CourseShow from "./Show";
import icon from "@mui/icons-material/School";
import { MAPPING } from "../../provider/mapping";
// import CoursesCreate from "./Create";


const Courses = {
  name: MAPPING.SEMESTERS,
  icon,
  options: { label: "Courses" },
  list: CoursesList,
   show: CourseShow,
//   create: CoursesCreate,
};




export default Courses;
