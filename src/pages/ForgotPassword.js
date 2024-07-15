import { emailSentUrl } from 'constants/clientRouteConstants'
import { useNotification } from 'context/Notification'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ForgotPasswordService } from 'services/authServices'
import { isValidEmail } from 'services/validators'
import AuthReusableComponent from '../components/AuthReusableComponent'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

const ForgotPassword = () => {
  const [email, setEmail] = useState()
  const showNotification = useNotification()
  const { forgotPassword, forgotPasswordApiState } = ForgotPasswordService()
  const navigate = useNavigate()
  const onForgotPasswordSuccess = () => {
    navigate(emailSentUrl, { state: { type: 'reset password', email: email } })
  }

  const onForgotPasswordFail = () => {
    showNotification({ type: 'error', text: 'something went wrong' })
  }

  const handleSubmit = () => {
    if (isValidEmail(email)) {
      forgotPassword({ email: email }, onForgotPasswordSuccess, onForgotPasswordFail)
    } else {
      showNotification({ type: 'error', text: 'Please enter valid email' })
    }
  }

  return (
    <AuthReusableComponent heading="Forgot Password">
      <Input
        type="email"
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </AuthReusableComponent>
  )
}

export default ForgotPassword
