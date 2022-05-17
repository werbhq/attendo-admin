import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const CustomAdd = ({ name }) => (
  <Button variant="contained">{name}</Button>
);

// todo : color error fix
export const CustomDelete = () => (
  <IconButton aria-label="delete" size="large" color="error">
    <DeleteIcon fontSize="inherit" />
  </IconButton>
);
