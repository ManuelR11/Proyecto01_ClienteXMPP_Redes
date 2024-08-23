import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AiFillPlusSquare } from "react-icons/ai";

export default function FormDialog({ onAddContact }) {
  const [open, setOpen] = React.useState(false);
  const [contactName, setContactName] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddContact(contactName);  // Pasa el nombre del contacto al componente padre
    handleClose();
  };

  return (
    <React.Fragment>
      <AiFillPlusSquare 
        style={{width: '40px', height: '40px'}} 
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
            height: '400px',
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
        <DialogTitle style={{ fontWeight: 'bold' }}>Nuevo Contacto</DialogTitle>
        <DialogContent>
          <DialogContentText style={{color: 'white'}}>
            Ingrese el nombre del nuevo contacto que desea ingresar
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="contactName"
            label="User name"
            type="text"
            fullWidth
            variant="standard"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)} // Actualiza el estado
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
