import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { SiStatuspage } from "react-icons/si";

export default function FormDialog1({ onStatusName }) {
  const [open, setOpen] = React.useState(false);
  const [StatusName, setStatusName] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onStatusName(StatusName); 
    handleClose();
  };

  return (
    <React.Fragment>
      <SiStatuspage 
        style={{width: '30px', height: '30px', color: 'white'}} 
        variant="outlined" 
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          style: {
            backgroundColor: '#0D121C',
            color: 'white',
            width: '300px',
            height: '250px',
            padding: '10px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
          },
          onSubmit: handleSubmit,
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            top: '117px',
            left: '267px',
            width: '1000px',
            height: '550px'
          }
        }}
      >
        <DialogTitle style={{ fontWeight: 'bold' }}>Status Actual</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="StatusName"
            type="text"
            fullWidth
            variant="standard"
            value={StatusName}
            onChange={(e) => setStatusName(e.target.value)} // Actualiza el estado
            InputProps={{
              style: { color: 'white' },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{color: 'white'}}>Cerrar</Button>
          <Button type="submit" style={{color: 'white'}}>Agregar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
