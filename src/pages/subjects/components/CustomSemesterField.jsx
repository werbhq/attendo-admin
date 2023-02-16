import { Chip } from "@mui/material";

const CustomSemesterField = (record) => {
  if (!record[record.array]) {
    return <ul style={{ padding: 0, margin: 0 }}></ul>;
  }

  return (
    <ul style={{ padding: 0, margin: 0 }}>
      {record[record.array].map((item) => (
        <Chip
          sx={{ ml: 0.5, mt: 1 }}
          key={item[record.chip]}
          label={item[record.chip]}
        />
      ))}
    </ul>
  );
};

export default CustomSemesterField;
