import { useContext, useState } from 'react'
import AuthFullComponent from '../components/AuthReusableComponent'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { emailSentUrl, loginUrl } from '../constants/clientRouteConstants'
import { font_sm } from '../constants/font-sizes'
import { GoogleLogin } from 'react-google-login'
import { isValidEmail, isValidPassword } from '../services/validators'
import { SignupService } from '../services/authServices'
import { useNotification } from '../context/Notification'
import { useNavigate } from 'react-router-dom'
import { PopupContext } from '../context/PopupContext'
const BlueUnderlined = styled('span')`
  color: blue;
  textdecoration: underline;
  cursor: pointer;
`

const LoginPath = styled.div`
  margin-top: 1em;
  font-size: ${font_sm};
`

const HorizontalLine = styled.div`
  width: min(280px, 90%);
  text-align: center;
  border-bottom: 1px solid #9e9e9e;
  line-height: 0.1em;
  margin: 2em 0 20px;
`

const OrText = styled.span`
  background: #fff;
  padding: 0 10px;
  font-size: ${font_sm};
`

const ErrorContainer = styled.div`
  width: min(280px, 90%);
  font-size: ${font_sm};
  color: #f00;
`

const Signup = () => {
  const [username, setUsername] = useState('')
  const [usernameError, setUsernameError] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState(false)
  const { setLoginPopupOpen } = useContext(PopupContext)
  const { signupApiState, signup } = SignupService()
  const showNotification = useNotification()
  const navigate = useNavigate()
  const handleFocus = () => {
    setUsernameError(false)
    setEmailError(false)
    setPasswordError(false)
    setConfirmPasswordError(false)
  }

  const onSignupSuccess = (responseData) => {
    console.log('signupSuccess', responseData)
    navigate(emailSentUrl, { state: { type: 'activate account', email: email } })
  }

  const onSignupFailed = (errorText) => {
    console.log('failed', signupApiState)
    showNotification({ type: 'error', text: errorText })
  }

  const submitSignup = () => {
    const usernameValid = username?.length > 0
    const emailValid = isValidEmail(email)
    const passwordValid = isValidPassword(password)
    const confirmPasswordValid = password === confirmPassword
    console.log(emailValid, passwordValid, confirmPasswordValid)
    if (emailValid && passwordValid && confirmPasswordValid && usernameValid) {
      signup({ email, password, username }, onSignupSuccess, onSignupFailed)
    } else {
      setUsernameError(!usernameValid)
      setEmailError(!emailValid)
      setPasswordError(!passwordValid)
      setConfirmPasswordError(!confirmPasswordValid)
    }
  }

  const navigateToLogin = () => {
    setLoginPopupOpen(true)
  }

  return (
    <div>
      <AuthFullComponent heading="Signup">
        <Input
          type="text"
          placeholder="Username"
          onFocus={handleFocus}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        {usernameError && <ErrorContainer>Username cannot be empty</ErrorContainer>}
        <Input
          type="email"
          placeholder="Email"
          onFocus={handleFocus}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {emailError && <ErrorContainer>please enter valid email</ErrorContainer>}
        <Input
          type="password"
          placeholder="Password"
          onFocus={handleFocus}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        {passwordError && <ErrorContainer>password minimum of 8 characters</ErrorContainer>}
        <Input
          type="password"
          placeholder="Confirm password"
          onFocus={handleFocus}
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        {confirmPasswordError && <ErrorContainer>passwords doesn't match</ErrorContainer>}
        <Button
          onClick={() => {
            submitSignup()
          }}
        >
          Signup
        </Button>
        <LoginPath>
          Already have account? <BlueUnderlined onClick={navigateToLogin}>Login</BlueUnderlined>
        </LoginPath>
        <HorizontalLine>
          <OrText>or</OrText>
        </HorizontalLine>

        {/* oauth items */}
        <div className="oauthItems">
          <GoogleLogin
            clientId="139190260560-i5r76k060jal3lp01fud5os9th2s7asl.apps.googleusercontent.com"
            buttonText="Login with Google"
            // onSuccess={responseGoogle}
            // onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            // render={renderProps => (
            //   <button className="authBtn" onClick={renderProps.onClick} disabled={renderProps.disabled}>Login with Google</button>
            // )}
          />
        </div>
      </AuthFullComponent>
    </div>
  )
}

export default Signup
