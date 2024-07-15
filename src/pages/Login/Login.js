import React from 'react'
import styled, { css } from 'styled-components/macro'
import { GoogleLogin } from 'react-google-login'
const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2181ff;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Logo = styled.img`
  width: 12rem;
`

const Title = styled.div`
  font-weight: 600;
  font-size: 1.3rem;
  color: white;
  padding-top: 2rem;
`
const Subtitle = styled.div`
  font-size: 0.8rem;
  color: white;
  padding: 0.5rem;
  opacity: 0.8;
`

const input = css`
  padding: 0.8rem;
  width: 14rem;
  border-radius: 0.5rem;
  border: none;
`

const Input = styled.input`
  ${input};
  margin-top: 0.5rem;
  background: #55a5ff70;

  color: white;
  &:focus: {
    outline: none;
  }
`
const SignInBtn = styled.button`
  ${input};
  color: #2181ff;
  background: white;
  margin-top: 0.8rem;
  font-weight: 700;
  font-size: 0.9rem;
`
const SignUpBtn = styled.button`
  ${input};
  background: #55a5ff70;
  margin-top: 0.5rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: white;
`
const ForgotPassword = styled.div`
  margin-top: 0.8rem;
  margin-bottom: 1.8rem;
  font-size: 0.8rem;
  color: #c0d3ff;
`

const Click = styled.span`
  font-weight: 600;
  color: white;
  margin-left: 0.5rem;
`
const Copyright = styled.div`
  position: absolute;
  bottom: 1rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
`

const Login = () => {
  const responseGoogle = (googleResponse) => {
    console.log(googleResponse)
  }

  return (
    <Container>
      <Content>
        <Logo src="/images/LogoWhite.svg"></Logo>
        <Title>Welcome Title Goes Here</Title>
        <Subtitle>Subtitle goes here, if needed</Subtitle>
        <Input placeholder="Username" />
        <Input placeholder="Password" />
        <SignInBtn>Sign In</SignInBtn>
        <SignUpBtn>Sign Up</SignUpBtn>
        <ForgotPassword>
          Forgot Password?<Click>Click here</Click>{' '}
        </ForgotPassword>
        <GoogleLogin
          clientId="139190260560-i5r76k060jal3lp01fud5os9th2s7asl.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          // onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
          className="authBtn"
        />
      </Content>
      <Copyright>Copyright &copy; 2021 Back Of The Napkin</Copyright>
    </Container>
  )
}

export default Login
