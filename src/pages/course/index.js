import CoursesList from "./List";
import icon from "@mui/icons-material/School";
import { MAPPING } from "../../provider/mapping";
import { CourseShow } from "./Show";
import { CourseEdit } from "./Edit";
import CourseCreate from "./Create";

const Courses = {
  name: MAPPING.COURSES,
  icon,
  options: { label: "Courses" },
  list: CoursesList,
  show: CourseShow,
  edit: CourseEdit,
  create: CourseCreate,
};

export default Courses;
