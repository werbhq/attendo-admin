import icon from "@mui/icons-material/LocalPolice";

import { MAPPING } from "../../provider/mapping";
import AuthorizedTeacherList from "./List";
import AuthorizedTeacherShow from "./Show";
import AuthorizedTeacherEdit from "./Edit";
import AuthorizedTeacherCreate from "./Create";

const Classroom = {
  name: MAPPING.AUTH_TEACHERS,
  icon,
  options: { label: "Authorized Teachers" },
  list: AuthorizedTeacherList,
  show: AuthorizedTeacherShow,
  edit: AuthorizedTeacherEdit,
  create: AuthorizedTeacherCreate,
};

export default Classroom;
