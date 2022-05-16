import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";



 const CDeleteButton = ({record,handleClose,handleClickOpen,warn,handleDelete}) => {
   

    return (
      <>
        <Button
          variant="outlined"
          color="error"
          size="medium"
          onClick={handleClickOpen}
          sx={{verticalAlign: 'text-top'}}
        >
          <DeleteIcon sx={{verticalAlign: 'text-top'}}/>
          Delete
        </Button>

        <Dialog
          open={warn}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Permanent Removal!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              The data selected will Be <em>Permanently</em> removed are you
              sure you want to continue
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                handleDelete(record);
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  export default CDeleteButton;