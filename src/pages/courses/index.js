import icon from "@mui/icons-material/Article";
import CoursesList from "./List";
import CourseShow from "./Show";
import CourseEdit from "./Edit";
import CourseCreate from "./Create";
import { MAPPING } from "../../provider/mapping";

const Courses = {
  name: MAPPING.SEMESTERS,
  icon,
  options: { label: "Courses" },
  list: CoursesList,
  show: CourseShow,
  edit: CourseEdit,
  create: CourseCreate,
};

export default Courses;
