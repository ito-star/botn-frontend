import React from 'react'
import styled from 'styled-components'

const BlurBackground = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(50, 50, 150, 0.4);
  backdrop-filter: saturate(180%) blur(7px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`

const PopupContainer = styled.div`
  background: white;
  width: ${(props) => props.width || '50rem'};
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 0 20px gray;
  overflow: hidden;
`
function PopupBackground({ children, width }) {
  return (
    <BlurBackground>
      <PopupContainer width={width}>{children}</PopupContainer>
    </BlurBackground>
  )
}

export default PopupBackground
