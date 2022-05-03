import SubjectList from "./List";
import SubjectShow from "./Show";
import icon from "@mui/icons-material/Class";
import { EditGuesser } from "react-admin";
import { MAPPING } from "../../provider/mapping";

const Subject = {
  name: MAPPING.SUBJECT,
  icon,
  options: { label: "Subjects" },
  list: SubjectList,
  show: SubjectShow,
  edit: EditGuesser,
};

export default Subject;
