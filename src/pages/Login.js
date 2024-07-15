import React, { useContext, useState } from 'react'
import AuthReusableComponent from '../components/AuthReusableComponent'
import styled from 'styled-components'
import { GoogleLogin } from 'react-google-login'
import { Link } from 'react-router-dom'
import { font_sm } from '../constants/font-sizes'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { isValidEmail, isValidPassword } from '../services/validators'
import { GoogleLoginCustom, LoginService } from '../services/authServices'
import { useNavigate } from 'react-router-dom'
import { setAuthToken } from '../services/LocalStorage/LocalStorageServices'
import { calculatorUrl, dealListingUrl } from 'constants/clientRouteConstants'
import { UserContext } from 'context/UserContext'
import { useNotification } from 'context/Notification'
import { PopupContext } from 'context/PopupContext'

const RegisterText = styled.div`
  margin-top: 1em;
  font-size: ${font_sm};
`
const BlueUnderlined = styled(Link)``

const ErrorContainer = styled.div`
  width: min(280px, 90%);
  font-size: ${font_sm};
  color: #f00;
`

const ForgotPasswordText = styled.div`
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

const PrivacyItems = styled.div`
  margin-top: 3em;
  display: flex;
  width: min(280px, 90%);
  justify-content: space-between;
  font-size: ${font_sm};
`

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  const { loginApiState, login } = LoginService()
  const navigate = useNavigate()
  const { setUserData } = useContext(UserContext)
  const { setLoginPopupOpen } = useContext(PopupContext)
  const { googleLogin } = GoogleLoginCustom()
  const showNotification = useNotification()
  const handleFocus = () => {
    setEmailError(false)
    setPasswordError(false)
  }

  const onGoogleOauthCustomSuccess = (responseData) => {
    console.log('loginSuccess', responseData)
    setAuthToken(responseData.token)
    responseData.userData.isLoggedIn = true
    setUserData(responseData.userData)
    console.log('navigate and login', setLoginPopupOpen)

    navigate(calculatorUrl)
  }
  const onGoogleOauthFailed = () => {
    showNotification({ type: 'error', text: 'Something went wrong' })
  }

  const onGoogleOauthSuccess = (googleResponse) => {
    console.log('oauthResponse', googleResponse)
    const payload = { tokenId: googleResponse.tokenId }
    googleLogin(payload, onGoogleOauthCustomSuccess, onGoogleOauthFailed)
  }

  const onLoginSuccess = (responseData) => {
    console.log('loginSuccess', responseData)
    setAuthToken(responseData.token)
    responseData.userData.isLoggedIn = true
    setUserData(responseData.userData)
    navigate(calculatorUrl)
  }

  const submitLogin = () => {
    const emailValid = isValidEmail(email)
    const passwordValid = isValidPassword(password)
    console.log('login', email, emailValid, password, passwordValid)
    if (emailValid && passwordValid) {
      console.log('login', email, password)
      login({ email, password }, onLoginSuccess)
    } else {
      if (!emailValid) {
        setEmailError(true)
      }
      if (!passwordValid) {
        setPasswordError(true)
      }
    }
  }

  return (
    <>
      <AuthReusableComponent heading="Login">
        <RegisterText>
          Don't have an account? <BlueUnderlined to="/signup">Signup</BlueUnderlined>
        </RegisterText>
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
        <Button
          onClick={() => {
            submitLogin()
          }}
        >
          Get in
        </Button>
        {loginApiState.error && (
          <ErrorContainer style={{ textAlign: 'center' }}>{loginApiState.error}</ErrorContainer>
        )}

        <ForgotPasswordText>
          Forgot Password? <BlueUnderlined to="/forgotPassword">Reset</BlueUnderlined>
        </ForgotPasswordText>

        <HorizontalLine>
          <OrText>or</OrText>
        </HorizontalLine>

        {/* oauth items */}
        <div className="oauthItems">
          <GoogleLogin
            clientId="139190260560-i5r76k060jal3lp01fud5os9th2s7asl.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={onGoogleOauthSuccess}
            onFailure={onGoogleOauthFailed}
            cookiePolicy={'single_host_origin'}
          />
        </div>

        <PrivacyItems>
          <div>Privacy</div>
          <div>Terms of use</div>
          <div>Help</div>
        </PrivacyItems>
      </AuthReusableComponent>
    </>
  )
}

export default Login
