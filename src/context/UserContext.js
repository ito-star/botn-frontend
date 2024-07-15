import React, { useState } from 'react'
import { setAuthToken } from 'services/LocalStorage/LocalStorageServices'

export const UserContext = React.createContext()
export const UserContextProvider = ({ children }) => {
  const [userData, setUserData] = useState('')

  const logout = () => {
    setUserData('')
    setAuthToken('')
  }
  return (
    <>
      <UserContext.Provider value={{ userData, setUserData, logout }}>
        {children}
      </UserContext.Provider>
    </>
  )
}
