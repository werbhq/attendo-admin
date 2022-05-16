import { Button,IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

export const customAdd = () => (
    <Button variant="contained">NEW</Button>
);
export const customDelete = () => (
    <IconButton aria-label="delete" size="large" color="error">
        <DeleteIcon fontSize="inherit" />
    </IconButton>
   
);

