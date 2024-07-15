import React, { useContext } from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Menu from '@mui/material/Menu'
import { styled } from '@mui/system'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import { PopupContext } from '../../context/PopupContext'
import { dealListingUrl } from 'constants/clientRouteConstants'

const CustomMenu = styled(Menu)({
  '& .MuiTypography-root': {
    fontSize: '0.7rem',
  },
})

const ProfileMenu = ({ anchorEl, setAnchorEl, open }) => {
  const { userData, logout } = useContext(UserContext)
  const { setLoginPopupOpen } = useContext(PopupContext)
  const navigate = useNavigate()
  const handleClose = () => {
    setAnchorEl(null)
  }
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
      {!userData.isLoggedIn && (
        <MenuItem
          className="customised"
          onClick={() => {
            setLoginPopupOpen(true)
            handleClose()
          }}
        >
          <ListItemIcon>
            <LoginIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Login</ListItemText>
        </MenuItem>
      )}
      {userData.isLoggedIn && (
        <>
          <MenuItem
            className="customised"
            onClick={() => {
              navigate(dealListingUrl)
              handleClose()
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Deals</ListItemText>
          </MenuItem>
          <MenuItem className="customised" onClick={() => setLoginPopupOpen(true)}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem
            className="customised"
            onClick={() => {
              logout()
              handleClose()
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </>
      )}
    </CustomMenu>
  )
}

export default ProfileMenu
