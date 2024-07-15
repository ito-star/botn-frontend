import React, { useContext } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Menu from '@mui/material/Menu'
import { styled } from '@mui/system'
import { UserContext } from 'context/UserContext'
import { PopupContext } from 'context/PopupContext'
import { useNavigate } from 'react-router-dom'
import { dealListingUrl } from 'constants/clientRouteConstants'
const CustomMenu = styled(Menu)({
  '& .MuiTypography-root': {
    fontSize: '0.7rem',
  },
})
const TextMenu = ({ anchorEl, setAnchorEl, open, options, handleClose }) => {
  return (
    <CustomMenu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {options.map((optionItem) => (
        <MenuItem onClick={optionItem.onClick}>
          <ListItemText>{optionItem.ListItemText}</ListItemText>
        </MenuItem>
      ))}
    </CustomMenu>
  )
}

export default TextMenu
