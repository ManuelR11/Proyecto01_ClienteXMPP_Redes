import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AiFillPlusSquare } from "react-icons/ai";

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <AiFillPlusSquare style={{width: '180%', height: '180%', marginLeft: '-15px'}} variant="outlined" onClick={handleClickOpen}/>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          style: {
            backgroundColor: '#0D121C',  // Cambia el color de fondo
            color: 'white',              // Cambia el color del texto
            width: '300px',              // Cambia el tamaño de la pestaña
            height: '400px',             // Cambia el tamaño de la pestaña
            padding: '10px',             // Ajuste de padding
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)', // Cambia el tamaño y la opacidad de la sombra
          },
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cambia el color del fondo semi-transparente
            position: 'absolute',
            top: '117px',   // Ajusta la posición vertical del fondo
            left: '267px',  // Ajusta la posición horizontal del fondo
            width: '1000px', // Ajusta el ancho del área oscurecida
            height: '550px' // Ajusta la altura del área oscurecida
          }
        }}
      >
        <DialogTitle style={{ fontWeight: 'bold'}} >Nuevo Contacto</DialogTitle>
        <DialogContent>
          <DialogContentText style={{color: 'white'}}>
            Ingrese el nombre del nuevo contacto que desea ingresar
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="User name"
            type="email"
            fullWidth
            variant="standard"
            InputProps={{
              style: { color: 'white' }, // Cambia el color del texto a blanco
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
