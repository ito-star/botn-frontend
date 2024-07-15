import React, { useContext } from 'react'
import { Box, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { dealListingUrl } from 'constants/clientRouteConstants'
import { HeaderContainer, Logo } from '../../pages/Calculator/CalculatorStyles'
import { UserDetailsWithMenu } from './UserDetailsWithMenu'
import CustomToggle from '../CustomToggle'
import { InvestmentInputContext } from '../../context/InvestmentInputContext'

const Header = () => {
  const navigate = useNavigate()
  const { isLogarithmic, setIsLogarithmic } = useContext(InvestmentInputContext)

  return (
    <HeaderContainer>
      <Logo src="./images/Logo.svg" onClick={() => navigate(dealListingUrl)} />
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: 200 }}>
          <CustomToggle
            value={isLogarithmic}
            setValue={setIsLogarithmic}
            yesLabel="Logarithmic"
            noLabel="Traditional"
          />
        </Box>
        <UserDetailsWithMenu />
      </Stack>
    </HeaderContainer>
  )
}

export default Header
