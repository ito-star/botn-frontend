import React, { useState, useEffect, useContext, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { GoAlert } from 'react-icons/go'
import { BiErrorCircle } from 'react-icons/bi'
import { FaRegThumbsUp } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import { NotificationContext } from '../context/Notification'

const slideInAnimation = keyframes`

  0% {
    transform: translateY(-50px);
    opacity:0;
  }
  100% {
    transform: translateY(0);
    opacity:100%;
  }
}
`

const slideOutAnimation = keyframes`

  0% {
    transform: translateY(0px);
    opacity:100%;
  }
  100% {
    transform: translateY(-50px);
    opacity:0%;
  }
}
`

const widthTransform = keyframes`
  from{
    width:0%
  }
  to{
    width:100%
  }
`

const NotificationContainer = styled.div`
  width: min(300px, 30vw);
  padding: 1rem;
  z-index: 999;
  background-color: grey;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  background-color: ${(props) => props.background};
  box-shadow: 0 0 2px #ffffff31;
  position: relative;
  animation: ${slideInAnimation} 0.5s ease;
  transition: all 0.2s ease;
  &.exit {
    animation: ${slideOutAnimation} 0.5s ease;
  }
`

const Icon = styled.div`
  font-size: 1.5rem;
  margin-right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => {
    return props.color
  }};
`

const NotificationText = styled.span`
  color: #2b2b2b;
`

const Bar = styled.div`
  position: absolute;
  bottom: 4px;
  left: 0;
  height: 4px;
  animation: ${widthTransform}
    ${(props) => {
      return props.time + 's'
    }}
    linear;
  background-color: ${(props) => {
    return props.bColor
  }};
`

const Cancel = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  color: #2b2b2b;
  font-weight: bold;
  &:hover {
    background: lightblue;
  }
`

const getStyle = (type) => {
  switch (type) {
    case 'success':
      return {
        icon: FaRegThumbsUp,
        backgroundColor: '#89ff719f',
        iconColor: '#47df00',
        barColor: '#73ff00',
      }
    case 'warn':
      return {
        icon: GoAlert,
        backgroundColor: '#fffd6e',
        iconColor: '#dfbd00',
        barColor: '#ffd900',
      }
    case 'error':
      return {
        icon: BiErrorCircle,
        backgroundColor: '#ff7171a1',
        iconColor: '#df0000',
        barColor: '#ff0000',
      }
    default:
      return {}
  }
}

const NotificationItem = ({ id, type, text }) => {
  const notificationTiming = 3000
  const [exit, setExit] = useState(false)
  const notificationStyle = getStyle(type)
  const dispatch = useContext(NotificationContext)
  const timerRef = useRef()
  useEffect(() => {
    startTimer()
  }, [])

  const handleCloseNotification = () => {
    setExit(true)
    clearInterval(timerRef.current)
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', id })
    }, 500)
  }

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      handleCloseNotification()
    }, notificationTiming)
  }

  return (
    <>
      {notificationStyle && (
        <NotificationContainer
          className={exit ? 'exit' : ''}
          background={notificationStyle.backgroundColor}
        >
          <Icon color={notificationStyle.iconColor}>
            <notificationStyle.icon />
          </Icon>
          <NotificationText>{text}</NotificationText>
          <Bar bColor={notificationStyle.barColor} time={notificationTiming / 1000}></Bar>
          <Cancel
            onClick={() => {
              handleCloseNotification()
            }}
          >
            <AiOutlineClose />
          </Cancel>
        </NotificationContainer>
      )}
    </>
  )
}

export default NotificationItem
