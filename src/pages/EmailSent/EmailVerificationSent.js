import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  padding: 1.5em;
  background: var(--backgroundColor);
`
const ContainerMiddle = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & .heyText {
    font-size: 2rem;
    font-weight: 500;
    margin-top: 1em;
    color: var(--themeColor);
  }

  & .emailSentImage {
    width: 20em;
  }
  
  & .resendEmailBtn {
    background - color: var(--themeColor);
    color: white;
    font - size: 1rem;
    padding: 1em 3em;
    margin - top: 3em;
  }
`

function EmailVerificationSent() {
  const [headingText, setHeadingText] = useState('')
  const [contentText, setContentText] = useState('')
  const [emailType, setEmailType] = useState('')
  const [email, setEmail] = useState('')
  const location = useLocation()
  const params = useParams()

  useEffect(() => {
    console.log('location type', location, params)
    if (location.state != null) {
      setEmailType(location.state.type)
      if (location.state.type === 'activate account') {
        setHeadingText('Hi ' + location.state.email + ',')
        setContentText('Check your email & click the link to activate your account')
      } else if (location.state.type === 'reset password') {
        setHeadingText('Password reset mail sent')
        setEmail(location.state.email)
        setContentText(
          'Password reset link sent to ' +
            location.state.email +
            '. Check your email to update password'
        )
      }
    }
  }, [])

  return (
    <Container>
      <ContainerMiddle>
        <Content className="content">
          <img className="logoInAuth" src="/images/Logo.svg" />
          <div className="heyText">{headingText}</div>
          <img className="emailSentImage" src="/images/emailSent.gif" />
          <div>{contentText}</div>
          {/* <button className="resendEmailBtn">Resend email</button> */}
        </Content>
      </ContainerMiddle>
    </Container>
  )
}

export default EmailVerificationSent
