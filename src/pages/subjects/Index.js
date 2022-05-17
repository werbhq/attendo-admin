import SubjectList from "./List";
import SubjectShow from "./Show";
import icon from "@mui/icons-material/Class";
import { MAPPING } from "../../provider/mapping";
import { SubjectEdit } from "./Edit";

const Subject = {
  name: MAPPING.SUBJECT,
  icon,
  options: { label: "Subjects" },
  list: SubjectList,
  show: SubjectShow,
  edit: SubjectEdit,
};

export default Subject;
