import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { IoNotifications } from "react-icons/io5";
import Notifications from './notifications';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function Notifications_conteiner({ UsuarioNotification, onResponse }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAccept = () => {
    onResponse('accepted');
    handleClose();
  };

  const handleDecline = () => {
    onResponse('declined');
    handleClose();
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}>
        <IoNotifications style={{ width: '30px', height: '30px', color: 'white' }} />
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
            width: '500px',
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
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title" style={{ fontWeight: 'bold' }}>
          Notificaciones
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
          {UsuarioNotification && (
            <Notifications 
              UsuarioNotification={UsuarioNotification} 
              onAccept={handleAccept} 
              onDecline={handleDecline} 
            />
          )}
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
