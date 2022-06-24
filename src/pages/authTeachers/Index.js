// I found ico from here https://mui.com/material-ui/material-icons/?query=security
import icon from "@mui/icons-material/LocalPolice";

import { MAPPING } from "../../provider/mapping";
import { ListGuesser, ShowGuesser, EditGuesser } from "react-admin";

const Classroom = {
  name: MAPPING.AUTH_TEACHERS,
  icon,
  options: { label: "Authorized Teachers" },
  list: ListGuesser,
  show: ShowGuesser,
  edit: EditGuesser,
  // TODO: Add Create Guessed
};

export default Classroom;
