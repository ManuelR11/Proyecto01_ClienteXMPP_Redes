import React from 'react';
import './mensaje.css';

const Mensaje = ({ mensaje, esMio }) => {
  return (
    <div className={`mensaje-container ${esMio ? 'mio' : 'received'}`}>
      <div className="mensaje-burbuja">
        {mensaje}
      </div>
    </div>
  );
};

export default Mensaje;
