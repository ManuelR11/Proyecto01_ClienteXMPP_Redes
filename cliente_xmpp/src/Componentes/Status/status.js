import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { GrStatusGoodSmall } from "react-icons/gr";

export default function BasicMenu({ onStatusChange }) {  // Receive the prop from Sidebar
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [iconColor, setIconColor] = React.useState('green'); // State for icon color
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (color, status) => {
    setIconColor(color);  // Update icon color
    onStatusChange(status);  // Call the function passed from Sidebar with the selected status
    handleClose();
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <GrStatusGoodSmall style={{ width: '25px', height: '25px', color: iconColor }} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => handleMenuItemClick('green', 'chat')}>disponible</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('orange', 'away')}>ausente</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('blue', 'xa')}>no disponible</MenuItem>
        <MenuItem onClick={() => handleMenuItemClick('red', 'dnd')}>ocupado</MenuItem>
      </Menu>
    </div>
  );
}
