import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import ProfileMenu from 'components/Menus/ProfileMenu'
import { UserDetails } from '../../pages/Calculator/CalculatorStyles'

export const UserDetailsWithMenu = () => {
  const { userData } = useContext(UserContext)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <>
      <UserDetails
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <div className="user">
          <div className="username">{userData.isLoggedIn ? userData.username : 'Users Name'}</div>
          <div className="user-email">{userData.isLoggedIn ? userData.email : 'Guest'}</div>
        </div>
        <img className="downArrow" src="./images/DropDown.svg" />
      </UserDetails>
      <ProfileMenu anchorEl={anchorEl} setAnchorEl={setAnchorEl} open={open} />
    </>
  )
}
