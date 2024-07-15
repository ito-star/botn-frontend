import React from 'react'
import styled from 'styled-components'
import { screen_md, screen_sm } from '../constants/screen-size'
import { font_lg } from '../constants/font-sizes'
const AuthContainer = styled.div`
  width: ${(props) => (props.isPopup ? '100%' : '100vw')};
  height: ${(props) => (props.isPopup ? '100%' : '100vh')};
  background-color: #bae5ff;
  /* background:grey; */
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: saturate(180%) blur(7px);
  overflow: hidden;
`

const Container = styled.div`
  /* width:max(90% , 400px); */
  min-height: 80vh;
  width: ${(props) => (props.isPopup ? '100%' : '80%')};
  height: ${(props) => (props.isPopup ? '100%' : '80%')};
  display: flex;
  background-color: white;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.2);
  @media screen and (max-width: ${screen_sm}) {
    width: 100%;
    height: 100%;
  }
`

const LeftContainer = styled.div`
  flex: 0.9;
  min-width: min(350px, 100vw);
  display: flex;
  justify-content: center;
  align-items: center;
  /* background:grey; */
  /* background:red; */
`

const CenterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Logo = styled.img`
  width: 220px;
  height: auto;
`
const HeadingText = styled.div`
  margin-top: 1.2rem;
  font-size: ${font_lg};
  font-weight: 500;
`

const RightContainer = styled.div`
  flex: 1;
  background-color: white;
  @media only screen and (max-width: ${screen_md}) {
    display: none;
  }
`

const RightImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const Divider = styled.div`
  width: 1px;
  height: 70vh;
  margin: auto;
  background-color: #dadada;
  z-index: 1;
`

const AuthReusableComponent = ({ children, heading, type }) => {
  return (
    <AuthContainer isPopup={type === 'popup'}>
      <Container isPopup={type === 'popup'}>
        <LeftContainer>
          <CenterContainer>
            <Logo src="/images/Logo.svg"></Logo>
            <HeadingText>{heading}</HeadingText>
            {children}
          </CenterContainer>
        </LeftContainer>
        <Divider />
        <RightContainer>
          {/* <lottie-player src="https://assets8.lottiefiles.com/packages/lf20_pghai0vg.json" background="transparent" speed="1.3" style={{ width: "100%", height: "100%", marginTop: "4rem" }} loop autoplay></lottie-player> */}
          {/* <lottie-player src="https://assets7.lottiefiles.com/packages/lf20_rli35wrb.json" background="transparent" speed="1" style={{ width: "100%", height: "100%", marginTop: "4rem" }} loop autoplay></lottie-player> */}
          <lottie-player
            src="https://assets7.lottiefiles.com/packages/lf20_VeqtOe.json"
            background="transparent"
            speed="1"
            style={{ width: '100%', height: '100%', marginTop: '2rem', marginLeft: '-2rem' }}
            loop
            autoplay
          ></lottie-player>
          {/* <RightImage src="/images/istockphoto-1250153439-612x612.jpg"></RightImage> */}
        </RightContainer>
      </Container>
    </AuthContainer>
  )
}

export default AuthReusableComponent
