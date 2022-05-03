import SubjectList from "./list";
import SubjectShow from "./show";
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
