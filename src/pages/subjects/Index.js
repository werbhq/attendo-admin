import icon from "@mui/icons-material/Class";
import SubjectList from "./List";
import SubjectShow from "./Show";
import SubjectEdit from "./Edit";
import { MAPPING } from "../../provider/mapping";
import SubjectCreate from "./Create";
const Subject = {
  name: MAPPING.SUBJECT,
  icon,
  options: { label: "Subjects" },
  list: SubjectList,
  show: SubjectShow,
  edit: SubjectEdit,
  create: SubjectCreate,
};

export default Subject;
