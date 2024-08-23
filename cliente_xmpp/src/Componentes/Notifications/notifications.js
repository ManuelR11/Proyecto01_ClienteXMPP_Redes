import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.5)' }}
  >
    •
  </Box>
);

export default function Notifications({ UsuarioNotification, onAccept, onDecline }) {
  return (
    <Card sx={{ minWidth: 275 }} style={{ color: 'white', backgroundColor: '#050A0F' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Agregar Contacto
        </Typography>
        <Typography variant="body2">
          <br />
          El Usuario: {UsuarioNotification} te quiere agregar como contacto
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" style={{ fontWeight: 'bold' }} onClick={() => onAccept()}>Agregar</Button>
        <Button size="small" style={{ fontWeight: 'bold' }} onClick={() => onDecline()}>Eliminar</Button>
      </CardActions>
    </Card>
  );
}
