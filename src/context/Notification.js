import React, { useReducer, useContext } from 'react'
import NotificationItem from '../components/NotificationItem'
import { v4 } from 'uuid'
import styled from 'styled-components'

const NotificationWrapper = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 999;
`

export const NotificationContext = React.createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [...state, action.payload]
    case 'REMOVE_NOTIFICATION':
      return state.filter((el) => {
        return el.id !== action.id
      })
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, [])
  return (
    <>
      <NotificationContext.Provider value={dispatch}>
        <NotificationWrapper>
          {state.map((notiItem) => (
            <NotificationItem key={notiItem.id} {...notiItem}></NotificationItem>
          ))}
        </NotificationWrapper>
        {children}
      </NotificationContext.Provider>
    </>
  )
}

export const useNotification = () => {
  const dispatch = useContext(NotificationContext)
  return (props) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: v4(),
        ...props,
      },
    })
  }
}

// export  Notification
