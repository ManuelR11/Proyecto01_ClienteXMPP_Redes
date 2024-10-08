import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { GrStatusGoodSmall } from "react-icons/gr";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function CustomizedDialogs({ dialogTitle, dialogjid, dialogStatus, dialogDisp }) {
  const [open, setOpen] = React.useState(false);

  const Disponibilidad = () => {
    if (dialogDisp === 'chat') {
      return 'green';
    } else if (dialogDisp === 'away') {
      return 'orange';
    } else if (dialogDisp === 'xa') {
      return 'blue';
    } else if (dialogDisp === 'dnd') {
      return 'red';
    }
    return 'gray'; // Default color if none match
  };

  const Disponibilidad_name = () => {
    if (dialogDisp === 'chat') {
        return 'Disponible';
    } else if (dialogDisp === 'away') {
        return 'Ausente';
    } else if (dialogDisp === 'xa') {
        return 'No disponible';
    } else if (dialogDisp === 'dnd') {
        return 'Ocupado';
    }
    return 'Desconocido'; // Default color if none match
    };

  const iconColor1 = Disponibilidad();

  const disponibilidad_name = Disponibilidad_name();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>
        <GrStatusGoodSmall style={{ width: '20px', height: '20px', color: iconColor1 }} />
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        PaperProps={{
          component: 'form',
          style: {
            backgroundColor: '#0D121C',
            color: 'white',
            width: '300px',
            height: '300px',
            padding: '10px',
            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)',
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            top: '117px',
            left: '267px',
            width: '1000px',
            height: '550px',
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title" style={{fontWeight: 'bold'}}>
          {dialogTitle}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            {dialogjid}
          </Typography>
          <br />
          <Typography gutterBottom>
            Status: {dialogStatus}
          </Typography>
          <br />
          <Typography gutterBottom>
            Disponibilidad: {disponibilidad_name}
          </Typography>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}