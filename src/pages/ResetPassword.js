import { useContext, useState } from 'react'
import AuthReusableComponent from '../components/AuthReusableComponent'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import styled from 'styled-components'
import { font_sm } from 'constants/font-sizes'
import { isValidPassword } from 'services/validators'
import { useNavigate, useParams } from 'react-router-dom'
import { ResetPasswordService } from 'services/authServices'
import { setAuthToken } from 'services/LocalStorage/LocalStorageServices'
import { UserContext } from 'context/UserContext'
import { useNotification } from 'context/Notification'
import { dealListingUrl, loginUrl } from 'constants/clientRouteConstants'

const ErrorContainer = styled.div`
  width: min(280px, 90%);
  font-size: ${font_sm};
  color: #f00;
`

const ResetPassword = () => {
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [passwordError, setPasswordError] = useState()
  const [confirmPasswordError, setConfirmPasswordError] = useState()
  const params = useParams()
  const { setUserData } = useContext(UserContext)
  const { resetPassword, resetPasswordApiState } = ResetPasswordService()
  const showNotification = useNotification()
  const navigate = useNavigate()
  const onResetPasswordSuccess = (responseData) => {
    setAuthToken(responseData.token)
    setUserData(responseData)
    showNotification({ type: 'success', text: 'Password reset success' })
    navigate(loginUrl)
  }

  const onResetPasswordFail = (errorString) => {
    showNotification({ type: 'error', text: errorString })
    navigate(loginUrl)
  }

  const handleSubmit = () => {
    const passwordValid = isValidPassword(password)
    const confirmPasswordValid = password === confirmPassword
    if (passwordValid && confirmPasswordValid) {
      const payload = {
        verificationToken: params.verificationString,
        password: password,
      }
      resetPassword(payload, onResetPasswordSuccess, onResetPasswordFail)
    }
  }

  return (
    <AuthReusableComponent heading="Reset password">
      <Input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      {passwordError && <ErrorContainer>Minimum of 8 characters</ErrorContainer>}
      <Input
        type="password"
        placeholder="Confirm password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
      />
      {confirmPasswordError && <ErrorContainer>Passwords doesn't match</ErrorContainer>}
      <Button onClick={handleSubmit}>Reset Password</Button>
    </AuthReusableComponent>
  )
}

export default ResetPassword
