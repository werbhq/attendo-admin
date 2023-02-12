import { Chip } from "@mui/material";
import { useRecordContext } from "react-admin";
const MyTeacher = () => {
  const record = useRecordContext();
  // console.log(record.teachers)
  if (!record) return null;
  return (
    <ul style={{ padding: 0, margin: 0 }}>
      {record.teachers.map((e) => (
        <Chip key={e.id} sx={{ ml: 0.5, mt: 1 }} label={e.name} />
      ))}
    </ul>
  );
};
export default MyTeacher;
